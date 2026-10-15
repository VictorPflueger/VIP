/* Victor Pflüger — turns data/prototypes.js and data/articles.js into cards and key-figure tiles.
 *
 * A plain script rather than a module, so the pages also work when opened straight from disk. Every
 * value from the data files goes into the page as text (textContent), never as markup; the only
 * markup this file injects is its own constant icon set. An entry with a missing or malformed value
 * is left out with a warning in the browser console (F12), so one typo never breaks a page.
 */
(function () {
  "use strict";

  /* Line icons on a 24 px grid, drawn like the prototypes' icon set. Constant and trusted. */
  var ICONS = {
    external: '<path d="M14 4.5h5.5V10M19.5 4.5L11 13M17 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"/>',
    arrowRight: '<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/>',
    code: '<path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5"/>',
    file: '<path d="M6 3.5h8.5L19 8v12.5H6z"/><path d="M14 3.5v5h5"/><path d="M9 12.5h7M9 16h7"/>',
    book: '<path d="M4.5 5.5c2.6-.9 5.1-.6 7.5 1 2.4-1.6 4.9-1.9 7.5-1v13c-2.6-.9-5.1-.6-7.5 1-2.4-1.6-4.9-1.9-7.5-1z"/><path d="M12 6.5v13"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="14" rx="1.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5M9 20.5h6"/>',
    star: '<path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z"/>',
    chat: '<path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5h-2.5z"/>',
    flask: '<path d="M9.5 3.5h5M10.5 3.5v5.2L5.4 18a1.6 1.6 0 0 0 1.4 2.5h10.4a1.6 1.6 0 0 0 1.4-2.5l-5.1-9.3V3.5"/><path d="M7.6 14.5h8.8"/>',
    play: '<circle cx="12" cy="12" r="8.5"/><path d="M10.2 8.8v6.4l5-3.2z"/>',
    screen: '<rect x="3.5" y="4.5" width="17" height="11.5" rx="1.5"/><path d="M8.5 20h7M12 16v4"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.7v.3"/>'
  };

  /* The kinds of card on the Prototypes, Demos and Tech-Showcases page. */
  var SHOWCASE_KINDS = {
    prototype: { label: "Prototype",     icon: "flask",  cta: "Open the prototype" },
    demo:      { label: "Demo",          icon: "play",   cta: "Open the demo" },
    showcase:  { label: "Tech-Showcase", icon: "screen", cta: "Open the showcase" }
  };

  /* The kinds of entry on the Articles, Events & Features page. "dated" kinds take place on a day,
     so the ones still to come are marked as upcoming. */
  var KINDS = {
    article:    { label: "Article",    icon: "file",     cta: "Read on" },
    whitepaper: { label: "Whitepaper", icon: "book",     cta: "Read on" },
    event:      { label: "Event",      icon: "calendar", cta: "Details on", dated: true },
    talk:       { label: "Talk",       icon: "mic",      cta: "Details on", dated: true },
    feature:    { label: "Feature",    icon: "star",     cta: "Read on" },
    podcast:    { label: "Podcast",    icon: "mic",      cta: "Listen on" },
    interview:  { label: "Interview",  icon: "chat",     cta: "Read on" }
  };

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---- small helpers ------------------------------------------------------------------------ */

  function icon(name, size) {
    var span = document.createElement("span");
    span.className = "icon";
    span.innerHTML = '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || ICONS.file) + "</svg>";
    return span;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function hiddenText(text) { return el("span", "visually-hidden", text); }

  function separator() {
    var dot = el("span", "sep", "·");
    dot.setAttribute("aria-hidden", "true");
    return dot;
  }

  function isText(value) { return typeof value === "string" && value.trim() !== ""; }

  function given(value) { return value !== undefined && value !== null && value !== ""; }

  /* An absolute web address (https:// or http://), or null. */
  function webUrl(value) {
    if (!isText(value)) return null;
    try {
      var url = new URL(value.trim());
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
    } catch (e) {
      return null;
    }
  }

  /* A file inside this site, such as images/prototypes/name.svg, or null. */
  function localPath(value) {
    if (!isText(value)) return null;
    var path = value.trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.indexOf("//") === 0 || /(^|\/)\.\.(\/|$)/.test(path)) return null;
    return path.replace(/^\.?\//, "");
  }

  /* "www.detecon.com" -> "detecon.com"; github.com -> "GitHub". */
  function siteName(url) {
    var host = new URL(url).hostname.replace(/^www\./, "");
    return host === "github.com" ? "GitHub" : host;
  }

  /* "YYYY-MM-DD" or "YYYY-MM" -> { y, m, d, key, iso }, or null. */
  function parseDate(value) {
    if (!isText(value)) return null;
    var match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value.trim());
    if (!match) return null;
    var y = Number(match[1]), m = Number(match[2]), d = match[3] ? Number(match[3]) : 0;
    if (m < 1 || m > 12) return null;
    if (match[3] && (d < 1 || d > new Date(Date.UTC(y, m, 0)).getUTCDate())) return null;
    return { y: y, m: m, d: d, key: y * 10000 + m * 100 + d, iso: value.trim() };
  }

  /* 3 Sep 2026, or Sep 2026 when the day is not given. */
  function formatDate(date) {
    return (date.d ? date.d + " " : "") + MONTHS[date.m - 1] + " " + date.y;
  }

  function todayKey() {
    var now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  }

  function isUpcoming(date) {
    var today = todayKey();
    return date.d ? date.key >= today : Math.floor(date.key / 100) >= Math.floor(today / 100);
  }

  function warn(where, problem, consequence) {
    console.warn("[" + where + "] " + problem + (consequence ? " – " + consequence : "") + ".");
  }

  function readList(globalName, file) {
    var list = window[globalName];
    if (list === undefined) return null;
    if (!Array.isArray(list)) {
      warn(file, "should hold a list in square brackets: window." + globalName + " = [ … ];", "nothing is shown");
      return [];
    }
    return list;
  }

  /* ---- prototypes ----------------------------------------------------------------------------- */

  function checkPrototype(entry, index) {
    var where = "data/prototypes.js, entry " + (index + 1) + (entry && isText(entry.name) ? " (" + entry.name.trim() + ")" : "");
    if (!entry || typeof entry !== "object") { warn(where, "is not a { … } block", "skipped"); return null; }
    if (!isText(entry.name)) { warn(where, "needs a name", "skipped"); return null; }
    if (!isText(entry.description)) { warn(where, "needs a description", "skipped"); return null; }
    var url = webUrl(entry.url);
    if (!url) { warn(where, 'needs a url that starts with "https://"', "skipped"); return null; }

    var kindKey = isText(entry.kind) ? entry.kind.trim().toLowerCase() : "prototype";
    var kind = SHOWCASE_KINDS[kindKey];
    if (!kind) {
      warn(where, "kind should be one of: " + Object.keys(SHOWCASE_KINDS).join(", "), "shown as a prototype");
      kind = SHOWCASE_KINDS.prototype;
    }
    var item = {
      name: entry.name.trim(),
      kind: kind,
      subtitle: isText(entry.subtitle) ? entry.subtitle.trim() : "",
      description: entry.description.trim(),
      url: url,
      code: null,
      icon: null,
      tags: [],
      note: isText(entry.note) ? entry.note.trim() : ""
    };
    if (given(entry.code)) {
      item.code = webUrl(entry.code);
      if (!item.code) warn(where, 'code should start with "https://"', "the source link is left out");
    }
    if (given(entry.icon)) {
      item.icon = localPath(entry.icon);
      if (!item.icon) warn(where, "icon should be a file in images/prototypes/", "the initial is shown instead");
    }
    if (Array.isArray(entry.tags)) {
      item.tags = entry.tags.filter(isText).map(function (tag) { return tag.trim(); });
    }
    return item;
  }

  function fallbackIcon(name) {
    var tile = el("span", "app-icon app-icon-fallback", name.charAt(0).toUpperCase());
    tile.setAttribute("aria-hidden", "true");
    return tile;
  }

  function prototypeCard(item) {
    var card = el("li", "card");

    var top = el("div", "card-top");
    if (item.icon) {
      var img = document.createElement("img");
      img.className = "app-icon";
      img.src = item.icon;
      img.alt = "";
      img.width = 56;
      img.height = 56;
      img.decoding = "async";
      img.addEventListener("error", function () {
        warn("data/prototypes.js (" + item.name + ")", "the icon " + item.icon + " was not found", "the initial is shown instead");
        img.replaceWith(fallbackIcon(item.name));
      });
      top.appendChild(img);
    } else {
      top.appendChild(fallbackIcon(item.name));
    }

    var head = el("div");
    var title = el("h2", "card-title");
    var link = el("a", "stretched", item.name);
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.appendChild(hiddenText(" (opens in a new tab)"));
    title.appendChild(link);
    head.appendChild(title);
    if (item.subtitle) head.appendChild(el("p", "card-sub", item.subtitle));
    top.appendChild(head);

    var go = icon("external", 20);
    go.classList.add("card-go");
    top.appendChild(go);
    card.appendChild(top);

    card.appendChild(el("p", "card-desc", item.description));

    // What it is (prototype, demo or tech-showcase), then its topics.
    var tags = el("ul", "tags");
    tags.setAttribute("aria-label", "Kind and topics");
    var kindChip = el("li", "chip chip-kind");
    kindChip.appendChild(icon(item.kind.icon, 14));
    kindChip.appendChild(document.createTextNode(item.kind.label));
    tags.appendChild(kindChip);
    item.tags.forEach(function (tag) { tags.appendChild(el("li", "chip", tag)); });
    card.appendChild(tags);

    if (item.note) {
      var note = el("p", "card-note");
      note.appendChild(icon("info", 16));
      note.appendChild(el("span", null, item.note));
      card.appendChild(note);
    }

    var foot = el("div", "card-foot");
    var cta = el("span", "card-cta", item.kind.cta);
    cta.setAttribute("aria-hidden", "true");
    cta.appendChild(icon("arrowRight", 18));
    foot.appendChild(cta);
    if (item.code) {
      var code = el("a", "btn btn-ghost btn-sm above");
      code.href = item.code;
      code.target = "_blank";
      code.rel = "noopener";
      code.appendChild(icon("code", 18));
      code.appendChild(document.createTextNode("Source code"));
      code.appendChild(hiddenText(" of " + item.name + " on " + siteName(item.code) + " (opens in a new tab)"));
      foot.appendChild(code);
    }
    card.appendChild(foot);
    return card;
  }

  function renderPrototypes(root, items) {
    root.textContent = "";
    if (!items.length) {
      root.appendChild(emptyNote("New prototypes, demos and tech-showcases are on their way."));
      return;
    }
    items.forEach(function (item) { root.appendChild(prototypeCard(item)); });
  }

  /* ---- articles, events and features -------------------------------------------------------- */

  function checkArticle(entry, index) {
    var where = "data/articles.js, entry " + (index + 1) + (entry && isText(entry.title) ? " (" + entry.title.trim().slice(0, 40) + ")" : "");
    if (!entry || typeof entry !== "object") { warn(where, "is not a { … } block", "skipped"); return null; }
    if (!isText(entry.title)) { warn(where, "needs a title", "skipped"); return null; }
    if (!isText(entry.publisher)) { warn(where, "needs a publisher", "skipped"); return null; }
    var date = parseDate(entry.date);
    if (!date) { warn(where, 'needs a date written as "YYYY-MM-DD"', "skipped"); return null; }
    var url = webUrl(entry.url);
    if (!url) { warn(where, 'needs a url that starts with "https://"', "skipped"); return null; }

    var kindKey = isText(entry.kind) ? entry.kind.trim().toLowerCase() : "";
    var kind = KINDS[kindKey];
    if (!kind) {
      warn(where, 'kind should be one of: ' + Object.keys(KINDS).join(", "), "shown as an article");
      kind = KINDS.article;
    }
    // The same piece in other languages: each needs a language and its own web address.
    var translations = [];
    if (given(entry.translations)) {
      if (!Array.isArray(entry.translations)) {
        warn(where, 'translations should be a list: [{ language: "German", url: "https://…" }]', "left out");
      } else {
        entry.translations.forEach(function (t, i) {
          var tUrl = t && webUrl(t.url);
          if (t && isText(t.language) && tUrl) translations.push({ language: t.language.trim(), url: tUrl, host: siteName(tUrl) });
          else warn(where, "translation " + (i + 1) + ' needs a language and a url that starts with "https://"', "left out");
        });
      }
    }
    return {
      title: entry.title.trim(),
      publisher: entry.publisher.trim(),
      date: date,
      url: url,
      host: siteName(url),
      label: isText(entry.label) ? entry.label.trim() : kind.label,
      icon: kind.icon,
      cta: kind.cta,
      upcoming: Boolean(kind.dated) && isUpcoming(date),
      place: isText(entry.place) ? entry.place.trim() : "",
      description: isText(entry.description) ? entry.description.trim() : "",
      role: isText(entry.role) ? entry.role.trim() : "",
      language: isText(entry.language) ? entry.language.trim() : "",
      translations: translations
    };
  }

  function articleCard(item) {
    var card = el("li", "card entry");

    var tile = el("div", "kind-tile");
    tile.appendChild(icon(item.icon, 26));
    card.appendChild(tile);

    var body = el("div", "entry-body");
    var meta = el("p", "entry-meta");
    meta.appendChild(el("span", "chip", item.label));
    if (item.upcoming) {
      var upcoming = el("span", "chip", "Upcoming");
      upcoming.setAttribute("data-tone", "pending");
      meta.appendChild(upcoming);
    }
    meta.appendChild(el("span", null, item.publisher));
    meta.appendChild(separator());
    var time = el("time", null, formatDate(item.date));
    time.dateTime = item.date.iso;
    meta.appendChild(time);
    if (item.place) {
      meta.appendChild(separator());
      meta.appendChild(el("span", null, item.place));
    }
    if (item.language) {
      meta.appendChild(separator());
      meta.appendChild(el("span", null, "In " + item.language));
    }
    body.appendChild(meta);

    var title = el("h3", "entry-title");
    var link = el("a", "stretched", item.title);
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.appendChild(hiddenText(" (opens on " + item.host + " in a new tab)"));
    title.appendChild(link);
    body.appendChild(title);

    if (item.description) body.appendChild(el("p", "entry-desc", item.description));

    var foot = el("p", "entry-foot");
    if (item.role) foot.appendChild(el("span", "entry-role", item.role));
    var cta = el("span", "card-cta", item.cta + " " + item.host);
    cta.setAttribute("aria-hidden", "true");
    cta.appendChild(icon("external", 16));
    foot.appendChild(cta);
    item.translations.forEach(function (t) {
      var alt = el("a", "btn btn-ghost btn-sm above", "Also in " + t.language);
      alt.href = t.url;
      alt.target = "_blank";
      alt.rel = "noopener";
      alt.appendChild(hiddenText(": " + item.title + " (opens on " + t.host + " in a new tab)"));
      alt.appendChild(icon("external", 16));
      foot.appendChild(alt);
    });
    body.appendChild(foot);

    card.appendChild(body);
    return card;
  }

  function renderArticles(root, items) {
    root.textContent = "";
    if (!items.length) {
      root.appendChild(emptyNote("New articles and events are on their way."));
      return;
    }
    var groups = [];
    items.forEach(function (item) {
      var group = groups[groups.length - 1];
      if (!group || group.year !== item.date.y) {
        group = { year: item.date.y, items: [] };
        groups.push(group);
      }
      group.items.push(item);
    });
    groups.forEach(function (group) {
      var section = el("section", "year-group");
      var heading = el("h2", "year num", String(group.year));
      heading.id = "year-" + group.year;
      section.setAttribute("aria-labelledby", heading.id);
      section.appendChild(heading);
      var list = el("ul", "entries");
      group.items.forEach(function (item) { list.appendChild(articleCard(item)); });
      section.appendChild(list);
      root.appendChild(section);
    });
  }

  /* ---- shared ----------------------------------------------------------------------------- */

  function emptyNote(text) {
    var note = el("div", "empty");
    note.appendChild(el("strong", null, text));
    return note;
  }

  function setText(selector, text) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (node) { node.textContent = text; });
  }

  function init() {
    var rawPrototypes = readList("PROTOTYPES", "data/prototypes.js");
    var rawArticles = readList("ARTICLES", "data/articles.js");

    if (rawPrototypes) {
      var prototypes = rawPrototypes.map(checkPrototype).filter(Boolean);
      var prototypeRoot = document.getElementById("prototype-list");
      if (prototypeRoot) renderPrototypes(prototypeRoot, prototypes);
      setText('[data-count="prototypes"]', String(prototypes.length));
    }

    if (rawArticles) {
      var articles = rawArticles.map(checkArticle).filter(Boolean);
      // Newest first; entries on the same date keep the order of the file.
      articles = articles
        .map(function (item, index) { return { item: item, index: index }; })
        .sort(function (a, b) { return b.item.date.key - a.item.date.key || a.index - b.index; })
        .map(function (pair) { return pair.item; });
      var articleRoot = document.getElementById("article-list");
      if (articleRoot) renderArticles(articleRoot, articles);
      setText('[data-count="articles"]', String(articles.length));

      var upcoming = articles.filter(function (item) { return item.upcoming; });
      var past = articles.filter(function (item) { return !item.upcoming; });
      var next = upcoming[upcoming.length - 1];
      var latest = past[0];
      setText('[data-latest="articles"]',
        next ? "next " + MONTHS[next.date.m - 1] + " " + next.date.y
          : latest ? "latest " + MONTHS[latest.date.m - 1] + " " + latest.date.y
          : "coming soon");
    }
  }

  try {
    init();
  } catch (error) {
    console.error("[js/site.js] The lists could not be built:", error);
  }
})();
