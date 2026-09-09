import { NextResponse, type NextRequest } from "next/server"

export const dynamic = "force-dynamic"

const CLIENT_ID = process.env.CMS_GITHUB_CLIENT_ID
const CLIENT_SECRET = process.env.CMS_GITHUB_CLIENT_SECRET

/**
 * Step two of GitHub OAuth for /admin: swap the code for a token and hand it
 * to the CMS in the opener window.
 *
 * The postMessage handshake is Netlify CMS's, which Decap and Sveltia both
 * kept: the popup announces itself with "authorizing:github", the CMS answers,
 * and only then does the token go back, addressed to the origin the CMS
 * actually replied from.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const expected = request.cookies.get("cms_oauth_state")?.value

  // GitHub sends this when the user clicks Cancel on the consent screen.
  const denied = url.searchParams.get("error")
  if (denied) return popup(url.origin, { error: denied })

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return popup(url.origin, { error: "CMS auth is not configured on the server" })
  }
  if (!code) return popup(url.origin, { error: "No code returned by GitHub" })
  if (!state || !expected || state !== expected) {
    return popup(url.origin, { error: "State mismatch, so this login was not started here" })
  }

  let token: string
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/cms/callback`,
      }),
      cache: "no-store",
    })
    const data = await res.json()
    if (data.error || !data.access_token) {
      return popup(url.origin, { error: data.error_description || data.error || "No token returned" })
    }
    token = data.access_token
  } catch (err) {
    console.error("[cms] token exchange failed:", err)
    return popup(url.origin, { error: "Could not reach GitHub to exchange the code" })
  }

  const response = popup(url.origin, { token })
  // One-shot: the state has done its job and should not be replayable.
  response.cookies.set("cms_oauth_state", "", { path: "/", maxAge: 0 })
  return response
}

/**
 * The token is written into a script tag, so it has to be encoded as data
 * rather than concatenated as source. JSON.stringify handles quoting; the
 * replacements below stop a "</script>" or a line separator inside any value
 * from ending the tag or breaking the parse.
 */
function encode(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

function popup(origin: string, result: { token?: string; error?: string }) {
  const message = result.token
    ? `authorization:github:success:${JSON.stringify({ token: result.token, provider: "github" })}`
    : `authorization:github:error:${JSON.stringify({ message: result.error })}`

  const html = `<!doctype html>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>Signing in</title>
<p style="font:16px system-ui;padding:2rem">${result.token ? "Signed in. This window can close." : "Sign in failed. You can close this window."}</p>
<script>
(function () {
  var message = ${encode(message)};
  var origin = ${encode(origin)};
  if (!window.opener) return;
  function reply(event) {
    window.removeEventListener("message", reply, false);
    window.opener.postMessage(message, event.origin);
  }
  window.addEventListener("message", reply, false);
  // Same origin as /admin, so this does not need to be a wildcard.
  window.opener.postMessage("authorizing:github", origin);
})();
</script>`

  return new NextResponse(html, {
    status: result.token ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  })
}
