/**
 * Hand-written <title> text for products whose retailer feed name survives the
 * automatic trim badly.
 *
 * `shortenProductName()` cuts by length from the left, but feed names put the
 * word that says what the product is at the very end, after the modifiers. So
 * the automatic cut can drop "Headset" or "Laptop" while keeping "LIGHTSPEED".
 * Which keyword is worth keeping is a judgment call per product, and no
 * stop-list can tell that "LIGHTSPEED" is noise while "TurboBlaze" is the model
 * name people search for.
 *
 * Keyed by product id rather than added to mock-data, because live product data
 * comes from the gateway and would not carry an extra field.
 *
 * Keep each value at 48 characters or fewer so " | DupeDeals" still fits inside
 * the 60-character title limit. Anything not listed here falls back to the
 * automatic trim, so a new feed product is never over-length.
 */
export const PRODUCT_TITLE_OVERRIDES: Record<string, string> = {
  // Lost the product-type word entirely
  "13": "Nourish London Protect Skincare Starter Kit",
  "14": "Soundcore Liberty 5 Pro Noise Cancelling Earbuds",
  "15": "Bose QuietComfort Wireless Earbuds",
  "16": "Soundcore Space One Pro Wireless Headphones",
  "20": "Logitech G435 Wireless Gaming Headset",
  "21": 'LG 43UA75006LA 43" 4K Ultra HD Smart TV',
  "23": "Refurbished Lenovo ThinkPad E14 i5 Laptop",
  "24": "Refurbished HP EliteBook 840 G6 i5 Laptop",
  "27": "Nourish London Balance Anti-Blemish Moisturiser",
  "30": "Creative Pebble X 2.0 USB-C RGB Speakers",
  "32": "Genius SW-2.1 Bluetooth Subwoofer Speakers",
  "50": "Waterdrop K19-HG Countertop Reverse Osmosis",

  // Trimmed cleanly but left a dangling modifier or dropped a useful qualifier
  "17": "Eufy SoloCam S220 2K Security Camera 2 Pack",
  "42": "Lefant M210 Robot Vacuum Cleaner",
  "49": "Waterdrop FC-02-P Water Filter Tap",
}
