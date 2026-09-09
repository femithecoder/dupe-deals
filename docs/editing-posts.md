# Editing blog posts

Three ways, easiest first. All three end up in the same place: a markdown file
in `frontend/content/blog/` committed to `main`, which Vercel deploys in about
two minutes.

## 1. The CMS at /admin

<https://dupedeals.co.uk/admin>, sign in with GitHub. Pick a post, edit, Save.
Saving writes a git commit, so nothing about the pipeline changes: the checks
still run, the price tokens still resolve, and the post history is still in git
next to the code.

### One-time setup

The CMS needs a GitHub OAuth app. This has to be done from the GitHub account
that owns the repo.

1. <https://github.com/settings/developers> → **OAuth Apps** → **New OAuth App**
   - Application name: `DupeDeals CMS`
   - Homepage URL: `https://dupedeals.co.uk`
   - Authorization callback URL: `https://dupedeals.co.uk/api/cms/callback`
2. Generate a client secret and copy both values.
3. In the Vercel project → Settings → Environment Variables, add for Production:
   - `CMS_GITHUB_CLIENT_ID`
   - `CMS_GITHUB_CLIENT_SECRET`
4. Redeploy.

Until those exist, `/admin` loads but sign-in returns "CMS auth is not
configured", which is deliberate: it fails loudly rather than looking broken.

The client secret only ever exists in Vercel's environment and in the
`/api/cms/callback` handler. It is never sent to the browser, and the login
never leaves our domain for a third-party OAuth broker.

## 2. GitHub in the browser

`frontend/content/blog/` → pick the file → pencil icon → Commit. Same result,
no setup, uglier editor.

## 3. Locally

Edit the file, then before pushing:

```bash
cd frontend
npm run audit:blog     # playbook rules, images, org names, em dashes
npm run check:facts    # dead links, prices contradicting the live catalogue
```

## Rules that will bite you

**Never type one of our prices.** Use `{{price:57}}`, `{{rrp:57}}`,
`{{save:57}}`, `{{discount:57}}`. A typed price goes stale silently and
`audit:blog` fails. Competitor prices are the exception: we have no feed for
those, so they are plain text and `pricesCheckedAt` tracks when they were last
verified.

**The excerpt must be 110 to 155 characters** and must not contain a price. It
is not token-resolved, so a number there is frozen at the moment you type it.

**Don't rename a published post.** The filename is the URL. Renaming breaks the
live link and discards its Google ranking.

**No em dashes.** House style, enforced by the audit.

## Why the body editor is raw markdown

The CMS is configured with `modes: [raw]`, so the body is a markdown box rather
than a rich text editor. The rich text mode round-trips markdown through an
AST and reformats it on the way out, which reflows the comparison tables and
risks escaping the braces in `{{price:57}}`. A mangled price token prints the
raw token to readers, so the trade is not worth it. The live preview beside the
editor covers most of what the rich mode would give you.

The preview shows tokens unresolved, since they are filled in server-side.

## If a check fails after you publish

`.github/workflows/blog-fact-check.yml` runs on every push to `main` that
touches a post, and emails on failure. It runs after the deploy, so it is a
smoke alarm, not a gate. To make it a gate instead, set
`publish_mode: editorial_workflow` in `frontend/public/admin/config.yml`: saves
then become pull requests that run the checks before you merge.

## Proofreading in the editor

Two layers, because they catch different things.

### Grammar and spelling: Grammarly

Sveltia's raw markdown editor is a plain `<textarea>`, which is what the
Grammarly browser extension attaches to. Install it from the Chrome or Safari
extension store and it works in `/admin` with no configuration: underlines
appear as you type, click one to accept the fix or ignore it. The browser's own
spellcheck is already on for the same reason.

It will occasionally flag markdown syntax as a mistake, and it has no idea what
our house rules are. That is what the second layer is for.

### House rules: the panel in the corner

`public/admin/checks.js` runs the project's own rules as you type and lists what
it finds in a panel at the bottom right. Clicking an entry selects that exact
text in the editor so you can fix it in place.

It checks for em dashes, one of our own prices typed as a literal instead of a
token, malformed tokens, organisations used without introduction, product
sections with no image, doubled words, sentences over 45 words, bare URLs
loose in the prose, and the run-together sentences that a bad find-and-replace
leaves behind.

The price rule only looks at products the post actually links, which is how
`audit:blog` scopes it too. Comparing against the whole catalogue produced
nonsense: Apple's £169 AirPods price is also a car seat's RRP, and neither
fact has anything to do with the other.

Calibration matters more than coverage here. A panel that flags something on
every post gets ignored, so run `npm run test:cms-checks` after changing a
rule. It runs every rule over all fifteen published posts and prints the
totals. Those posts already pass `audit:blog`, so anything it reports is either
a real find or a rule that needs narrowing. Three long sentences is the current
baseline.
