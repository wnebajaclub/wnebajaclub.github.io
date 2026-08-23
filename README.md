# Golden Bear Racing — Team Website

Static website for Golden Bear Racing, Western New England University's Baja SAE team.

## Structure

- `index.html` — home page (hero, Project GBR4, explore tiles)
- `history.html` — competition history, 2015–2026
- `team.html` — executive board and sub-team leads
- `sponsors.html` — sponsor tiers (Golden Bear Partners → Cub Supporter)
- `assets/css/style.css` — single shared stylesheet (colors, layout, responsive)
- `assets/js/main.js` — mobile nav toggle + scroll reveal
- `assets/img/` — competition photos and favicon

No build step — plain HTML/CSS/JS, ready for GitHub Pages.

## Brand colors

| Token | Hex |
|---|---|
| Gold | `#FFB612` |
| Blue | `#2A66B2` |
| Navy | `#0B1A2E` |
| Background | `#04070D` |

Defined as CSS variables at the top of `assets/css/style.css`.

## Deploying (GitHub Pages + Cloudflare domain)

1. Push this folder to the team GitHub repository.
2. In the repo: **Settings → Pages → Deploy from branch** → `main`, root folder.
3. After buying the domain on Cloudflare: add a `CNAME` DNS record pointing the domain
   at `<account>.github.io`, and set the custom domain in the GitHub Pages settings
   (this creates a `CNAME` file in the repo). Keep Cloudflare SSL mode on "Full".

## Local preview

Any static server works, e.g.:

```
npx serve .
```
