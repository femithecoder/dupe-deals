// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD requires raw HTML injection; escape "<" so the payload can't break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
