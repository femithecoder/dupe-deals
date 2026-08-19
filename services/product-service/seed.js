const db = require("./db")

const products = [
  {
    id: "25", name: "Nourish London Anti-Pollution Double Cleanse Duo", brand: "Nourish London",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Kale 3D Cleanser (100ml) and Kale Enzymatic Exfoliator (50ml) bundled as a duo, £9 cheaper than buying both separately. Pomegranate enzymes and jojoba beads exfoliate gently, kale and griffonia protect against pollution. Certified organic, vegan, cruelty-free.",
    original_price: 45.00, sale_price: 36.00, discount_percent: 20,
    image_url: "/images/nourish-london-logo.png",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=81819&awinaffid=3013053&clickref=anti-pollution-cleanse&ued=https%3A%2F%2Fnourishskinrange.com%2Fproducts%2Fanti-pollution-double-cleanse-duo", merchant: "Nourish London", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "26", name: "Nourish London Argan Anti-Ageing Peptide Serum 30ml", brand: "Nourish London",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Peptide (Palmitoyl Tripeptide-5) and hyaluronic acid serum with argan oil and Rose of Jericho extract. Soil Association certified organic, vegan, alcohol-free, and pregnancy-safe.",
    original_price: 35.00, sale_price: 35.00, discount_percent: 0,
    image_url: "/images/nourish-london-logo.png",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=81819&awinaffid=3013053&clickref=argan-peptide-serum&ued=https%3A%2F%2Fnourishskinrange.com%2Fproducts%2Fargan-anti-ageing-peptide-serum", merchant: "Nourish London", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "27", name: "Nourish London Balance Essential Anti-Blemish Moisturiser", brand: "Nourish London",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Niacinamide and saw palmetto moisturiser for oily and combination skin, formulated to regulate oil production and refine pores without stripping hydration. 89% organic certified, vegan, alcohol-free.",
    original_price: 26.00, sale_price: 26.00, discount_percent: 0,
    image_url: "/images/nourish-london-logo.png",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=81819&awinaffid=3013053&clickref=anti-blemish-moisturiser&ued=https%3A%2F%2Fnourishskinrange.com%2Fproducts%2Fanti-blemish-moisturiser", merchant: "Nourish London", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "28", name: "Nourish London Argan Skin Renew Moisturiser 50ml", brand: "Nourish London",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Peptide and hyaluronic acid daily moisturiser, clinically tested to a 25% increase in skin hydration over 24 hours. Won \"Best Anti-Ageing Product\" at the Beauty Bible Awards 2015. At £35 for 50ml, it undercuts Drunk Elephant's Protini Polypeptide Cream, which starts from £43.65 for the same 50ml size.",
    original_price: 35.00, sale_price: 35.00, discount_percent: 0,
    image_url: "/images/nourish-london-logo.png",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=81819&awinaffid=3013053&clickref=argan-skin-renew&ued=https%3A%2F%2Fnourishskinrange.com%2Fproducts%2Fargan-skin-renew-moisturiser", merchant: "Nourish London", rating: 0, review_count: 0, dupe_for: "Drunk Elephant Protini Polypeptide Cream",
  },
  {
    id: "29", name: "Nourish London Antioxidant Peptide Face Mist 100ml", brand: "Nourish London",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Dual-phase hydrating mist with pea peptides, hyaluronic acid, turmeric and liquorice extract. Alcohol-free and usable over makeup, after cleansing, or as a hair refresh.",
    original_price: 23.00, sale_price: 23.00, discount_percent: 0,
    image_url: "/images/nourish-london-logo.png",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=81819&awinaffid=3013053&clickref=peptide-face-mist&ued=https%3A%2F%2Fnourishskinrange.com%2Fproducts%2Fantioxidant-peptide-mist", merchant: "Nourish London", rating: 0, review_count: 0, dupe_for: null,
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
    id: "13", name: "Nourish London Protect Skincare Essentials Starter Kit", brand: "Nourish London",
    category: "Beauty & Skincare", category_slug: "beauty-skincare",
    description: "Certified organic, vegan 4-piece routine (cleanser, toning mist, peptide serum, moisturiser) with vitamin C and hyaluronic acid for dry, dehydrated skin. Same key actives as SkinCeuticals C E Ferulic for a fraction of the price.",
    original_price: 38.00, sale_price: 32.00, discount_percent: 16,
    image_url: "/images/nourish-london-logo.png",
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
  {
    id: "30", name: "Creative Pebble X 2.0 USB-C Speakers with RGB Lighting", brand: "Creative",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "USB-C 2.0 desktop speakers with customisable RGB lighting and Bluetooth 5.3. A colourful, budget-friendly desktop audio upgrade.",
    original_price: 120.99, sale_price: 89.02, discount_percent: 26,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2025/04/25/creative-labs-creative-pebble-x-51mf1715aa000-397748.webp",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=pebble-x&ued=https%3A%2F%2Fwww.quzo.co.uk%2Fcreative-pebble-x-20-usbc-speakers-with-customizable-rgb-lightingbluetooth-v53-51mf1715aa000-pid397748.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "31", name: "Creative Stage Air V2 Compact Soundbar", brand: "Creative",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Compact USB/Bluetooth soundbar with up to 6 hours of battery life, built for a tidy desk setup without cable clutter.",
    original_price: 67.99, sale_price: 55.43, discount_percent: 18,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2023/03/creative-labs-stage-air-v2-recommended-usage-universal-speaker-type-1-way-audio-output-channels-329568.jpg",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=stage-air-v2&ued=https%3A%2F%2Fwww.quzo.co.uk%2Fcreative-stage-air-v2-51mf8395aa000-pid329568.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "32", name: "Genius SW-2.1 1850BT 50W RMS Bluetooth Subwoofer Speaker System", brand: "Genius",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "50W RMS 2.1 speaker system with a dedicated subwoofer and Bluetooth 5.3, built for gaming and home entertainment setups that need real bass.",
    original_price: 118.99, sale_price: 74.47, discount_percent: 37,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2025/09/04/genius-sw-2-1-1850bt-50w-rms-bluetooth-5-3-subwoofer-gaming-and-entertainment-speaker-system-31-409541.webp",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=genius-sw21&ued=https%3A%2F%2Fwww.quzo.co.uk%2Fgenius-sw21-1850bt-50w-rms-bluetooth-53-subwoofer-gaming-and-entertainment-speaker-system-31730050404-pid409541.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "33", name: "Samsung Galaxy Fit3 Fitness Tracker", brand: "Samsung",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "1.6-inch AMOLED fitness band with heart-rate and sleep tracking. Even against Fitbit's own best current UK deals (not just its £139.99 RRP), this undercuts a genuine name-brand tracker.",
    original_price: 85.99, sale_price: 76.94, discount_percent: 11,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2024/11/29/samsung-galaxy-fit3-4-06-cm-1-6-amoled-touchscreen-0-256-gb-18-5-g-sm-r390nzsaeub-391973.webp",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=galaxy-fit3&ued=https%3A%2F%2Fwww.quzo.co.uk%2Fgalaxy-fit3-silver-smr390nzsaeub-pid391973.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: "Fitbit Charge 6",
  },
  {
    id: "34", name: "Entity AERO Smartwatch", brand: "Entity",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Budget touchscreen smartwatch with a 2.01-inch TFT display, sold honestly on price rather than pretending to match flagship smartwatches feature-for-feature.",
    original_price: 50.99, sale_price: 38.11, discount_percent: 25,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2026/04/01/entity-aero-smartwatch-yellow-nylon-display-diagonal-5-11-cm-2-01-display-technology-tft-displa-421203.webp",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=entity-aero&ued=https%3A%2F%2Fwww.quzo.co.uk%2Fentity-aero-smartwatch-yellow-nylon-5021266816-pid421203.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "35", name: "Logitech G413 TKL SE Mechanical Gaming Keyboard", brand: "Logitech",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Tenkeyless mechanical gaming keyboard. We also stock the Razer BlackWidow V4 X at £136.89 — the G413 gets you into mechanical gaming typing for roughly half that.",
    original_price: 114.99, sale_price: 71.23, discount_percent: 38,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2023/03/logitech-g-g413-tkl-se-keyboard-form-factor-tenkeyless-80--87-device-interface-usb-keyboard-key-333985.jpg",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=g413-tkl-se&ued=https%3A%2F%2Fwww.quzo.co.uk%2Fg413-tkl-se-black-uk-intnl-920010563-pid333985.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: "Razer BlackWidow V4 X",
  },
  {
    id: "36", name: "Dell 27\" Plus 4K Monitor S2725QS", brand: "Dell",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "27-inch 4K Ultra HD IPS monitor with HDMI and DisplayPort connectivity. A trusted name at a genuinely discounted price, no substitute brand needed.",
    original_price: 372.99, sale_price: 271.92, discount_percent: 27,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2025/10/20/dell-plus-s2725qs-68-6-cm-27-3840-x-2160-pixels-4k-ultra-hd-lcd-8-ms-silver-dell-s2725qs-408770.webp",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=dell-s2725qs&ued=https%3A%2F%2Fwww.quzo.co.uk%2F-dell-27-plus-4k-monitor-s2725qs-dells2725qs-pid408770.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "37", name: "Logitech C922 Pro Stream Webcam", brand: "Logitech",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Full HD 1080p streaming webcam with dual mics and automatic low-light correction. If you don't need 4K, this undercuts Logitech's own Brio 4K line (from around £80–£90) while keeping the same brand's build quality.",
    original_price: 99.99, sale_price: 71.28, discount_percent: 29,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2021/08/logitech-c922-pro-stream-webcam-1920-x-1080-pixels-60-fps-1280x720@60fps-1920x1080@30fps-720p-1-69381.jpg",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=c922-webcam&ued=https%3A%2F%2Fwww.quzo.co.uk%2Flogitech-c922-1920-x-1080pixels-usb-black-webcam-960001088-pid69381.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "38", name: "Anker Powercore 20000mAh 30W Power Bank", brand: "Anker",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "20,000mAh power bank with 30W Power Delivery fast charging across two USB-C ports and one USB-A. Genuinely discounted from a battery brand that's already trusted, not a stand-in for one.",
    original_price: 63.99, sale_price: 52.74, discount_percent: 18,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2024/09/anker-powercore-battery-capacity-20000-mah-fast-charging-technology-power-delivery-usb-type-a-o-382282.jpg",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=anker-20k&ued=https%3A%2F%2Fwww.quzo.co.uk%2Fanker-power-bank-20k-30w-black-a1384h11-pid382282.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "39", name: "Nothing Ear (a) True Wireless Earbuds", brand: "Nothing",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "True wireless earbuds with up to 45dB active noise cancellation and Hi-Res Audio (LDAC). Cheaper than even the best current UK deal on Apple's base AirPods 4 (around £88–£89), and Nothing's version has ANC that the base AirPods 4 doesn't.",
    original_price: 82.99, sale_price: 67.14, discount_percent: 19,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2025/08/06/nothing-ear-a-product-type-headset-connectivity-technology-true-wireless-stereo-tws-bluetooth-r-407303.webp",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=nothing-ear-a&ued=https%3A%2F%2Fwww.quzo.co.uk%2Fnothing-ear-a-yellow-a10600065-pid407303.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: "AirPods 4",
  },
]

async function seedProducts() {
  for (const p of products) {
    await db.query(
      `INSERT INTO products
        (id, name, brand, category, category_slug, description, original_price, sale_price,
         discount_percent, image_url, affiliate_url, merchant, rating, review_count, dupe_for)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, brand = EXCLUDED.brand, category = EXCLUDED.category,
         category_slug = EXCLUDED.category_slug, description = EXCLUDED.description,
         original_price = EXCLUDED.original_price, sale_price = EXCLUDED.sale_price,
         discount_percent = EXCLUDED.discount_percent, image_url = EXCLUDED.image_url,
         affiliate_url = EXCLUDED.affiliate_url, merchant = EXCLUDED.merchant,
         rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, dupe_for = EXCLUDED.dupe_for`,
      [
        p.id, p.name, p.brand, p.category, p.category_slug, p.description, p.original_price, p.sale_price,
        p.discount_percent, p.image_url, p.affiliate_url, p.merchant, p.rating, p.review_count, p.dupe_for ?? null,
      ]
    )
  }

  // Upserting never removes a row for a product that's been deleted from this
  // file (e.g. the mock CeraVe/Ordinary/Garnier products removed in favour of
  // real Nourish London ones) — without this, seeding is a one-way ratchet
  // that only ever adds/updates, so removed products silently keep showing
  // live even after being deleted from source.
  const currentIds = products.map((p) => p.id)
  const { rowCount } = await db.query(
    `DELETE FROM products WHERE id != ALL($1::text[])`,
    [currentIds]
  )

  return { seeded: products.length, removed: rowCount }
}

module.exports = { seedProducts }

// Only run as a standalone CLI script (`npm run seed`), not when imported
// by index.js's /admin/seed route, importing must not close the shared pool.
if (require.main === module) {
  seedProducts()
    .then(({ seeded, removed }) => {
      console.log(`Seeded ${seeded} products, removed ${removed} stale row(s).`)
      return db.pool.end()
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
