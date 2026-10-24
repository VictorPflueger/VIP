# Vici, copied into this site

These files come unchanged from Vici, Victor Pflüger's design system
(<https://victorpflueger.github.io/ViciDesign/index.html>), version **v1.0.0** (commit `fdd868b` on its main branch).
The site loads them from here rather than from a CDN, so every page is served from this site alone.

| File here | What it is |
|---|---|
| `dist/vici.min.css` | Vici's stylesheet: tokens, light and dark theme, components, icons |
| `dist/vici.js` | Vici's small script: theme toggle, mobile menu, tooltips |
| `assets/fonts/*.woff2` | Bricolage Grotesque, Inter, JetBrains Mono and Vici Mask, as the stylesheet expects them |
| `assets/fonts/OFL-*.txt` | The SIL Open Font License of each font family |
| `assets/logo/favicon.svg` | The Vertex favicon |
| `assets/logo/vertex/color.svg`, `dark.svg` | The Vertex symbol for light and dark headers |
| `assets/marks/linkedin.png` | LinkedIn's [in] logo, as LinkedIn publishes it |
| `assets/marks/github.svg`, `OCTICONS-LICENSE` | GitHub's Invertocat from Octicons, inlined in the pages, with its licence |
| `assets/marks/README.md` | Where the marks come from and how they may be used |
| `assets/brand/portrait.jpg` | Victor's portrait, 640 × 640 px |
| `LICENSE` | Vici's licence |

Keep the folder structure: the stylesheet finds the fonts at `../assets/fonts/`.

**Licence.** `LICENSE` covers all of it: Vici's code is MIT-licensed; the fonts are under the SIL
Open Font License; Victor Pflüger's name, portrait and logo are reserved for his own use; LinkedIn's
and GitHub's logos belong to them.

**Updating.** Copy the same files from a newer Vici release (its `dist/` and `assets/` folders and
`LICENSE`) over these, and change the version and commit above. Then look at the three pages in
light and dark: a new release may rename a class.
