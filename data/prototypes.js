/* Prototypes, demos and tech-showcases — shown as cards on prototypes.html, in the order listed here.
 *
 * TO ADD A PROTOTYPE, DEMO OR TECH-SHOWCASE: copy one block from { to }, paste it where the card
 * should appear (first block = first card), and change the values. Keep the quotes around text and
 * the comma after each block.
 *
 *   name         Card title.                                                         (required)
 *   kind         What it is: "prototype", "demo" or "showcase"; shown as a label,    (optional)
 *                and the card's link reads "Open the prototype", "Open the demo" or
 *                "Open the showcase". Without a kind, the card is a prototype.
 *   subtitle     One line under the title.                                           (optional)
 *   description  One or two short sentences.                                         (required)
 *   url          Where a click on the card leads: the live version.                  (required)
 *   code         Link to the source code, shown as a second link on the card.        (optional)
 *   icon         Square icon in images/prototypes/ (SVG or PNG, at least 112 px).     (optional)
 *                Without one, the card shows a burgundy tile with the first letter.
 *   tags         A few keywords, shown as chips.                                     (optional)
 *   note         A short practical note, e.g. how to try it or what data it uses.    (optional)
 *
 * Save the file and reload the page: the card appears, and the counter on the home page updates.
 * Icons have to sit in this site's own folder (images/prototypes/), because the pages load nothing
 * from other sites. If a card does not appear, the browser console (F12) says which value is missing.
 */
window.PROTOTYPES = [
  {
    name: "Rebate Hunter",
    kind: "prototype",
    subtitle: "Procurement Rebate Hunter",
    description: "An AI agent that finds supplier rebates a company earned but never claimed, works out what is owed and by when, and proposes costed recovery options for your approval.",
    url: "https://victorpflueger.github.io/PROC-Rebate-Hunter/",
    code: "https://github.com/VictorPflueger/PROC-Rebate-Hunter",
    icon: "images/prototypes/rebate-hunter.svg",
    tags: ["Agentic AI", "Procurement"],
    note: "Free simulation, no API key needed. Fictional company, no client data.",
  },
  {
    name: "Navigator",
    kind: "prototype",
    subtitle: "Supply Chain Disruption Navigator",
    description: "An AI agent that detects supply chain disruptions, works out which plant stops when and what it costs, and proposes costed responses for your approval.",
    url: "https://victorpflueger.github.io/supply-chain-navigator/",
    code: "https://github.com/VictorPflueger/supply-chain-navigator",
    icon: "images/prototypes/navigator.svg",
    tags: ["Agentic AI", "Supply chain"],
    note: "Free simulation, no API key needed. Fictional company, no client data.",
  },
  {
    name: "Timetable Translator",
    kind: "prototype",
    subtitle: "Two timetables, one truth",
    description: "An AI agent that finds where railway passenger information contradicts the operational timetable, checks it against track and train sensors, works out who will act on the wrong information and how soon, and proposes costed responses for your approval.",
    url: "https://victorpflueger.github.io/physicalAI-scheduler/",
    code: "https://github.com/VictorPflueger/physicalAI-scheduler",
    icon: "images/prototypes/timetable-translator.svg",
    tags: ["Agentic AI", "Physical AI", "Rail"],
    note: "Free simulation, no API key needed. Fictional trains, no client data.",
  },
  {
    name: "Repack Pilot",
    kind: "showcase",
    subtitle: "Physical AI repacking showcase",
    description: "A simulated robot cell, planned by an AI agent, repacks mixed pallets into store orders overnight and learns from surprises. An engine prices every 1,000 units in labour hours and euros, manual baseline against the hybrid cell.",
    url: "https://victorpflueger.github.io/physicalAI-repacking/",
    code: "https://github.com/VictorPflueger/physicalAI-repacking",
    icon: "images/prototypes/repack-pilot.svg",
    tags: ["Physical AI", "Agentic AI", "Logistics"],
    note: "Work in progress. Free simulation, no API key needed. Fictional retailer, no client data.",
  },
];
