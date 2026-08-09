const db = require("./db")

const products = [
  {
    id: "1", name: "CeraVe Moisturising Cream 340g", brand: "CeraVe",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Dermatologist-recommended moisturiser with ceramides and hyaluronic acid. Identical ingredients to La Mer for a fraction of the price.",
    original_price: 18.99, sale_price: 11.99, discount_percent: 37,
    image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Boots", rating: 4.8, review_count: 12400, dupe_for: "La Mer Crème de la Mer",
  },
  {
    id: "2", name: "The Ordinary Hyaluronic Acid 2% + B5", brand: "The Ordinary",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Hydration serum with multiple weights of hyaluronic acid. A genuine dupe for SkinCeuticals Hyaluronic Acid Intensifier.",
    original_price: 12.90, sale_price: 7.90, discount_percent: 39,
    image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "ASOS", rating: 4.7, review_count: 8900, dupe_for: "SkinCeuticals Hyaluronic Acid",
  },
  {
    id: "3", name: "Garnier Vitamin C Brightening Serum 30ml", brand: "Garnier",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Fast-absorbing vitamin C serum that brightens and evens skin tone. Works just as well as Skinceuticals CE Ferulic.",
    original_price: 14.99, sale_price: 8.99, discount_percent: 40,
    image_url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Superdrug", rating: 4.5, review_count: 5600, dupe_for: "Skinceuticals CE Ferulic",
  },
  {
    id: "4", name: "Aldi Mamia Ultra Dry Nappies Size 4", brand: "Mamia",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "Consistently rated alongside Pampers in independent tests. 48 nappies for less than half the price.",
    original_price: 4.99, sale_price: 2.99, discount_percent: 40,
    image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Aldi", rating: 4.6, review_count: 3200, dupe_for: "Pampers Active Fit",
  },
  {
    id: "5", name: "Tommee Tippee Closer to Nature Bottles 3pk", brand: "Tommee Tippee",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "Anti-colic baby bottles with breast-like teat. Currently on sale — same quality as Philips Avent at a better price.",
    original_price: 24.99, sale_price: 14.99, discount_percent: 40,
    image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Boots", rating: 4.7, review_count: 6700, dupe_for: "Philips Avent Natural",
  },
  {
    id: "6", name: "Chicco Next2Me Magic Co-Sleeping Crib", brand: "Chicco",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "Side-sleeping crib with 9 height positions. Equivalent to Snuzpod at significantly lower cost.",
    original_price: 249.99, sale_price: 179.99, discount_percent: 28,
    image_url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "John Lewis", rating: 4.6, review_count: 2100, dupe_for: "Snuzpod 4",
  },
  {
    id: "7", name: "Tower Vortx Air Fryer 4L", brand: "Tower",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "Rapid air circulation technology, 4L capacity, 1500W. Consistently outperforms Philips Airfryer in consumer tests.",
    original_price: 59.99, sale_price: 34.99, discount_percent: 42,
    image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Currys", rating: 4.5, review_count: 4800, dupe_for: "Philips Airfryer Essential",
  },
  {
    id: "8", name: "Dunelm Waffle Towel Set 4pc", brand: "Dunelm",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "600gsm Egyptian cotton waffle towels. Softer than the White Company equivalent at a third of the price.",
    original_price: 34.99, sale_price: 19.99, discount_percent: 43,
    image_url: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Dunelm", rating: 4.4, review_count: 3100, dupe_for: "The White Company Waffle Towel",
  },
  {
    id: "9", name: "Salter Megastone Non-Stick Pan Set 3pc", brand: "Salter",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "3-layer non-stick coating with marble effect. Performs like Le Creuset non-stick at a fraction of the cost.",
    original_price: 49.99, sale_price: 27.99, discount_percent: 44,
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Argos", rating: 4.3, review_count: 2900, dupe_for: "Le Creuset Toughened Non-Stick",
  },
  {
    id: "10", name: "Soundcore by Anker Q30 Headphones", brand: "Soundcore",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Hybrid Active Noise Cancelling, 40hr battery, Hi-Res Audio. Reviewers consistently prefer it over Sony WH-1000XM3.",
    original_price: 79.99, sale_price: 44.99, discount_percent: 44,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Amazon", rating: 4.6, review_count: 18400, dupe_for: "Sony WH-1000XM4",
  },
  {
    id: "11", name: "Nothing Ear (2) True Wireless Earbuds", brand: "Nothing",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Dual-driver system, active noise cancellation, 36hr total battery. Sound quality matches AirPods Pro at lower cost.",
    original_price: 149.00, sale_price: 99.00, discount_percent: 34,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "John Lewis", rating: 4.5, review_count: 7600, dupe_for: "Apple AirPods Pro 2",
  },
  {
    id: "12", name: "Xiaomi Redmi Note 13 Pro 256GB", brand: "Xiaomi",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "200MP camera, AMOLED display, 5000mAh battery with 67W charging. Flagship features without the flagship price.",
    original_price: 379.99, sale_price: 279.99, discount_percent: 26,
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    affiliate_url: "#", merchant: "Currys", rating: 4.4, review_count: 4200, dupe_for: "Samsung Galaxy S23",
  },
  {
    id: "13", name: "Nourish London Protect Skincare Essentials Starter Kit", brand: "Nourish London",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Certified organic, vegan 4-piece routine (cleanser, toning mist, peptide serum, moisturiser) with vitamin C and hyaluronic acid for dry, dehydrated skin. Same key actives as SkinCeuticals C E Ferulic for a fraction of the price.",
    original_price: 38.00, sale_price: 32.00, discount_percent: 16,
    image_url: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400&h=400&fit=crop",
    affiliate_url: "https://tidd.ly/4fKZbHd", merchant: "Nourish London", rating: 4.4, review_count: 16, dupe_for: "SkinCeuticals C E Ferulic",
  },
  {
    id: "14", name: "Soundcore Liberty 5 Pro Wireless Noise Cancelling Earbuds Black", brand: "Soundcore",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "True wireless earbuds with active noise cancellation, wireless charging, and up to 10 hours of playback. Same premium features as AirPods Pro or Bose QuietComfort Earbuds for a fraction of the price.",
    original_price: 201.99, sale_price: 153.85, discount_percent: 24,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2026%2F06%2F03%2Fsoundcore-liberty-5-pro-goffline--europe-excluded-uk-plug-black-1-product-type-headset-connecti-461395.webp&feedId=42863&k=579e14fc485649b5dc1484047a5dddac761e6edd",
    affiliate_url: "https://www.awin1.com/pclick.php?p=44842301596&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: "Bose QuietComfort Earbuds",
  },
  {
    id: "15", name: "Bose QuietComfort Earbuds Headset Wireless In-ear Bluetooth Black", brand: "Bose",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Genuine Bose QuietComfort Earbuds with class-leading noise cancellation, currently discounted direct from a trusted UK retailer.",
    original_price: 188.84, sale_price: 162.27, discount_percent: 14,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2026%2F07%2F29%2Fbose-quietcomfort-earbuds-product-type-headset-connectivity-technology-wireless-bluetooth-cable-466385.webp&feedId=42863&k=487adbc3b48493caf92daddc765ceb5a8e2673e7",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45383741025&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "16", name: "Soundcore Space One Pro Headset Wireless Head-band Calls/Music Bluetooth Black", brand: "Soundcore",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Over-ear wireless headphones with adaptive noise cancellation and up to 60 hours of battery life. A dupe for Sony WH-1000XM5 or Bose QuietComfort at a third of the price.",
    original_price: 226.99, sale_price: 153.85, discount_percent: 32,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2024%2F10%2F23%2Fsoundcore-space-one-pro-product-type-headset-connectivity-technology-wireless-bluetooth-recomme-389030.webp&feedId=42863&k=83b176fc4a1654681304d4975595162c0badcc22",
    affiliate_url: "https://www.awin1.com/pclick.php?p=39140134060&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: "Sony WH-1000XM5",
  },
  {
    id: "17", name: "Eufy SoloCam S220 2K Smart Security Camera CCTV - 2 Pack", brand: "Eufy",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "2K wireless security cameras with local storage, so there's no monthly subscription needed, unlike Ring or Nest. Sold as a 2-pack for whole-home coverage.",
    original_price: 180.99, sale_price: 133.27, discount_percent: 26,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2024%2F04%2Feufy-solocam-s220-2-cam-pack-ip-security-camera-indoor--outdoor-wireless-ceilingwall-white-cube-344925.jpg&feedId=42863&k=d021f7e81866532e1bbf99a75b3cfd3f73af234d",
    affiliate_url: "https://www.awin1.com/pclick.php?p=36214849706&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: "Ring Stick Up Cam",
  },
  {
    id: "18", name: "TP-Link Tapo Video Doorbell Camera", brand: "TP-Link",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Wireless video doorbell with night vision and two-way audio, the same core features as Ring's doorbell without the brand premium.",
    original_price: 107.99, sale_price: 74.33, discount_percent: 31,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2024%2F06%2Ftp-link-tapo-d210-3-mp-2304-x-1296-pixels-1296p-cmos-25-4-3-mm-1-3-15-fps-tapo-d210-372076.jpg&feedId=42863&k=58bc580daf755b13a2b50a1bb3ca64f35d1acc13",
    affiliate_url: "https://www.awin1.com/pclick.php?p=37967561504&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: "Ring Video Doorbell",
  },
  {
    id: "19", name: "Eufy L60 Hybrid Robot Vacuum & Mop", brand: "Eufy",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Robot vacuum and mop combo with app control and auto-charging. Performs like a Roomba or Dyson robot vacuum at a much lower price.",
    original_price: 385.99, sale_price: 299.92, discount_percent: 22,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2024%2F09%2Feufy-l60-hybrid-robot-vacuum-product-colour-black-shape-round-dust-capacity-total-0-35-l-water--370574.jpg&feedId=42863&k=dcba162fdca0217ec2a3a8f4c65106a68b8cac2a",
    affiliate_url: "https://www.awin1.com/pclick.php?p=37817466788&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: "iRobot Roomba Combo",
  },
  {
    id: "20", name: "Logitech G G435 LIGHTSPEED Wireless Gaming Headset", brand: "Logitech",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Lightweight wireless gaming headset with a low-latency LIGHTSPEED connection and Dolby Atmos support. A budget-friendly alternative to premium gaming headsets like SteelSeries Arctis or Razer BlackShark.",
    original_price: 110.99, sale_price: 76.28, discount_percent: 31,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2022%2F07%2Flogitech-g-g435-lightspeed-wireless-gaming-headset-product-type-headset-connectivity-technology-320156.jpg&feedId=42863&k=aaf1a09201d651228ce0c20bae9f872ffec46bd8",
    affiliate_url: "https://www.awin1.com/pclick.php?p=37452671494&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: "SteelSeries Arctis Nova",
  },
  {
    id: "21", name: "LG 43UA75006LA.AEK TV 109.2 cm (43\") 4K Ultra HD Smart TV Wi-Fi Black", brand: "LG",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "43-inch 4K Ultra HD Smart TV with Wi-Fi and webOS. A genuinely discounted mid-size TV from a trusted name, no compromise brand needed.",
    original_price: 402.99, sale_price: 283.12, discount_percent: 30,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2025%2F10%2F23%2Flg--109-2-cm-43-3840-x-2160-pixels-led-smart-tv-wi-fi-black-43ua75006la-aek-412770.webp&feedId=42863&k=3cc0aa64beb97e3ec97fdce187cb900744c9d44d",
    affiliate_url: "https://www.awin1.com/pclick.php?p=42941043694&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "22", name: "Samsung 55\" Crystal UHD U8020F 4K Smart TV (2025)", brand: "Samsung",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "55-inch Crystal UHD 4K Smart TV from Samsung's 2025 range. A recognisable big-name TV at a size and price that undercuts flagship OLED models.",
    original_price: 540.99, sale_price: 479.21, discount_percent: 11,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2026%2F06%2F13%2Fsamsung-55-crystal-uhd-u8020f-4k-smart-tv-2025-139-7-cm-55-3840-x-2160-pixels-led-smart-tv-wi-f-463652.webp&feedId=42863&k=ccf64cedf23646c2dec9da89ed78f78777a8be5d",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45010822712&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "23", name: "PREMIUM REFURBISHED Lenovo ThinkPad E14 Intel Core i5-1135G7 11th Gen Laptop 14 Inch Full HD 1080p Screen 8GB RAM 256GB SSD Windows 11 Pro", brand: "Lenovo",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Premium refurbished ThinkPad E14 with an 11th Gen Intel Core i5, 8GB RAM, and a 256GB SSD, running Windows 11 Pro. ThinkPads are built for business reliability and hold their value well. Refurbished, not new.",
    original_price: 342.81, sale_price: 296.14, discount_percent: 14,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2026%2F07%2F23%2Flalen-e14i58256-premium-refurbished-lenovo-thinkpad-e14-intel-core-i5-1135g7-11th-gen-laptop-14.webp&feedId=42863&k=344f4a5024e45284790c234e9a53e534d27175a9",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45185897144&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "24", name: "A2C HP EliteBook 840 G6 Intel Core i5 i5-8265U Laptop 35.6 cm (14\") Full HD 16 GB DDR4-SDRAM 256 GB SSD Wi-Fi 5 (802.11ac) Windows 11 Pro UK English Silver", brand: "HP",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Premium refurbished HP EliteBook 840 G6 with an Intel Core i5, 16GB RAM, and a 256GB SSD, running Windows 11 Pro. Business-grade build quality at a fraction of new laptop prices. Refurbished, not new.",
    original_price: 484.99, sale_price: 320.21, discount_percent: 34,
    image_url: "https://images2.productserve.com/?w=400&h=400&bg=white&trim=5&t=letterbox&url=ssl%3Aassets.media-quzo.co.uk%2Fsite%2Fcatalogue%2Flarge%2F2024%2F04%2Fpremium-refurbished-hp-elitebook-840-g6-intel-core-i5-8365u-8th-gen-laptop-14-inch-full-hd-1080-368071.jpg&feedId=42863&k=22739786b0bcefe60e21ce5dccbc64130aca7938",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45343767282&a=3013053&m=19849", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
]

const insert = db.prepare(`
  INSERT OR REPLACE INTO products
    (id, name, brand, category, category_slug, description, original_price, sale_price,
     discount_percent, image_url, affiliate_url, merchant, rating, review_count, dupe_for)
  VALUES
    (@id, @name, @brand, @category, @category_slug, @description, @original_price, @sale_price,
     @discount_percent, @image_url, @affiliate_url, @merchant, @rating, @review_count, @dupe_for)
`)

const seedAll = db.transaction((rows) => {
  for (const row of rows) insert.run(row)
})

seedAll(products)
console.log(`Seeded ${products.length} products.`)
