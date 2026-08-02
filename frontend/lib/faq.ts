export type FaqEntry = {
  id: string
  question: string
  keywords: string[]
  answer: string
}

export const faqs: FaqEntry[] = [
  {
    id: "what-is-dupedeals",
    question: "What is DupeDeals?",
    keywords: ["what is dupedeals", "what is this site", "what is this website", "about dupedeals", "who are you", "what do you do"],
    answer:
      "DupeDeals is a UK deals and recommendations site. We track price drops from trusted retailers and curate cheaper alternatives (\"dupes\") to expensive brands, so you get the same quality for less. Read more on our About page.",
  },
  {
    id: "how-it-works",
    question: "How does DupeDeals work?",
    keywords: ["how does it work", "how it works", "how does this work", "how does this site work", "how do you find deals", "how do you find dupes"],
    answer:
      "We track prices at trusted UK retailers around the clock and curate affordable alternatives to premium products. Browse the site by category, search for something specific, or check our How It Works page for the full breakdown.",
  },
  {
    id: "is-it-free",
    question: "Is DupeDeals free to use?",
    keywords: ["is it free", "cost to use", "does it cost", "any fees", "subscription", "sign up fee"],
    answer:
      "Yes, DupeDeals is completely free to use. No account or subscription needed. We're funded by small affiliate commissions when you buy through our links, at no extra cost to you.",
  },
  {
    id: "how-make-money",
    question: "How does DupeDeals make money?",
    keywords: ["how do you make money", "affiliate", "commission", "sponsored", "paid placement", "ads"],
    answer:
      "We earn a small affiliate commission when you buy through a link on our site, at no extra cost to you. This never affects which deals or dupes we feature. See our Affiliate Disclosure page for details.",
  },
  {
    id: "trust-dupes",
    question: "Can I trust the dupe recommendations?",
    keywords: ["can i trust", "are dupes any good", "same quality", "how do you choose dupes", "are dupes as good"],
    answer:
      "Our dupe comparisons are based on real ingredients, specs, and consumer test results, not brand hype or commission. We only feature alternatives we'd genuinely recommend.",
  },
  {
    id: "where-buy",
    question: "Where do I actually buy the product?",
    keywords: ["where do i buy", "checkout", "where to purchase", "buy the product", "how do i complete my purchase"],
    answer:
      "Every listing links directly to the retailer's own site (e.g. Boots, John Lewis, Currys, Argos, Dunelm), and you complete your purchase there. DupeDeals never handles payments or checkout itself.",
  },
  {
    id: "is-retailer",
    question: "Is DupeDeals a retailer / do you sell products?",
    keywords: ["are you a retailer", "do you sell", "do you ship", "is this a shop", "do you stock"],
    answer:
      "No, DupeDeals doesn't sell anything directly. We link out to trusted UK retailers who handle the sale, payment, and delivery themselves.",
  },
  {
    id: "shipping",
    question: "What are your shipping and delivery times?",
    keywords: ["shipping", "delivery", "delivery time", "how long does delivery take", "postage", "dispatch", "dispatched"],
    answer:
      "Shipping and delivery are handled entirely by the retailer you buy from, so timing depends on their policies. Check the retailer's own site for delivery estimates before you buy.",
  },
  {
    id: "returns",
    question: "What is your returns and refund policy?",
    keywords: ["returns", "refund", "return policy", "money back", "cancel a purchase", "exchange"],
    answer:
      "Since your purchase happens on the retailer's site, returns and refunds are handled by them under their own policy, not by DupeDeals. Check the retailer's returns page for specifics.",
  },
  {
    id: "order-status",
    question: "Where is my order / how do I track it?",
    keywords: ["where is my order", "track my order", "order status", "my parcel", "order not arrived"],
    answer:
      "DupeDeals doesn't process orders, so we can't track them. Your order and tracking details come from the retailer you purchased from, so check your confirmation email from them.",
  },
  {
    id: "payment-methods",
    question: "What payment methods do you accept?",
    keywords: ["payment methods", "how do i pay", "accept paypal", "accept card", "pay by"],
    answer:
      "DupeDeals doesn't take payments. You pay the retailer directly on their site using whatever payment methods they support.",
  },
  {
    id: "categories",
    question: "What categories of products do you cover?",
    keywords: ["what categories", "what products", "what do you cover", "product categories", "what kind of products"],
    answer:
      "We currently cover Beauty & Skincare, Baby & Kids, Home & Kitchen, and Electronics & Tech. Browse them from the menu at the top of the site.",
  },
  {
    id: "update-frequency",
    question: "How often are deals and prices updated?",
    keywords: ["how often updated", "how fresh are deals", "how often prices change", "when updated", "is this deal still available", "is this deal expired"],
    answer:
      "We track prices continuously, but retailers can change stock and pricing at any time. Always double check the price on the retailer's site before you buy.",
  },
  {
    id: "submit-deal",
    question: "How do I submit a deal or dupe?",
    keywords: ["submit a deal", "suggest a product", "recommend a dupe", "tell you about a deal", "submit dupe"],
    answer:
      "We'd love that. Head to our Submit a Deal page and fill in the product, link, and price, and if it checks out, we'll feature it.",
  },
  {
    id: "contact",
    question: "How do I contact DupeDeals?",
    keywords: ["contact", "email address", "get in touch", "reach you", "customer service", "speak to someone"],
    answer:
      "You can email us anytime at hello@dupedeals.co.uk, or use this chat and I'll pass you through to the team if I can't help.",
  },
  {
    id: "privacy",
    question: "What data do you collect / privacy policy?",
    keywords: ["privacy", "my data", "personal information", "gdpr", "what data do you collect"],
    answer:
      "We collect basic usage data and anything you send us directly (like chat messages or emails), and we never sell your data. Full details are on our Privacy Policy page.",
  },
  {
    id: "cookies",
    question: "Do you use cookies?",
    keywords: ["cookies", "cookie policy", "tracking cookies"],
    answer:
      "Yes, essential cookies to run the site and analytics cookies to understand usage. You can control these in your browser settings. See our Privacy Policy for more.",
  },
  {
    id: "terms",
    question: "What are your terms of service?",
    keywords: ["terms", "terms of service", "terms and conditions", "legal terms"],
    answer: "Our full Terms of Service are on the Terms page, covering how the site works and what you agree to by using it.",
  },
  {
    id: "blog",
    question: "Do you have a blog?",
    keywords: ["blog", "articles", "guides", "read more content"],
    answer: "Yes, check out the Blog for dupe comparisons and buying guides, linked in the top navigation.",
  },
  {
    id: "price-alerts",
    question: "Can I get notified about price drops?",
    keywords: ["price alerts", "notify me", "newsletter", "subscribe", "get alerts", "email me deals"],
    answer:
      "We don't have email alerts set up yet. For now, the best way to catch new deals is to check back on the site or browse by category. Want to suggest this as a feature? Let us know via chat.",
  },
  {
    id: "account",
    question: "Do I need an account to use DupeDeals?",
    keywords: ["do i need an account", "sign up", "create account", "login", "register"],
    answer: "No account needed. DupeDeals is completely open to browse, search, and click through to retailers.",
  },
  {
    id: "report-issue",
    question: "How do I report a wrong price or broken link?",
    keywords: ["report a problem", "wrong price", "broken link", "incorrect information", "price is wrong", "link doesn't work"],
    answer:
      "Thanks for flagging that. Please email hello@dupedeals.co.uk with the product and what's wrong, or ask me to pass it to the team.",
  },
]
