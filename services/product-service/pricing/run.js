const { runPriceCheck } = require("./tracker")

runPriceCheck().then((result) => {
  console.log(`Checked ${result.checked} products, ${result.changed} price(s) changed.`)
  for (const drop of result.drops) {
    console.log(`  ↓ ${drop.name}: £${drop.oldPrice} → £${drop.newPrice} (${drop.percentOff}% off)`)
  }
  process.exit(0)
})
