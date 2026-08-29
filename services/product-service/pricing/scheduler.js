const db = require("../db")
const { runPriceCheck } = require("./tracker")

// Catch-up scheduler. The old approach (node-cron firing at exactly 06:00, and
// GitHub Actions hitting /admin/price-check on a schedule) both kept silently
// missing days: node-cron does not catch up a fire missed while Render's free
// tier was asleep, and GitHub's scheduler drops queued jobs under load. Both
// share the same flaw, depending on an external trigger firing at an exact
// moment. This instead evaluates "is a check overdue?" on a frequent interval
// (and on every startup, which on Render free tier means every wake, since a
// wake is a cold start). The heavy work only runs when actually overdue, so a
// missed window is caught up on the next evaluation rather than lost. Depends
// only on the process being awake, which keep-alive.yml already ensures
// reliably, not on any scheduler firing at a precise time.

const EVAL_INTERVAL_MS = Number(process.env.PRICE_CHECK_EVAL_INTERVAL_MS) || 15 * 60 * 1000

// Full catalog once a day; Amazon more often, its Awin feed drifts from the
// live buy-box price faster than the others (see amazon-price-check.yml).
const FULL_MAX_AGE_MS = Number(process.env.PRICE_CHECK_FULL_MAX_AGE_MS) || 24 * 60 * 60 * 1000
const AMAZON_MAX_AGE_MS = Number(process.env.PRICE_CHECK_AMAZON_MAX_AGE_MS) || 4 * 60 * 60 * 1000

const STARTUP_DELAY_MS = 30 * 1000 // let the process settle before the first evaluation

let running = false // guards against a slow check overlapping the next tick

// Last time a check wrote history for products matching the merchant filter.
// Derived from price_history so there's no separate state to keep in sync, and
// it survives restarts (an in-memory timestamp would reset to "never" on every
// cold start and re-run immediately on each wake). filter: "amazon" | "other".
async function lastCheckedAt(filter) {
  const op = filter === "amazon" ? "=" : "<>"
  const { rows } = await db.query(
    `SELECT MAX(ph.checked_at) AS last
       FROM price_history ph
       JOIN products p ON p.id = ph.product_id
      WHERE p.merchant ${op} $1`,
    ["Amazon"]
  )
  return rows[0].last ? new Date(rows[0].last).getTime() : null
}

async function evaluateAndRun() {
  if (running) return
  running = true
  try {
    const now = Date.now()

    // A full run also checks Amazon, so check the full catalog first: if it's
    // due, running it covers Amazon too and there's no need for a second pass.
    const lastOther = await lastCheckedAt("other")
    if (lastOther === null || now - lastOther >= FULL_MAX_AGE_MS) {
      console.log("[price-check] full catalog overdue, running")
      logResult("full", await runPriceCheck())
      return
    }

    const lastAmazon = await lastCheckedAt("amazon")
    if (lastAmazon === null || now - lastAmazon >= AMAZON_MAX_AGE_MS) {
      console.log("[price-check] Amazon overdue, running")
      logResult("amazon", await runPriceCheck({ merchant: "Amazon" }))
    }
  } catch (err) {
    console.error("[price-check] evaluation failed:", err)
  } finally {
    running = false
  }
}

function logResult(scope, result) {
  console.log(
    `[price-check] (${scope}) checked ${result.checked}, ${result.changed} changed, ${result.drops.length} drop(s), ${result.failures.length} failure(s)`
  )
  for (const failure of result.failures) {
    console.error(`[price-check] failed for ${failure.name} (${failure.id}): ${failure.error}`)
  }
}

function startPriceCheckScheduler() {
  setTimeout(evaluateAndRun, STARTUP_DELAY_MS)
  setInterval(evaluateAndRun, EVAL_INTERVAL_MS)
  console.log(
    `[price-check] catch-up scheduler started (eval every ${Math.round(EVAL_INTERVAL_MS / 60000)}m; ` +
      `full > ${Math.round(FULL_MAX_AGE_MS / 3600000)}h, amazon > ${Math.round(AMAZON_MAX_AGE_MS / 3600000)}h)`
  )
}

module.exports = { startPriceCheckScheduler, evaluateAndRun }
