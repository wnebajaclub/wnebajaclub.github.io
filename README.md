# Golden Bear Racing — Team Website

The website for Golden Bear Racing, Western New England University's Baja SAE
team. Live at **https://wnebajaclub.github.io/**

Plain HTML, CSS, and a little JavaScript. No build step and no dependencies —
edit a file, push it, and the site updates.

## Want to change something?

Read **[CONTRIBUTING.md](CONTRIBUTING.md)**. It walks through the updates that
come up every year — adding a competition result, updating the roster, adding a
sponsor — with copy-paste examples, and it does not assume you know git.

## Structure

```
index.html          Home: hero, results ticker, GBR4, latest result
history.html        Competition results, 2015 to present
team.html           Executive board and sub-team leads
sponsors.html       Sponsor tiers
assets/css/         One stylesheet for the whole site
assets/js/          Mobile nav and scroll animations
assets/img/         Photos and logo
```

## Brand

| Token | Hex | Used for |
|---|---|---|
| Gold | `#FFB612` | Headings, accents, primary buttons |
| Blue | `#2A66B2` | Secondary accents, sub-team highlights |
| Navy | `#0B1A2E` | Panels and cards |
| Background | `#04070D` | Page background |

Defined as CSS variables at the top of `assets/css/style.css`. Fonts are
Chakra Petch for display type and Inter for body text, both from Google Fonts.

`assets/img/logo.png` is the team logo prepared for dark backgrounds — the
background is transparent and the script and line art are white, so it only
reads correctly on a dark surface.

## Running it locally

```
npx serve .
```

## Deployment

GitHub Pages serves `main` from the repository root. Every push to `main`
rebuilds the site automatically, usually within a minute. There is no build
configuration to maintain.
