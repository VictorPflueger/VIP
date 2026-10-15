# Victor Pflüger — personal website

A static website with three pages, built in the design system of my two prototypes,
[Rebate Hunter](https://github.com/VictorPflueger/PROC-Rebate-Hunter) and
[Navigator](https://github.com/VictorPflueger/supply-chain-navigator): the same burgundy palette,
fonts, buttons, cards and dotted canvas.

No build step, no framework, no backend. It runs on GitHub Pages or any static host, and it also
works when `index.html` is opened straight from disk.

| Page | File | Content |
|---|---|---|
| Home | `index.html` | Introduction with portrait and LinkedIn link, key figures, fields of work, career, education, contact |
| Prototypes, Demos and Tech-Showcases | `prototypes.html` | One card per prototype, demo or tech-showcase, from `data/prototypes.js` |
| Articles, Events & Features | `articles.html` | One entry per article, event or feature, from `data/articles.js` |

The two lists live in data files. Adding something means editing one file; the HTML stays as it is.

---

## Add a prototype, demo or tech-showcase

1. Put its icon into `images/prototypes/`: a square SVG or PNG, at least 112 × 112 px. For my
   prototypes, that is their `favicon.svg`. Without an icon, the card shows a burgundy tile with the
   first letter.
2. Open `data/prototypes.js`, copy one block from `{` to `},` and paste it where the card should
   appear (the first block is the first card).
3. Change the values:

```js
  {
    name: "Rebate Hunter",                                   // card title (required)
    kind: "prototype",                                       // prototype, demo or showcase (default: prototype)
    subtitle: "Procurement Rebate Hunter",                   // one line under the title
    description: "An AI agent that finds supplier rebates …", // one or two sentences (required)
    url: "https://victorpflueger.github.io/PROC-Rebate-Hunter/", // a click on the card opens this (required)
    code: "https://github.com/VictorPflueger/PROC-Rebate-Hunter", // "Source code" link
    icon: "images/prototypes/rebate-hunter.svg",
    tags: ["Agentic AI", "Procurement"],
    note: "Free simulation, no API key needed.",            // optional: a short practical note
  },
```

4. Save and reload the page. The card appears, and the counter on the home page goes up.

The `kind` shows as the card's first label (*Prototype*, *Demo* or *Tech-Showcase*) and sets the
card's link text (*Open the prototype*, *Open the demo*, *Open the showcase*).

## Add an article, event or feature

1. Open `data/articles.js`, copy one block from `{` to `},` and paste it anywhere in the list. The
   page sorts by date, newest first, and groups the entries by year.
2. Change the values:

```js
  {
    kind: "event",                 // article, whitepaper, event, talk, feature, podcast or interview (required)
    label: "Masterclass",          // optional: your own label instead of "Event"
    title: "…",                    // (required)
    publisher: "Conference name",  // who published or hosted it (required)
    date: "2027-03-18",            // YYYY-MM-DD, or YYYY-MM if the day is unknown (required)
    place: "Berlin",               // optional, for events
    url: "https://…",              // a click on the entry opens this (required)
    language: "German",            // optional: the language of that page, if not English
    translations: [                // optional: the same piece in other languages
      { language: "German", url: "https://…" },
    ],
    description: "…",              // optional, one or two sentences
    role: "Speaker",               // optional: Co-author, Speaker, Interviewed, …
  },
```

`language` adds "In German" to the entry's line of details. Each of the `translations` gets its own
link next to the main one ("Also in German"), as on the Detecon interview.

3. Save and reload. Events and talks dated today or later get an **Upcoming** chip, and the tile on
   the home page then shows the next one instead of the latest.

**If an entry does not appear**, open the browser console (F12 → Console): it names the entry and
the value that is missing or malformed, for example a `url` without `https://` or a date written as
`18.03.2027`. A broken entry is skipped; the rest of the page keeps working.

## Replace the portrait

`images/portrait.jpg` is a 600 × 600 px photo. To change it, save another square photo of at least
400 × 400 px under the same name. The page crops it to a circle, so keep the face in the middle.

## Preview locally

Double-click `index.html`: the site works straight from disk. To see it exactly as a web server
serves it, run this in the repository folder and open <http://localhost:8000>:

```
python -m http.server 8000
```

## Publish with GitHub Pages

1. On GitHub, open the repository → **Settings** → **Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder
   **/ (root)**, and **Save**.
3. After a minute or two, the site is live at <https://victorpflueger.github.io/VIP/>.

Every later push to `main` updates the site. The empty `.nojekyll` file tells GitHub to publish the
files as they are.

**Own domain.** Under **Settings → Pages → Custom domain**, enter the domain and add the DNS records
GitHub lists there at your registrar. A Pages site has one custom domain; to use both a `.com` and a
`.de` address, make one the custom domain and forward the other to it at the registrar.

**Before going live**, consider a legal notice (Impressum) and a privacy notice: for a professional
website run from Germany these are usually expected. They can be added as a fourth page, linked from
the footer.

## Shared header, navigation and footer

The three pages repeat the same header, navigation and footer. A change there, such as a new
navigation item, goes into all three files.

## Design

The look comes from the prototypes' design system (their `DESIGN.md`):

- `css/tokens.css` holds the colour palette, copied unchanged from the prototypes, where
  `tools/palette.mjs` generates it from the brand burgundy `#7a1e3a`. If the palette changes there,
  copy the new `:root` block here.
- `css/fonts.css` and `fonts/` are the prototypes' self-hosted fonts: Barlow, Barlow Semi Condensed
  and IBM Plex Mono (SIL Open Font License).
- `css/site.css` assigns roles (`--brand`, `--text-muted`, `--line` and so on) and styles the pages.
  It adds no colour values of its own: use a role, not a new hex value.
- The colour grammar stays the prototypes': burgundy for identity and action (the mark, primary
  buttons, the page you are on), slate for the dotted canvas, ink for everything else. Red, amber,
  green, blue and violet carry meaning in the prototypes, so they do not decorate here.
- `favicon.svg` repeats the mark in plain colour values, because an icon file cannot read the tokens.

## Privacy

The pages load nothing from other sites: fonts, scripts and images are served from this repository,
there are no cookies and no tracking, and a content security policy in each page makes the browser
enforce it. Links to LinkedIn, GitHub, the prototypes and the articles open in a new tab.

## Files

```
index.html               Home
prototypes.html          Prototypes
articles.html            Articles, Events & Features
data/prototypes.js       ← add prototypes, demos and tech-showcases here
data/articles.js         ← add articles, events and features here
js/site.js               turns the data files into cards and home-page tiles
css/tokens.css           colour palette (from the prototypes)
css/fonts.css, fonts/    self-hosted fonts (from the prototypes)
css/site.css             roles, layout and components
images/portrait.jpg      portrait (600 × 600 px)
images/prototypes/       prototype icons
favicon.svg              browser tab icon
```
