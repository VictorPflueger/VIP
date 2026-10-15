/* Prototypes — shown as cards on prototypes.html, in the order listed here.
 *
 * TO ADD A PROTOTYPE: copy one block from { to }, paste it where the card should appear (first block
 * = first card), and change the values. Keep the quotes around text and the comma after each block.
 *
 *   name         Card title.                                                         (required)
 *   subtitle     One line under the title.                                           (optional)
 *   description  One or two short sentences.                                         (required)
 *   url          Where a click on the card leads: the live prototype.                 (required)
 *   code         Link to the source code, shown as a second link on the card.        (optional)
 *   icon         Square icon in images/prototypes/ (SVG or PNG, at least 112 px).     (optional)
 *                Without one, the card shows a burgundy tile with the first letter.
 *   tags         A few keywords, shown as chips.                                     (optional)
 *
 * Save the file and reload the page: the card appears, and the counter on the home page updates.
 * Icons have to sit in this site's own folder (images/prototypes/), because the pages load nothing
 * from other sites. If a card does not appear, the browser console (F12) says which value is missing.
 */
window.PROTOTYPES = [
  {
    name: "Rebate Hunter",
    subtitle: "Procurement Rebate Hunter",
    description: "An AI agent that finds supplier rebates a company earned but never claimed, works out what is owed and by when, and proposes costed recovery options for your approval.",
    url: "https://victorpflueger.github.io/PROC-Rebate-Hunter/",
    code: "https://github.com/VictorPflueger/PROC-Rebate-Hunter",
    icon: "images/prototypes/rebate-hunter.svg",
    tags: ["Agentic AI", "Procurement"],
  },
  {
    name: "Navigator",
    subtitle: "Supply Chain Disruption Navigator",
    description: "An AI agent that detects supply chain disruptions, works out which plant stops when and what it costs, and proposes costed responses for your approval.",
    url: "https://victorpflueger.github.io/supply-chain-navigator/",
    code: "https://github.com/VictorPflueger/supply-chain-navigator",
    icon: "images/prototypes/navigator.svg",
    tags: ["Agentic AI", "Supply chain"],
  },
];
