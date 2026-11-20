# Victor Pflüger · personal website

A static website with three pages, built with [Vici](https://victorpflueger.github.io/ViciDesign/index.html) 2.0,
Victor's own design system: merlot `#250010` with pastels, hexagons instead of circles, Bricolage
Grotesque and Inter, and the Vertex logo. Every page ends with the "Built by" byline, and the site is
written in British English.

No build step, no framework, no backend. It runs on GitHub Pages or any static host, and it also
works when `index.html` is opened straight from disk. Live at
<https://victorpflueger.github.io/VIP/index.html>.

| Page | File | Content |
|---|---|---|
| Home | `index.html` | Introduction with portrait, key figures, fields of work, career, education, contact |
| Prototypes, demos & tech-showcases | `prototypes.html` | One card per prototype, demo or tech-showcase, from `data/prototypes.js` |
| Articles, events & features | `articles.html` | One entry per article, event or feature, from `data/articles.js` |

The two lists live in data files. Adding something means editing one file; the HTML stays as it is.

---

## Add a prototype, demo or tech-showcase

1. Pick an icon from Vici's set (Vici's docs → Guidelines → Icons), for example `search`, `clock`
   or `layers`. The card shows it in a hexagon cell in the colour of the kind. Without an icon, the
   cell shows the name's first letter. A prototype's own picture also works: put it into
   `images/prototypes/` (a square image of at least 128 px, subject in the middle) and give its
   path instead; the card crops it to the same hexagon.
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
    icon: "search",                                         // a Vici icon, or images/prototypes/…
    tags: ["Agentic AI", "Procurement"],
    note: "Free simulation, no API key needed.",            // optional: a short practical note
  },
```

4. Save and reload the page. The card appears, and the counter on the home page goes up.

The `kind` shows as the card's first tag (*Prototype*, *Demo* or *Tech-showcase*, in lilac, fjord
or teal), colours the card's hexagon cell and sets the hint at the bottom of the card (*Open the
prototype*, *Open the demo*, *Open the showcase*). With no entries at all, the page shows Vici's
empty state with a link to my GitHub profile.

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

`language` adds "In German" to the entry's details. Each of the `translations` gets its own link
next to the main one ("Also in German"), as on the Detecon interview.

3. Save and reload. Events and talks dated today or later get an **Upcoming** status tag (Vici's
   information tone with a clock icon), and the tile on the home page then shows the next one
   instead of the latest.

**If an entry does not appear**, open the browser console (F12 → Console): it names the entry and
the value that is missing or malformed, for example a `url` without `https://` or a date written as
`18.03.2027`. A broken entry is skipped; the rest of the page keeps working.

## Replace the portrait

The portrait is Vici's: `vici/assets/brand/portrait.jpg`, 640 × 640 px. The home page shows it in
the middle hexagon of the honeycomb, which trims a sliver at the top and bottom and cuts the left
and right corners, so frame head and shoulders centrally. The byline at the foot of every page uses
the small copy, `vici/assets/brand/portrait-96.jpg`, which Vici makes with `scripts/brand/portrait.py`.
To change the portrait, replace it in Vici and copy both files here as described under
[Update Vici](#update-vici).

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
3. After a minute or two, the site is live at <https://victorpflueger.github.io/VIP/index.html>.

Every later push to `main` updates the site. The empty `.nojekyll` file tells GitHub to publish the
files as they are.

**Own domain.** Under **Settings → Pages → Custom domain**, enter the domain and add the DNS records
GitHub lists there at your registrar. A Pages site has one custom domain; to use both a `.com` and a
`.de` address, make one the custom domain and forward the other to it at the registrar. The site's
address in every byline comes from Vici's `src/brand/profile.json`: when the site moves, change it
there first, then the byline's globe link on the three pages and the `url` in the home page's
structured data.

**Before going live**, consider a legal notice (Impressum) and a privacy notice: for a professional
website run from Germany these are usually expected. They can be added as a fourth page, linked from
the footer.

## Shared header, navigation and footer

The three pages repeat the same header, navigation and footer. A change there, such as a new
navigation item, goes into all three files. Between phone and desktop widths (768 to 1023 px), the
navigation shows only the first word of the two long page names (`<span class="site-nav-more">`
holds the rest). On phones the links fold into a menu behind Vici's toggle; when the menu opens from
the keyboard, `js/site.js` moves focus to its first link, because in the page the links come before
the toggle.

## Byline

Vici 2.0 asks every page, prototype and website it builds to say who built it, this site included.
Each page carries Vici's byline first in the footer's bottom row: "Built by", the portrait and the
name with LinkedIn's mark as one link to LinkedIn, then a globe linking to this site's home page,
with the tooltip "Website". Both links use `rel="author"`. The profile links in the footer's
"Elsewhere" list and in the contact section use `rel="me"`, because on the personal site they point
to Victor's own profiles.

```html
<p class="vc-byline">
  <span class="vc-byline__label">Built by</span>
  <a class="vc-byline__person" href="https://www.linkedin.com/in/victorpflueger" rel="author">
    <span class="vc-avatar vc-avatar--xs"><img src="vici/assets/brand/portrait-96.jpg" alt="" width="96" height="96"></span>
    <span class="vc-byline__name">Victor Pflüger</span>
    <img class="vc-platform-mark" src="vici/assets/marks/linkedin.png" alt="" width="840" height="779">
    <span class="vc-visually-hidden"> on LinkedIn</span>
  </a>
  <span class="vc-tooltip-anchor">
    <a class="vc-byline__icon" href="https://victorpflueger.github.io/VIP/index.html" rel="author" aria-label="Victor Pflüger's website"><span class="vc-icon vc-icon--globe-hex" aria-hidden="true"></span></a>
    <span class="vc-tooltip" aria-hidden="true">Website</span>
  </span>
</p>
```

The website address is the one in Vici's `src/brand/profile.json`. If the site moves to its own
domain, that file changes first and the byline follows it.

## Design

The look is Vici's, and the site follows its guidelines:

- `vici/` holds Vici's stylesheet, script, fonts, logo, the platforms' marks and the portrait,
  copied unchanged from Vici 2.0 at commit `ddb0b95` (see `vici/README.md`). Don't edit these
  files; change Vici and copy them again.
- `css/site.css` only arranges Vici's components. The lists use Vici's layout classes (`vc-grid`,
  `vc-cluster`, `vc-stack`); the hero with its honeycomb flower and the career section's two
  columns keep small grids of their own. Colours, type, spacing, shadows and motion
  come from Vici's tokens (`var(--vc-…)`), the breakpoints are Vici's (480, 768, 1024 px), and the
  few lengths of its own (column minimums, the flower's size) are in `rem` on Vici's 4 px grid.
  It adds no colour values, fonts, gradients or round shapes, and never touches Vici's private
  properties. Its classes start with `site-`; every other class on the pages is Vici's.
- The pages sit on Vici's flat canvas and surfaces, with no gradients, glows or background
  patterns. The colour comes from the honeycomb's pastel cells and the dark contact section.
- Cells carry meaning, as Vici 2.0 asks: every hexagon stands for something. The honeycomb
  around the portrait lists the six fields of work, as a list that screen readers read too. A
  prototype's cell shows its own page icon in the colour of its kind, and the timeline's cells mark
  past and current roles. Headings that already say what a cell would show get none, and an
  article shows its kind as a tag.
- Colour carries meaning, as in Vici: merlot for the name, links and the one main button; the six
  fields of work each have a pastel family in the honeycomb (teal, fjord, apricot, honey, lilac and
  merlot's blush). The kinds of prototype are categories, so they take pastel families too: lilac
  (Vici's colour for experimental work) for prototypes, fjord for demos, teal for tech-showcases.
  Status, such as an upcoming event, takes Vici's semantic tones with an icon and a word.
- Text follows Vici's writing and type rules: British English (`lang="en-GB"` on every page);
  sentence case for headings, navigation and buttons; curly quotes in prose; no dashes as
  punctuation, with the en dash only joining ranges such as 2017–2020; page titles that separate
  their parts with a middle dot; no labels over headings, so an article's kind and date follow its
  title; Bricolage only for short headlines of a line or two (long article titles are set in
  Inter); no more than 75 characters per line in running text (Vici asks for 55 to 75; short card
  texts are naturally narrower).
- Buttons that only show an icon have a tooltip with their name. Standalone links, buttons and
  cards that lead to another site show the external-link icon. Links inside a sentence (such as
  "Built with Vici"), the footer's "Elsewhere" list, the byline and the buttons that carry
  LinkedIn's or GitHub's logo go without it, as Vici's link rule says.
- Light and dark theme follow the system setting; the moon/sun button switches and remembers the
  choice. `js/theme.js` applies a stored choice before the page is drawn.
- LinkedIn's [in] logo and GitHub's Invertocat are the platforms' own files, unchanged: black on
  light surfaces and white on dark ones.
- Links to my profiles use their canonical addresses and `rel="me"`; the byline's two links use
  `rel="author"`, as on every surface Vici builds. All links open in the same tab, and the site
  doesn't link to its own repository.

### Update Vici

`vici/README.md` lists the files and the Vici version they come from: 2.0 at commit `ddb0b95`,
until Vici tags `v2.0.0`. To update, copy the same files from a newer Vici release into the same
places, keep `vici/README.md` in step, and check the three pages in light and dark.

### Check the pages against Vici

Vici's checks for the byline, its writing rules and the AI notice can run on these pages. Clone
[ViciDesign](https://github.com/VictorPflueger/ViciDesign) into a folder named `ViciDesign` next to
this repository's folder, at the commit `vici/README.md` names, and save this as `check-vici.mjs`
in this repository's folder (it is not committed, so GitHub Pages doesn't publish it):

```js
import { readFileSync } from 'node:fs';
import { bylineProblems } from '../ViciDesign/scripts/lib/byline.mjs';
import { writingProblems } from '../ViciDesign/scripts/lib/writing.mjs';
import { aiNoticeProblems } from '../ViciDesign/scripts/lib/ai.mjs';

for (const page of ['index.html', 'prototypes.html', 'articles.html']) {
  const html = readFileSync(page, 'utf8');
  const problems = [...bylineProblems(html), ...writingProblems(html), ...aiNoticeProblems(html)];
  console.log(page, problems.length ? problems : 'OK');
}
```

`node check-vici.mjs` prints `OK` for each page. The checks read the HTML files, so the text the
data files add to the pages isn't covered: keep the data files to the same rules.

## Privacy

The pages load nothing from other sites: fonts, scripts and images are served from this repository,
there are no cookies and no tracking, and a content security policy in each page makes the browser
enforce it. The theme choice is kept in the browser's local storage and never leaves it.

## Files

```
index.html               Home
prototypes.html          Prototypes, demos & tech-showcases
articles.html            Articles, events & features
data/prototypes.js       ← add prototypes, demos and tech-showcases here
data/articles.js         ← add articles, events and features here
js/site.js               turns the data files into cards and key figures; focus for the phone menu
js/theme.js              applies a stored light or dark choice before the page is drawn
css/site.css             layout of the pages, on top of Vici
vici/                    Vici, copied unchanged (stylesheet, script, fonts, logo, marks, portrait)
images/prototypes/       for a prototype's own picture, if one is ever used (create the folder)
```
