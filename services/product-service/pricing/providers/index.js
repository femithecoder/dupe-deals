// Picks which price provider the tracker uses. Defaults to the simulated provider
// so local dev works with no credentials; set PRICE_PROVIDER=awin (plus AWIN_API_KEY)
// to check real prices from Awin's datafeed.

function getProvider() {
  if (process.env.PRICE_PROVIDER === "awin") return require("./awin-datafeed")
  return require("./simulated")
}

module.exports = { getProvider }
