import { ImageResponse } from "next/og"
import { OgImageBrandCard, OG_IMAGE_ALT, OG_IMAGE_SIZE, loadOgFonts } from "@/lib/og-image"

export const alt = OG_IMAGE_ALT
export const size = OG_IMAGE_SIZE
export const contentType = "image/png"

export default async function Image() {
  const fonts = await loadOgFonts().catch(() => undefined)
  return new ImageResponse(<OgImageBrandCard />, { ...size, fonts })
}
