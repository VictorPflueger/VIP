/* Articles, events and features — shown on articles.html, newest first, grouped by year.
 * The order in this file does not matter: the page sorts by date.
 *
 * TO ADD AN ENTRY: copy one block from { to }, paste it anywhere in the list, and change the values.
 * Keep the quotes around text and the comma after each block.
 *
 *   kind         What it is; sets the icon and the label:                             (required)
 *                "article", "whitepaper", "event", "talk", "feature", "podcast" or "interview".
 *   label        Your own label instead of the kind's, e.g. "Expert article".        (optional)
 *   title        Title of the piece, talk or event.                                  (required)
 *   publisher    Who published or hosted it.                                         (required)
 *   date         "YYYY-MM-DD" (or "YYYY-MM" if the day is unknown).                   (required)
 *                Events and talks dated today or later are marked "Upcoming".
 *   place        For events: city or "Online".                                       (optional)
 *   url          Where a click on the entry leads.                                    (required)
 *   description  One or two short sentences.                                         (optional)
 *   role         Your part, e.g. "Co-author", "Speaker", "Interviewed".              (optional)
 *
 * Save the file and reload the page: the entry appears, and the counter on the home page updates.
 * If an entry does not appear, the browser console (F12) says which value is missing.
 *
 * Example of an event (remove the leading asterisks):
 *   {
 *     kind: "event",
 *     title: "Masterclass: …",
 *     publisher: "Conference name",
 *     date: "2027-03-18",
 *     place: "Berlin",
 *     url: "https://…",
 *     role: "Speaker",
 *   },
 */
window.ARTICLES = [
  {
    kind: "whitepaper",
    title: "Two AI worlds, one robot: Why real business value only emerges when Physical AI and Agentic AI work together",
    publisher: "Detecon International",
    date: "2026-09-03",
    url: "https://www.detecon.com/en/insights/whitepaper/two-ai-worlds-one-robot-why-real-business-value-only-emerges-when-physical-ai-and-agentic-ai-work-together",
    description: "Agentic AI plans and decides; Physical AI perceives and acts. Why real business value only emerges when the two work together, and how to get from pilot projects to scaled deployment.",
    role: "Co-author",
  },
  {
    kind: "article",
    label: "Expert article",
    title: "Agentic AI as a game changer",
    publisher: "T-Systems",
    date: "2026-03-31",
    url: "https://www.t-systems.com/de/en/insights/newsroom/expert-blogs/agentic-ai-as-a-game-changer-1155332",
    description: "Why agentic AI moves AI from assisting to acting, how the EU AI Act affects high-risk use cases, and how Detecon's APEX framework supports a secure, scalable rollout.",
    role: "Co-author",
  },
];
