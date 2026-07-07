# Castle — static website

A plain HTML/CSS/JS rebuild of [castle.tech](https://castle.tech) (migrated out of Framer).
No build step, no framework — edit the HTML files directly and refresh.

## Run locally

Any static file server works:

```bash
cd castle-website
python3 -m http.server 8000
# open http://localhost:8000
```

> Note: pages use root-relative paths (`/assets/...`), so open via a server, not `file://`.

## Structure

```
index.html                      Homepage
404.html                        Not-found page (most hosts pick this up automatically)
team/index.html                 Team page
resources/index.html            Resources index
resources/<slug>/index.html     Articles (4)
privacy-policy/index.html       Privacy Policy
terms-of-service/index.html     Terms of Service
assets/css/site.css             The whole design system (colors/type tokens at the top)
assets/js/site.js               Nav state, mobile menu, scroll reveals, manifesto
                                word-reveal, logo marquee, WebGL bootstrap
assets/images/                  All images, with friendly names
assets/unicorn/manifesto-bg.json  WebGL scene for the dark manifesto section
```

## Common edits

- **Copy/text** — edit the relevant `index.html`; every page is plain semantic HTML.
- **Colors & fonts** — CSS variables at the top of `assets/css/site.css`.
- **Nav / footer** — repeated in each page (10 files). Search-and-replace across
  `**/index.html` + `404.html`, or introduce a tiny include step later if it gets tedious.
- **New article** — copy an existing folder under `resources/`, swap title, meta,
  cover image, and body; add a card to `resources/index.html` (and the homepage
  blog section if desired).

## WebGL backgrounds (Unicorn Studio)

The animated backgrounds are Unicorn Studio scenes, loaded by
`assets/js/site.js` via the official runtime (jsdelivr, v2.1.9 — same version
Framer used). Scenes are referenced with data attributes:

| Where              | Attribute                                              |
|--------------------|--------------------------------------------------------|
| Homepage hero      | `data-us-project="IXwh9ZLHmf9R8zNQHQ27"`               |
| Manifesto section  | `data-us-project-src="/assets/unicorn/manifesto-bg.json"` (self-hosted) |
| Team page          | `data-us-project="5WdZDE41Gn7HEq4SfZeY"`               |
| 404 page           | `data-us-project="eze3MoV3Za0pmrYcANj9"`               |

The three `data-us-project` scenes stream from Unicorn Studio's CDN (they belong
to the company's Unicorn Studio account — keep that account alive, or export each
scene to JSON and switch to `data-us-project-src` like the manifesto one).
Each scene has a static fallback color while loading; if the runtime ever fails,
pages remain fully readable.

## Fonts

Hedvig Letters Serif (headings), Geist (body), Geist Mono (labels/buttons) —
loaded from Google Fonts in each page's `<head>`.

## Known intentional quirks (carried over from the live site)

- Hero says "Hedge the unhedgable", footer says "Hedge the unhedgeable" — as live.
- Footer "Linkedin" / "Twitter / X" are non-linked labels (they have no URLs on
  the live site either). Add `<a href>`s in the footer of each page when ready.
- The live Framer marquee contains a broken item: a layer named "coinbase" that
  accidentally renders the Castle wordmark. This rebuild ships a real Coinbase
  logo (`assets/images/angel-coinbase.svg`) in that slot instead — remove the
  `<img>` from the marquee in `index.html` if Coinbase shouldn't be listed.
