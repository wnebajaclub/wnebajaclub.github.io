# Updating the Golden Bear Racing website

You do not need to know how to code to update this site. It is plain HTML —
no build step, no frameworks, nothing to install. Most updates are copying an
existing block and changing the words inside it.

## The easiest way to make a change

If you are not comfortable with git, edit directly on GitHub:

1. Open the file you want to change (for example `history.html`).
2. Click the pencil icon in the top right.
3. Make your change.
4. At the bottom, choose **Create a new branch for this commit** and click
   **Propose changes**.
5. Click **Create pull request** so someone else can look it over before it
   goes live.

The site rebuilds automatically about a minute after a change lands on `main`.

## Where things live

| File | What is on it |
|---|---|
| `index.html` | Home page: hero, results ticker, GBR4 section, latest result |
| `history.html` | Every competition and its results |
| `team.html` | Executive board and sub-team leads |
| `sponsors.html` | Sponsor tiers |
| `assets/css/style.css` | All styling for every page |
| `assets/img/` | Photos and the logo |

Team colors are defined once at the top of `style.css` (gold `#FFB612`, blue
`#2A66B2`). Change them there and every page follows.

---

## Adding a competition result

This is the yearly one. In `history.html`, copy the whole `<article>` block for
the most recent year and paste it directly **above** that block, then edit it.

```html
<article class="comp reveal" id="y2027">
  <div class="comp-photo"><img src="assets/img/comp-2027-somewhere.jpg" alt="Golden Bear Racing at Baja SAE Somewhere 2027" width="1085" height="723" loading="lazy" decoding="async"></div>
  <div class="comp-body">
    <div class="comp-year">2027</div>
    <h2>Baja SAE Somewhere</h2>
    <span class="overall-chip">Overall: 1st</span>
    <div class="results-grid">
      <div class="result"><div class="r-event">Endurance</div><div class="r-place">1st</div></div>
      <!-- one of these per event -->
    </div>
  </div>
</article>
```

Three things to get right:

- **Alternate the sides.** Blocks alternate between `class="comp reveal"` and
  `class="comp flip reveal"` so the photo switches left and right down the page.
  Check the block below yours and use the opposite one.
- **Give it a unique `id`** (`y2027`), then add a matching link to the year bar
  near the top of the file: `<a href="#y2027">2027</a>`.
- **Only list events that actually happened.** Competitions differ — some have
  Hill Climb, others have Sled Pull. Enter the results exactly as scored, and
  use `DNF` or `DNS` where that is what happened.

If there is no photo, use `class="comp no-photo reveal"` and delete the
`<div class="comp-photo">` line entirely (see 2021 for an example).

### Also update the home page

The home page highlights the most recent result in two places, both in
`index.html`: the scrolling **ticker** near the top, and the **Latest Result**
block below the GBR4 section. Update the year, event name, and placings there
so the front page is not stale.

The ticker list is deliberately duplicated so the scroll loops seamlessly — if
you add an entry, add it to **both** copies or the loop will jump.

## Adding or moving a sponsor

In `sponsors.html`, find the tier and copy a card. Tiers, most prominent first:
Golden Bear Partners, Blue Bear, Ursa Major, Ursa Minor, Cub Supporter.

With a link:

```html
<a class="sponsor-card is-partner" href="https://example.com" target="_blank" rel="noopener">
  <span class="s-name">Company Name</span>
  <span class="s-link">example.com &rarr;</span>
</a>
```

Without a link, use `<div>` instead of `<a>` and drop the `s-link` line.

Match the class to the tier so the card is sized right: `is-partner`,
`is-bluebear`, `is-major`, `is-minor`, `is-cub`. Moving a sponsor up a tier
means moving the block **and** changing that class.

Top-tier sponsors are also listed on the home page in the "Backed By" strip —
worth updating there too.

## Updating the team roster

In `team.html`, each person is one line. The two letters in the `avatar` div are
their initials, typed by hand:

```html
<div class="member exec reveal"><div class="avatar" aria-hidden="true">KW</div><div><div class="m-role">Chief Engineer</div><div class="m-name">Kaede Wood</div></div></div>
```

Use `member exec reveal` for the executive board (gold) and `member sub reveal`
for sub-team leads (blue).

## Adding photos

Put the file in `assets/img/` and name it like the others:
`comp-2027-somewhere.jpg`.

Before committing, **resize to about 1600px wide and save at around 80% JPEG
quality**. Straight-from-the-phone photos are several megabytes each; the ten
photos already here total 1.4 MB combined, and keeping it that way is what
makes the site usable on phone data at a competition.

Every `<img>` needs four things:

- `alt="..."` — a real description, for screen readers
- `width` and `height` — the image's true pixel dimensions. These reserve space
  so the page does not jump around while photos load. They must match the real
  dimensions or the photo will look squashed.
- `loading="lazy"` and `decoding="async"` — on anything below the top of the
  page, so it only downloads when scrolled near

## Adding a photo to the Highlights slideshow

The slideshow sits inside the Latest Result card on the home page. Adding a
photo is **one line** — the counter ("1 / 5") and the dots underneath are
generated from however many slides exist, so there is nothing else to keep in
sync.

1. Put the photo in `assets/img/highlights/`.
2. In `index.html`, find `<div class="hl-stage"`. Copy any existing
   `<figure class="hl-slide">` line and paste it wherever you want the photo to
   appear in the rotation, then change the filename and the `alt` text:

```html
<figure class="hl-slide">
  <img src="assets/img/highlights/YOUR-PHOTO.jpg" alt="Short description of what is happening" loading="lazy" decoding="async">
</figure>
```

Two things to know:

- **The first slide is special.** The one at the top carries
  `class="hl-slide is-active"` — that is the photo people see before the
  slideshow starts moving, and it's the only one that shows if JavaScript is
  off. If you want a different photo first, move the `is-active` onto it and
  take it off the old one. Only ever one slide has it.
- **Any shape of photo works.** The frame is a fixed 16:9 widescreen box and
  photos are cropped from the centre to fill it, so nothing will break the
  layout. But a tall or square photo will lose a lot off the top and bottom —
  if you care exactly what gets cropped, crop it to 16:9 yourself first
  (1600&times;900 is the size the existing ones use).

The slideshow advances on its own every ~5 seconds and holds while the mouse is
over it. To change the speed, edit `data-interval="5200"` on the
`<div class="highlights">` — the number is in milliseconds.

## Changing the contact email

The team address `wnebajaclub@gmail.com` appears in several places. Search the
whole project for it rather than editing one file, or a stale address will
linger somewhere:

- the footer of `index.html`, `history.html`, `team.html` and `sponsors.html`
- the "or email us at" line on `sponsors.html` (Become a Sponsor) and
  `team.html` (Want to Join?) — each appears twice, once in the visible link
  and once in the `data-mail` attribute on its Copy button

Use a team-owned address, never a personal one. Whoever set it up will
graduate, and sponsors will keep writing to that inbox for years.

The address is deliberately written out in full rather than hidden behind an
"Email us" button. A `mailto:` link only opens something if the visitor has a
mail client registered with their operating system — anyone reading mail in a
browser tab clicks it and nothing happens at all.

## Adding a whole new page

Copy an existing page so you inherit the header, footer, and `<head>`. Then
update, in the `<head>`: the `<title>`, the `description`, the `canonical` link,
and the `og:title` / `og:description` / `og:url` tags — those last ones control
what shows when the link is shared on social media, so stale values there are
visible to everyone.

Add the page to `sitemap.xml`, and add a link to it in the nav on **every**
page plus the footer list.

---

## Previewing locally

Open `index.html` in a browser and it mostly works. For an exact preview
(some paths behave differently over `file://`), run a local server from the
project folder:

```
npx serve .
```

Then open the address it prints, usually `http://localhost:3000`.

## If something looks broken

Almost every layout break comes from a missing closing tag — an `</div>` or
`</article>` that got deleted while copying a block. Compare your block against
one that still works; they should have the same shape.
