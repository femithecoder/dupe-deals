const cron = require("node-cron")
const { runPriceCheck } = require("./tracker")

const DEFAULT_SCHEDULE = "*/30 * * * *" // every 30 minutes

function startPriceCheckScheduler() {
  const schedule = process.env.PRICE_CHECK_CRON || DEFAULT_SCHEDULE

  cron.schedule(schedule, async () => {
    try {
      const result = await runPriceCheck()
      console.log(
        `[price-check] checked ${result.checked}, ${result.changed} changed, ${result.drops.length} drop(s)`
      )
    } catch (err) {
      console.error("[price-check] failed:", err)
    }
  })

  console.log(`[price-check] scheduler started (${schedule})`)
}

module.exports = { startPriceCheckScheduler }
