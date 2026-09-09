import { NextResponse } from "next/server"

// OAuth must run per request, never prerendered or cached.
export const dynamic = "force-dynamic"

const CLIENT_ID = process.env.CMS_GITHUB_CLIENT_ID

/**
 * Step one of GitHub OAuth for the CMS at /admin.
 *
 * Sveltia opens this in a popup, we bounce to GitHub, and /api/cms/callback
 * finishes the exchange. Running it ourselves rather than pointing the CMS at
 * a hosted OAuth broker means the client secret and the resulting token stay
 * between this domain and GitHub.
 */
export async function GET(request: Request) {
  if (!CLIENT_ID) {
    return new NextResponse(
      "CMS auth is not configured: CMS_GITHUB_CLIENT_ID is unset.",
      { status: 500 }
    )
  }

  const url = new URL(request.url)

  // Guards against a forged callback: the value is echoed back by GitHub and
  // compared with the cookie before we exchange anything.
  const state = crypto.randomUUID()

  const authorize = new URL("https://github.com/login/oauth/authorize")
  authorize.searchParams.set("client_id", CLIENT_ID)
  // The CMS asks for "repo" because it commits to a repo. Nothing narrower
  // works: GitHub has no scope for a single repository on a classic OAuth app.
  authorize.searchParams.set("scope", url.searchParams.get("scope") || "repo")
  authorize.searchParams.set("state", state)
  authorize.searchParams.set("redirect_uri", `${url.origin}/api/cms/callback`)

  const response = NextResponse.redirect(authorize.toString())
  response.cookies.set("cms_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  })
  return response
}
