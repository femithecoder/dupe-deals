export const OG_IMAGE_ALT = "DupeDeals — Quality products. Half the price."
export const OG_IMAGE_SIZE = { width: 1200, height: 630 }

const INTER_REGULAR_URL =
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf"
const INTER_BLACK_URL =
  "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuBWYMZg.ttf"

export async function loadOgFonts() {
  const [regular, black] = await Promise.all([
    fetch(INTER_REGULAR_URL).then((res) => res.arrayBuffer()),
    fetch(INTER_BLACK_URL).then((res) => res.arrayBuffer()),
  ])
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: black, weight: 900 as const, style: "normal" as const },
  ]
}

export function OgImageBrandCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "linear-gradient(135deg, #7c3aed 0%, #9333ea 45%, #4338ca 100%)",
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "white",
            color: "#7c3aed",
            fontSize: 26,
            fontWeight: 900,
          }}
        >
          DD
        </div>
        <div style={{ display: "flex", fontSize: 36, fontWeight: 900, color: "white" }}>
          Dupe<span style={{ color: "#fde047" }}>Deals</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 900, color: "white", lineHeight: 1.15 }}>
          Quality products.
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 900, color: "#fde047", lineHeight: 1.15 }}>
          Half the price.
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.75)" }}>
        UK deals on cheaper alternatives to expensive brands
      </div>
    </div>
  )
}
