/**
 * House-rule checks for the CMS editor.
 *
 * Grammarly and the browser's own spellcheck handle English. They cannot know
 * that a price typed as text goes stale, that the excerpt is not token
 * resolved, or that "Which?" needs introducing, and every one of those has
 * shipped a real defect. This panel is the other half: the project's own rules,
 * live, next to the text.
 *
 * Deliberately plain DOM. Sveltia expects a React component for
 * registerPreviewTemplate and does not bundle React, so hooking the CMS's own
 * extension API would mean loading React just for a sidebar.
 */
(() => {
  "use strict"

  const GATEWAY = "https://dupedeals-gateway.onrender.com"
  const ORGS = {
    "Which?": /consumer group|consumers'? association|consumer champion/i,
    "ADAC": /German|Germany|motoring|automobile club/i,
    "Stiftung Warentest": /German|Germany|consumer|testing/i,
    "PriceRunner": /price compar|comparison site|shopping compar/i,
  }

  /** Prices of our own products, as they would look typed into prose. */
  let ownPrices = new Map()

  async function loadOwnPrices() {
    try {
      const res = await fetch(`${GATEWAY}/api/products?limit=500`)
      const { products = [] } = await res.json()
      for (const p of products) {
        for (const value of [p.salePrice, p.originalPrice]) {
          if (typeof value !== "number") continue
          // Integer prices render without pennies, so both spellings count.
          const forms = Number.isInteger(value)
            ? [`£${value}`, `£${value.toFixed(2)}`]
            : [`£${value.toFixed(2)}`]
          for (const form of forms) ownPrices.set(form, p)
        }
      }
    } catch {
      // Offline or the service is asleep. Every other check still works.
    }
  }

  const rules = [
    {
      id: "em-dash",
      label: "Em dash",
      find: (text) => matchAll(text, /—/g, () => "House style is a comma, colon or full stop"),
    },
    {
      id: "own-price",
      label: "Our own price typed as text",
      find: (text) => {
        // Only products this post links. A competitor price that happens to
        // equal some unrelated product's is a coincidence, not a mistake:
        // Apple's £169 AirPods and a car seat's £169 RRP are the same number
        // and nothing else. audit:blog scopes it the same way.
        const linked = new Set([...text.matchAll(/\]\(\/product\/(\d+)\)/g)].map((m) => m[1]))
        if (!linked.size) return []
        return matchAll(text, /£\d+(?:\.\d{2})?/g, (m) => {
          const product = ownPrices.get(m[0])
          if (!product || !linked.has(String(product.id))) return null
          const kind = m[0] === formatPrice(product.salePrice) ? "price" : "rrp"
          return `${m[0]} is this post's own product "${truncate(product.name, 34)}". Use {{${kind}:${product.id}}} so it stays live.`
        })
      },
    },
    {
      id: "bad-token",
      label: "Malformed price token",
      find: (text) =>
        matchAll(text, /\{\{[^}]*\}\}/g, (m) =>
          /^\{\{(price|rrp|save|discount):\d+\}\}$/.test(m[0])
            ? null
            : `Not a valid token. Use {{price:57}}, {{rrp:57}}, {{save:57}} or {{discount:57}}.`
        ),
    },
    {
      id: "run-on",
      label: "Missing space after a full stop",
      // The regex that corrupted two live posts stopped at the full stop inside
      // a URL and glued the next sentence on. This is what that looks like.
      find: (text) => matchAll(text, /[a-z]{2}\.[A-Z][a-z]{2}/g, () => "Looks like two sentences ran together"),
    },
    {
      id: "url-leak",
      label: "URL fragment in the prose",
      find: (text) =>
        matchAll(text, /(?:^|[\s(])[a-z0-9-]+\.(?:com|co\.uk|de|net|org)\/\S*/gi, (m) =>
          isInsideLink(text, m.index) ? null : "A bare URL outside a markdown link, usually edit damage"
        ),
    },
    {
      id: "doubled",
      label: "Doubled word",
      find: (text) => matchAll(text, /\b(\w+) \1\b/gi, (m) => `"${m[1]} ${m[1]}"`),
    },
    {
      id: "long-sentence",
      label: "Very long sentence",
      find: (text) =>
        matchAll(text, /[^.!?\n]{40,}[.!?]/g, (m) => {
          const words = m[0].trim().split(/\s+/).length
          return words > 45 ? `${words} words. Consider splitting it.` : null
        }),
    },
    {
      id: "org",
      label: "Organisation not introduced",
      find: (text) => {
        const out = []
        for (const [org, descriptor] of Object.entries(ORGS)) {
          const at = text.indexOf(org)
          if (at === -1) continue
          const around = text.slice(Math.max(0, at - 70), at + org.length + 70)
          if (descriptor.test(around)) continue
          out.push({ start: at, end: at + org.length, text: org, note: `Say what ${org} is on first mention` })
        }
        return out
      },
    },
    {
      id: "image",
      label: "Product section with no image",
      find: (text) => {
        const out = []
        const heads = [...text.matchAll(/^###\s+\[.*?\]\(\/product\/(\d+)\).*$/gm)]
        for (const h of heads) {
          const after = text.slice(h.index + h[0].length, h.index + h[0].length + 400)
          if (after.includes("![")) continue
          out.push({ start: h.index, end: h.index + h[0].length, text: truncate(h[0], 50), note: "No image under this product" })
        }
        return out
      },
    },
  ]

  function matchAll(text, regex, describe) {
    const out = []
    for (const m of text.matchAll(regex)) {
      const note = describe(m)
      if (note === null) continue
      out.push({ start: m.index, end: m.index + m[0].length, text: truncate(m[0].trim(), 60), note })
    }
    return out
  }

  function isInsideLink(text, index) {
    // Crude but sufficient: a markdown link's URL always sits between "](" and
    // the closing bracket, and image sources are the same shape.
    const before = text.lastIndexOf("](", index)
    if (before === -1) return false
    const close = text.indexOf(")", before)
    return close === -1 ? false : index < close
  }

  const formatPrice = (n) => (Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`)

  const truncate = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

  function run(textarea, panel) {
    const text = textarea.value
    const found = []
    for (const rule of rules) {
      for (const hit of rule.find(text)) found.push({ ...hit, rule })
    }
    found.sort((a, b) => a.start - b.start)
    render(panel, found, textarea)
  }

  function render(panel, found, textarea) {
    const list = panel.querySelector(".dd-list")
    const count = panel.querySelector(".dd-count")
    count.textContent = found.length === 0 ? "No issues" : `${found.length} to look at`
    count.style.color = found.length === 0 ? "#15803d" : "#b45309"
    list.replaceChildren()

    for (const hit of found) {
      const item = document.createElement("button")
      item.type = "button"
      item.className = "dd-item"
      item.innerHTML = `<span class="dd-rule"></span><span class="dd-text"></span><span class="dd-note"></span>`
      item.querySelector(".dd-rule").textContent = hit.rule.label
      item.querySelector(".dd-text").textContent = hit.text
      item.querySelector(".dd-note").textContent = hit.note
      item.addEventListener("click", () => select(textarea, hit.start, hit.end))
      list.appendChild(item)
    }
  }

  /** Put the cursor on the problem so it can be fixed without hunting for it. */
  function select(textarea, start, end) {
    textarea.focus()
    textarea.setSelectionRange(start, end)
    const before = textarea.value.slice(0, start).split("\n").length - 1
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20
    textarea.scrollTop = Math.max(0, (before - 3) * lineHeight)
  }

  function buildPanel() {
    const panel = document.createElement("div")
    panel.className = "dd-panel"
    panel.innerHTML = `
      <div class="dd-head">
        <strong>House checks</strong>
        <span class="dd-count"></span>
        <button type="button" class="dd-toggle" aria-label="Collapse">–</button>
      </div>
      <div class="dd-list"></div>
      <div class="dd-foot">Grammar and spelling: use Grammarly or your browser's spellcheck. These are the project's own rules.</div>`
    panel.querySelector(".dd-toggle").addEventListener("click", () => {
      const collapsed = panel.classList.toggle("dd-collapsed")
      panel.querySelector(".dd-toggle").textContent = collapsed ? "+" : "–"
    })
    document.body.appendChild(panel)
    return panel
  }

  // Everything below is browser-only. Guarded so the rules above can be
  // exercised by scripts/test-cms-checks.cjs without a DOM.
  if (typeof document === "undefined") {
    module.exports = { rules, loadOwnPrices, setOwnPrices: (m) => { ownPrices = m } }
    return
  }

  const style = document.createElement("style")
  style.textContent = `
    .dd-panel { position: fixed; right: 16px; bottom: 16px; width: 330px; max-height: 45vh;
      display: flex; flex-direction: column; background: #fff; color: #0f172a;
      border: 1px solid #cbd5e1; border-radius: 10px; box-shadow: 0 8px 28px rgba(15,23,42,.16);
      font: 13px/1.45 system-ui, sans-serif; z-index: 2147483000; overflow: hidden; }
    .dd-head { display: flex; align-items: center; gap: 8px; padding: 9px 11px;
      border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
    .dd-count { margin-left: auto; font-size: 12px; font-weight: 600; }
    .dd-toggle { border: 0; background: none; cursor: pointer; font-size: 17px; line-height: 1;
      padding: 0 3px; color: #475569; }
    .dd-list { overflow-y: auto; }
    .dd-collapsed .dd-list, .dd-collapsed .dd-foot { display: none; }
    .dd-item { display: block; width: 100%; text-align: left; border: 0; border-bottom: 1px solid #f1f5f9;
      background: none; cursor: pointer; padding: 8px 11px; font: inherit; }
    .dd-item:hover { background: #f8fafc; }
    .dd-rule { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .03em; color: #b45309; }
    .dd-text { display: block; font-family: ui-monospace, monospace; font-size: 12px;
      color: #0f172a; margin: 2px 0; word-break: break-word; }
    .dd-note { display: block; font-size: 12px; color: #64748b; }
    .dd-foot { padding: 7px 11px; border-top: 1px solid #e2e8f0; background: #f8fafc;
      font-size: 11px; color: #64748b; }
    @media (prefers-color-scheme: dark) {
      .dd-panel { background: #1e293b; color: #e2e8f0; border-color: #334155; }
      .dd-head, .dd-foot { background: #0f172a; border-color: #334155; }
      .dd-item { border-color: #334155; }
      .dd-item:hover { background: #334155; }
      .dd-text { color: #e2e8f0; }
      .dd-note, .dd-foot, .dd-toggle { color: #94a3b8; }
    }
  `
  document.head.appendChild(style)

  let panel = null
  let watched = null
  let timer = null

  /**
   * The body field is whichever textarea holds the most text. Matching on
   * Sveltia's own class names would break the first time it restyles.
   */
  function findBody() {
    const areas = [...document.querySelectorAll("textarea")]
    if (!areas.length) return null
    return areas.reduce((a, b) => (b.value.length > a.value.length ? b : a))
  }

  function attach() {
    const body = findBody()
    if (!body) {
      if (panel) { panel.remove(); panel = null; watched = null }
      return
    }
    if (body === watched) return
    watched = body
    panel = panel || buildPanel()
    const schedule = () => {
      clearTimeout(timer)
      timer = setTimeout(() => run(body, panel), 400)
    }
    body.addEventListener("input", schedule)
    run(body, panel)
  }

  loadOwnPrices().then(() => {
    new MutationObserver(attach).observe(document.body, { childList: true, subtree: true })
    attach()
  })
})()
