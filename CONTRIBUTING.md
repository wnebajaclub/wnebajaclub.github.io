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
  <div class="comp-photo"><img src="assets/img/comp-2027-somewhere.jpg" alt="Golden Bear Racing at Baja SAE Somewhere 2027"></div>
  <div class="comp-body">
    <div class="comp-year">2027</div>
    <h3>Baja SAE Somewhere</h3>
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
`comp-2027-somewhere.jpg`. Resize to roughly 1600px wide before committing —
full-size phone photos are several megabytes and make the site slow to load.

Always write a real `alt` description for screen readers.

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
