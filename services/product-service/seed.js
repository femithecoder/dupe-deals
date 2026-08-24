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
    id: "41", name: "roborock Q7 M5 Robot Vacuum Cleaner with Mop, 10,000Pa Suction", brand: "Roborock",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "10,000Pa suction robot vacuum with mop function from a well-known robotics brand. Real Amazon UK price, checked directly against the cheaper Lefant alternative we also list.",
    original_price: 159.99, sale_price: 159.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F31LosM8TmOL._SS500_.jpg&feedId=110672&k=a27d1a340a7613fe3d10359a0f641d8e1b2152ad",
    affiliate_url: "https://www.awin1.com/pclick.php?p=42803893581&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "42", name: "Lefant M210 Robot Vacuum Cleaner with Remote Control, 2200Pa Strong Suction", brand: "Lefant",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "A genuinely cheaper robot vacuum with remote control, priced directly against the pricier roborock Q7 M5 we sell too. Lower suction (2,200Pa vs 10,000Pa) is the real trade-off for the lower price.",
    original_price: 108.17, sale_price: 108.17, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41DsL5sC-CL._SS500_.jpg&feedId=110672&k=046e94c5db37f2e1eac12ae7d058543c6a036b08",
    affiliate_url: "https://www.awin1.com/pclick.php?p=44488712467&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: "roborock Q7 M5",
  },
  {
    id: "43", name: "Cosori TurboBlaze Air Fryer 6L, DC Motor, Black", brand: "Cosori",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "6L air fryer with a DC motor from Cosori, a well-known name in the air fryer market. Large enough for a family-size batch.",
    original_price: 127.78, sale_price: 127.78, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41CL8ZWtJkL._SS500_.jpg&feedId=110672&k=b3060f55adfff071390fc74147f82d37cfd80248",
    affiliate_url: "https://www.awin1.com/pclick.php?p=43977817708&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "44", name: "SIHOO B100 SE Ergonomic Office Chair, Desk Chair with Lumbar Support 300lbs", brand: "SIHOO",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "Ergonomic mesh office chair with adjustable lumbar support, rated for up to 300lbs. SIHOO has built a reputation as a genuinely cheaper alternative to premium ergonomic chair brands.",
    original_price: 199.99, sale_price: 199.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41R4qEU3jjL._SS500_.jpg&feedId=110672&k=f1a4eb534090751aae13c8f6d9af86098dcfae06",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45203671054&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "45", name: "Levoit Humidifier for Bedroom, 25dB Ultra Quiet, Top Fill", brand: "Levoit",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "Top-fill humidifier rated at 25dB, quiet enough for a bedroom overnight. Levoit is one of the more established names in home humidifiers.",
    original_price: 39.99, sale_price: 39.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F31d2g8XXU9L._SS500_.jpg&feedId=110672&k=a2a89753cfd4077cbde4f5dfa5bb41d15f749d31",
    affiliate_url: "https://www.awin1.com/pclick.php?p=43977817728&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "46", name: "Hoover HF1 Max Cordless Vacuum Cleaner Stick, up to 50min Runtime", brand: "Hoover",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "Cordless stick vacuum with up to 50 minutes of runtime, from a brand that's been making vacuum cleaners for over a century.",
    original_price: 99.00, sale_price: 99.00, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41mz9b2wsOL._SS500_.jpg&feedId=110672&k=da7538484df34cb112b1a2b04289ecabd6201672",
    affiliate_url: "https://www.awin1.com/pclick.php?p=44261988195&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "47", name: "Tribesigns Farmhouse Console Table, 55-Inch Rustic Sofa Table with Storage", brand: "Tribesigns",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "55-inch farmhouse-style console table with open storage shelving, built in an industrial wood-and-metal frame.",
    original_price: 89.99, sale_price: 89.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F51PCRa9YTTL._SS500_.jpg&feedId=110672&k=5c9228c74c7bb991d6c2435765fc744874d571b8",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45250105216&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "48", name: "BEDLORE Waterproof Double Mattress Protector, Breathable TPU, Black", brand: "Bedlore",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "Breathable TPU waterproof mattress protector for a double bed. TPU stays quieter and more breathable overnight than older vinyl-backed protectors.",
    original_price: 25.19, sale_price: 25.19, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F51CQ72MSTQL._SS500_.jpg&feedId=110672&k=391e7501aa57e45f993bef2f1dbd0ccebc3ee170",
    affiliate_url: "https://www.awin1.com/pclick.php?p=44871642106&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "49", name: "Waterdrop FC-02-P Ultra Filtration Water Filter Tap", brand: "Waterdrop",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "A tap-mounted filter aimed at reducing chlorine and impurities in everyday water, from Waterdrop, a brand better known for its larger reverse osmosis systems.",
    original_price: 22.99, sale_price: 22.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F310bSiATBIL._SS500_.jpg&feedId=110672&k=bfa0d1547b6ab81b6a242e2b0d9e41365851eca4",
    affiliate_url: "https://www.awin1.com/pclick.php?p=42803893230&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "50", name: "Waterdrop K19-HG Instant Heat Mineralized Countertop Reverse Osmosis System", brand: "Waterdrop",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "A countertop reverse osmosis system with instant hot water and mineral remineralisation, no under-sink installation needed. The higher-end option in Waterdrop's range, next to the tap filter we also list.",
    original_price: 259.00, sale_price: 259.00, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F31ig%2BoZLl3L._SS500_.jpg&feedId=110672&k=f7d1d530fa821cec207d2b17b99d38a47158b1c4",
    affiliate_url: "https://www.awin1.com/pclick.php?p=44942648853&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "51", name: "MHW-3BOMBER 58mm Espresso Distributor, Height Adjustable", brand: "MHW-3BOMBER",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "Height-adjustable espresso distribution tool for 58mm portafilters, used to level coffee grounds evenly before tamping. A specialist accessory for anyone serious about home espresso.",
    original_price: 22.09, sale_price: 22.09, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F31kmPEpGkIL._SS500_.jpg&feedId=110672&k=11c6f621d435e11d4017ae030091f33074d0b631",
    affiliate_url: "https://www.awin1.com/pclick.php?p=42803892942&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "52", name: "Warmco N3 Portable Neck Fan, 5200mAh Rechargeable Personal Fan for Travel", brand: "Warmco",
    category: "Home & Kitchen", category_slug: "home-kitchen",
    description: "Rechargeable hands-free neck fan with a 5,200mAh battery, built for travel and hot commutes rather than a desk.",
    original_price: 29.99, sale_price: 29.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F61xb%2B0WG23L._AC_SL1500_.jpg&feedId=110672&k=bd873acbf4d36c3d8d16e4eba32d75a72b94b3f7",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45354423612&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "53", name: "eufy Breast Pump S1, Wearable Electric Breast Pump with Heating Technology", brand: "eufy",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "Wearable, hands-free electric breast pump with heating technology from eufy's security-and-home brand stable. The premium option next to the cheaper MOMMED pump we also sell.",
    original_price: 149.99, sale_price: 149.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F31eDZAkjNhL._SS500_.jpg&feedId=110672&k=78a40416dac01c9f9b4bcde8893f48ff9a641735",
    affiliate_url: "https://www.awin1.com/pclick.php?p=42803892630&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "54", name: "MOMMED Breast Pump, Wearable Breast Pumps with 3 Mode & 12 Levels, Leak-Proof & Low Noise", brand: "MOMMED",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "A wearable, hands-free breast pump with 3 modes and 12 suction levels, priced well below the eufy S1 we sell alongside it. No heating function is the main thing you give up for the lower price.",
    original_price: 49.99, sale_price: 49.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41uzs7o8UCL._SS500_.jpg&feedId=110672&k=801147619358a2b631aa31946adebc97eabefb6a",
    affiliate_url: "https://www.awin1.com/pclick.php?p=44684175802&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: "eufy Breast Pump S1",
  },
  {
    id: "55", name: "Tapo C840 2K 4MP Dual-Lens Baby Monitor Camera Indoor Security Camera", brand: "Tapo",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "2K dual-lens indoor camera from TP-Link's Tapo range, usable as a baby monitor or general home security camera. The pricier option next to the Reolink camera we also list.",
    original_price: 129.00, sale_price: 129.00, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41Dhu59etQL._SS500_.jpg&feedId=110672&k=6bbc5141471d01dc482e917803acdd91d07b0d74",
    affiliate_url: "https://www.awin1.com/pclick.php?p=44144194047&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "56", name: "Reolink Indoor Camera 4MP 360° Pan/Tilt, Baby Monitor for Home Security", brand: "Reolink",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "4MP pan/tilt indoor camera that works as a baby monitor, priced well below the Tapo C840 we sell alongside it. Single-lens rather than dual is the main trade-off.",
    original_price: 25.49, sale_price: 25.49, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41whm4Y8XqL._SS500_.jpg&feedId=110672&k=2a2601753ef0bcde5056c745c65731d0114eea10",
    affiliate_url: "https://www.awin1.com/pclick.php?p=42803894759&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: "Tapo C840 Baby Monitor Camera",
  },
  {
    id: "57", name: "Jovikids Ranger 2 i-Size 360 Rotating Car Seat with ISOFIX", brand: "Jovikids",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "360-degree rotating i-Size car seat with ISOFIX base, making it easier to get a baby in and out without twisting into the back seat.",
    original_price: 169.00, sale_price: 169.00, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41SSe41XbkL._SS500_.jpg&feedId=110672&k=832a48d7c6781a2ed4984085d07f88bb9f51f94f",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45241008694&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "58", name: "Jovikids OHHO+ Booster Car Seat, with ISOFIX, ECE R129 Approved, i-Size", brand: "Jovikids",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "ISOFIX booster seat for older children, ECE R129 (i-Size) approved. A cheaper, simpler step up from a full car seat once your child outgrows one.",
    original_price: 29.99, sale_price: 29.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41Y4A6ghdvL._SS500_.jpg&feedId=110672&k=fc5bb125437f78825c6f996b8ce32c330a504c83",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45483795948&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "59", name: "alilo Honey Bunny Pro, Kids Music Player with Night Light, Bluetooth", brand: "alilo",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "Bluetooth kids' music player with a built-in night light and voice recorder, preloaded with nursery rhymes and stories. A screen-free alternative to a tablet at bedtime.",
    original_price: 79.99, sale_price: 79.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F31P5ttVX36L._SS500_.jpg&feedId=110672&k=db6646fd3a84fa2054a1cfb9113043335691db80",
    affiliate_url: "https://www.awin1.com/pclick.php?p=43487599187&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "60", name: "Jovikids Ayla One-Hand Fold Stroller", brand: "Jovikids",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "One-hand fold stroller built for quick, everyday use rather than travel-system versatility.",
    original_price: 199.00, sale_price: 199.00, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F41%2B9VG7vtaL._SS500_.jpg&feedId=110672&k=8b1b2ddb1786ba5384c9574fc42cabc4d6ccd0d5",
    affiliate_url: "https://www.awin1.com/pclick.php?p=45241008704&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "61", name: "GloTika Baby Nest, Newborn Lounger with Breathable & Soft Cover", brand: "Orionstar",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "Portable newborn lounger with a breathable, soft cover, designed as a safe spot to lay a baby down at home or when travelling.",
    original_price: 45.99, sale_price: 45.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F413Nha7KiVL._SS500_.jpg&feedId=110672&k=749159ef532acf9b2c30b50d436734a526f68900",
    affiliate_url: "https://www.awin1.com/pclick.php?p=43679839212&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
  },
  {
    id: "62", name: "eufy Bottle Washer S1 Pro, Steriliser and Dryer, Built-in Water Softener", brand: "eufy",
    category: "Baby & Kids", category_slug: "baby-kids",
    description: "An automatic bottle washer, steriliser, and dryer in one, with a built-in water softener and 100°C steam cycle. The most expensive item in our Baby & Kids range, for parents who want to cut a genuinely repetitive daily chore.",
    original_price: 399.99, sale_price: 399.99, discount_percent: 0,
    image_url: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Am.media-amazon.com%2Fimages%2FI%2F31vBdzGbsYL._SS500_.jpg&feedId=110672&k=c9f7f6e4483ec6530d9b2d77e19a145a78b1e9e8",
    affiliate_url: "https://www.awin1.com/pclick.php?p=44894949092&a=3013053&m=118045", merchant: "Amazon", rating: 0, review_count: 0, dupe_for: null,
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
  {
    id: "40", name: "Razer BlackWidow V4 X Mechanical Gaming Keyboard", brand: "Razer",
    category: "Electronics & Tech", category_slug: "electronics-tech",
    description: "Full-size mechanical gaming keyboard with a choice of Razer Green (clicky) or Yellow (silent) switches, per-key Chroma RGB lighting, and six dedicated macro keys. The premium option next to our budget Logitech G413 pick, same retailer, real price.",
    original_price: 162.99, sale_price: 136.89, discount_percent: 16,
    image_url: "https://assets.media-quzo.co.uk/site/catalogue/large/2023/08/razer-blackwidow-v4-x-keyboard-green-rz03-04700300-r3w1-344933.jpg",
    affiliate_url: "https://www.awin1.com/cread.php?awinmid=19849&awinaffid=3013053&clickref=blackwidow-v4x&ued=https%3A%2F%2Fwww.quzo.co.uk%2Frazer-blackwidow-v4-x-keyboard-green-rz0304700300r3w1-pid344933.html", merchant: "Quzo UK", rating: 0, review_count: 0, dupe_for: null,
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

  // price_history.product_id has a foreign key into products(id) with no
  // ON DELETE CASCADE, so a stale product that's ever had a price check
  // logged against it (the daily cron logs one for every product in the
  // table, including ones later removed from this file) must have its
  // history cleared first, or the DELETE below throws a foreign-key
  // violation instead of actually removing anything.
  await db.query(
    `DELETE FROM price_history WHERE product_id != ALL($1::text[])`,
    [currentIds]
  )
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
