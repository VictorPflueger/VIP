/* Prototypes, demos and tech-showcases — shown as cards on prototypes.html, in the order listed here.
 *
 * TO ADD A PROTOTYPE, DEMO OR TECH-SHOWCASE: copy one block from { to }, paste it where the card
 * should appear (first block = first card), and change the values. Keep the quotes around text and
 * the comma after each block.
 *
 *   name         Card title.                                                         (required)
 *   kind         What it is: "prototype", "demo" or "showcase"; shown as a tag in its   (optional)
 *                colour (lilac, fjord or teal), and the card's hint reads "Open the
 *                prototype", "Open the demo" or "Open the showcase". Without a kind,
 *                the card is a prototype.
 *   subtitle     One line under the title.                                           (optional)
 *   description  One or two short sentences.                                         (required)
 *   url          Where a click on the card leads: the live version.                  (required)
 *   code         Link to the source code, shown as a second link on the card.        (optional)
 *   icon         A Vici icon, shown in a hexagon in the kind's colour, e.g. "search",   (optional)
 *                "clock" or "layers" (all icons: Vici's docs, Guidelines → Icons).
 *                A picture in images/prototypes/ shows the prototype's own image instead,
 *                cropped to the same hexagon (so keep its subject in the middle).
 *                Without an icon, the hexagon shows the name's first letter.
 *   tags         A few keywords, shown as tags.                                      (optional)
 *   note         A short practical note, e.g. how to try it or what data it uses.    (optional)
 *
 * Save the file and reload the page: the card appears, and the counter on the home page updates.
 * Pictures have to sit in this site's own folder (images/prototypes/), because the pages load
 * nothing from other sites. If a card does not appear, the browser console (F12) says which value
 * is missing.
 */
window.PROTOTYPES = [
  {
    name: "Rebate Hunter",
    kind: "prototype",
    subtitle: "Procurement Rebate Hunter",
    description: "An AI agent that finds supplier rebates a company earned but never claimed, works out what is owed and by when, and proposes costed recovery options for your approval.",
    url: "https://victorpflueger.github.io/PROC-Rebate-Hunter/",
    code: "https://github.com/VictorPflueger/PROC-Rebate-Hunter",
    icon: "search",
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
    icon: "globe-hex",
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
    icon: "clock",
    tags: ["Agentic AI", "Physical AI", "Rail"],
    note: "Free simulation, no API key needed. Fictional trains, no client data.",
  },
  {
    name: "Dispatch Lab",
    kind: "prototype",
    subtitle: "T-Brain Mobility Challenge",
    description: "The Neu-Frankfurt rail scenario simulated in your browser under three dispatching strategies, from the challenge's baseline to a planner that serves every stop.",
    url: "https://victorpflueger.github.io/mobilitychallenge/",
    code: "https://github.com/VictorPflueger/mobilitychallenge",
    icon: "flag",
    tags: ["Optimization", "Rail"],
    note: "Runs in your browser, no data leaves it. The scenario is the challenge's fictional network.",
  },
  {
    name: "Duty Radar",
    kind: "prototype",
    subtitle: "Find, cluster and price duties",
    description: "An AI agent that inventories the reporting and documentation duties in a slice of federal law, finds duties that ask for the same data, prices them with the federal compliance-cost method and drafts relief options for your approval.",
    url: "https://victorpflueger.github.io/dutyradar/",
    code: "https://github.com/VictorPflueger/dutyradar",
    icon: "filter",
    tags: ["Agentic AI", "Public sector"],
    note: "Work in progress. Free simulation, no API key needed. Real federal law, assumed case numbers.",
  },
  {
    name: "Price Variance Agent",
    kind: "prototype",
    subtitle: "Procurement price variance",
    description: "An AI agent that finds where a group pays different prices for the same item or service, makes the prices comparable, separates the justified from the unexplained part and proposes costed options for your approval.",
    url: "https://victorpflueger.github.io/PROC-price-variance/",
    code: "https://github.com/VictorPflueger/PROC-price-variance",
    icon: "trend-down",
    tags: ["Agentic AI", "Procurement"],
    note: "Work in progress. Fictional company, no client data.",
  },
  {
    name: "Sovereignty Assessment",
    kind: "prototype",
    subtitle: "Digital sovereignty of German public services",
    description: "An AI agent that assesses how digitally sovereign a German public service is: who makes and who runs each of its building blocks, scored per layer of the Deutschland-Stack, with a source for every finding.",
    url: "https://victorpflueger.github.io/sovereigntyassessment/",
    code: "https://github.com/VictorPflueger/sovereigntyassessment",
    icon: "honeycomb",
    tags: ["Agentic AI", "Public sector"],
    note: "Work in progress. Free simulation, no API key needed. Indicative scores, not an official assessment.",
  },
  {
    name: "Data Quality Agent",
    kind: "prototype",
    subtitle: "Procurement data quality",
    description: "An AI agent that finds missing and contradictory procurement data, works out the root cause, who has to act and what it costs, and proposes costed fixes for your approval.",
    url: "https://victorpflueger.github.io/PROC-data-quality/",
    code: "https://github.com/VictorPflueger/PROC-data-quality",
    icon: "check",
    tags: ["Agentic AI", "Procurement"],
    note: "Work in progress. Fictional company, no client data.",
  },
  {
    name: "Repack Pilot",
    kind: "showcase",
    subtitle: "Physical AI repacking showcase",
    description: "A simulated robot cell, planned by an AI agent, repacks mixed pallets into store orders overnight and learns from surprises. An engine prices every 1,000 units in labour hours and euros, manual baseline against the hybrid cell.",
    url: "https://victorpflueger.github.io/physicalAI-repacking/",
    code: "https://github.com/VictorPflueger/physicalAI-repacking",
    icon: "layers",
    tags: ["Physical AI", "Agentic AI", "Logistics"],
    note: "Work in progress. Free simulation, no API key needed. Fictional retailer, no client data.",
  },
];
