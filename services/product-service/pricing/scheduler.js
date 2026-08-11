const cron = require("node-cron")
const { runPriceCheck } = require("./tracker")

const DEFAULT_SCHEDULE = "0 6 * * *" // once a day at 06:00 server time

function startPriceCheckScheduler() {
  const schedule = process.env.PRICE_CHECK_CRON || DEFAULT_SCHEDULE

  cron.schedule(schedule, async () => {
    try {
      const result = await runPriceCheck()
      console.log(
        `[price-check] checked ${result.checked}, ${result.changed} changed, ${result.drops.length} drop(s), ${result.failures.length} failure(s)`
      )
      for (const failure of result.failures) {
        console.error(`[price-check] failed for ${failure.name} (${failure.id}): ${failure.error}`)
      }
    } catch (err) {
      console.error("[price-check] failed:", err)
    }
  })

  console.log(`[price-check] scheduler started (${schedule})`)
}

module.exports = { startPriceCheckScheduler }
