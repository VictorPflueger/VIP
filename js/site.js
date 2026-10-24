/* Victor Pflüger — turns data/prototypes.js and data/articles.js into cards and key figures.
 *
 * A plain script rather than a module, so the pages also work when opened straight from disk. Every
 * value from the data files goes into the page as text (textContent), never as markup, and the
 * cards are built from Vici's components (vici/dist/vici.min.css). An entry with a missing or
 * malformed value is left out with a warning in the browser console (F12), so one typo never
 * breaks a page.
 */
(function () {
  "use strict";

  /* The kinds of card on the Prototypes, demos and tech-showcases page: label, Vici icon, colour
     and the card's hint. The kind is a category, so it takes a pastel family (Vici: category tags
     use the families, status tags the semantic tones): lilac for prototypes, Vici's colour for
     experimental work, fjord for demos, teal for tech-showcases. The card's hexagon cell has the
     same colour as its tag. */
  var SHOWCASE_KINDS = {
    prototype: { label: "Prototype",     icon: "cube", tone: "lilac", cta: "Open the prototype" },
    demo:      { label: "Demo",          icon: "play", tone: "fjord", cta: "Open the demo" },
    showcase:  { label: "Tech-showcase", icon: "eye",  tone: "teal",  cta: "Open the showcase" }
  };

  /* The kinds of entry on the Articles, events & features page. "dated" kinds take place on a day,
     so the ones still to come are marked as upcoming. */
  var KINDS = {
    article:    { label: "Article",    icon: "type",     cta: "Read on" },
    whitepaper: { label: "Whitepaper", icon: "book",     cta: "Read on" },
    event:      { label: "Event",      icon: "calendar", cta: "Details on", dated: true },
    talk:       { label: "Talk",       icon: "users",    cta: "Details on", dated: true },
    feature:    { label: "Feature",    icon: "flag",     cta: "Read on" },
    podcast:    { label: "Podcast",    icon: "play",     cta: "Listen on" },
    interview:  { label: "Interview",  icon: "user",     cta: "Read on" }
  };

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---- small helpers ------------------------------------------------------------------------ */

  /* A Vici icon: a span that the stylesheet fills with the icon in the current text colour. */
  function icon(name) {
    var span = document.createElement("span");
    span.className = "vc-icon vc-icon--" + name;
    span.setAttribute("aria-hidden", "true");
    return span;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function hiddenText(text) { return el("span", "vc-visually-hidden", text); }

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

  /* A Vici hex-capsule tag, optionally coloured and with an icon. */
  function tag(text, tone, iconName) {
    var t = el("span", "vc-tag" + (tone ? " vc-tag--" + tone : ""));
    if (iconName) t.appendChild(icon(iconName));
    t.appendChild(document.createTextNode(text));
    return t;
  }

  /* A second link in a card, such as "Source code" or "Also in German". Vici keeps it clickable
     above the card's own link. It leaves the site, so it ends with Vici's external icon. */
  function extraLink(url, text, hidden) {
    var a = el("a", "vc-button vc-button--sm vc-button--ghost");
    a.href = url;
    a.appendChild(document.createTextNode(text));
    if (hidden) a.appendChild(hiddenText(hidden));
    a.appendChild(icon("external"));
    return a;
  }

  /* The hint at the bottom of a card that leads to another site: words and the external icon.
     The card's own link carries the name for screen readers, so the hint is hidden from them. */
  function cardHint(text) {
    var hint = el("span", "site-card-cta", text);
    hint.setAttribute("aria-hidden", "true");
    var ext = icon("external");
    ext.classList.add("vc-icon--sm");   // the size of the "Source code" button's icon next to it
    hint.appendChild(ext);
    return hint;
  }

  /* Vici's icon names, read once from its stylesheet, to check the icons named in the data. A page
     opened straight from disk may not let scripts read stylesheets; then every name is accepted. */
  var viciIcons = null;
  function isViciIcon(name) {
    if (!viciIcons) {
      viciIcons = {};
      Array.prototype.forEach.call(document.styleSheets, function (sheet) {
        var rules;
        try { rules = sheet.cssRules; } catch (e) { return; }
        (function collect(list) {
          Array.prototype.forEach.call(list || [], function (rule) {
            if (rule.cssRules) collect(rule.cssRules);
            var match = rule.selectorText && rule.selectorText.match(/\.vc-icon--[a-z0-9-]+/g);
            if (match) match.forEach(function (m) { viciIcons[m.slice(10)] = true; });
          });
        })(rules);
      });
    }
    return Object.keys(viciIcons).length === 0 || Object.prototype.hasOwnProperty.call(viciIcons, name);
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
      // A Vici icon name such as "search", or an image file in this site for a prototype's own icon.
      var iconValue = isText(entry.icon) ? entry.icon.trim() : "";
      if (/^[a-z0-9-]+$/.test(iconValue)) {
        if (isViciIcon(iconValue)) item.viciIcon = iconValue;
        else warn(where, 'icon "' + iconValue + '" is not one of Vici\'s icons', "the initial is shown instead");
      } else {
        item.icon = localPath(iconValue);
        if (!item.icon) warn(where, "icon should be a Vici icon name or a file in images/prototypes/", "the initial is shown instead");
      }
    }
    if (Array.isArray(entry.tags)) {
      item.tags = entry.tags.filter(isText).map(function (t) { return t.trim(); });
    }
    return item;
  }

  /* The card's hexagon cell in the kind's colour, with a Vici icon or, without one, the first
     letter of the name. */
  function protoCell(item) {
    var cell = el("span", "vc-cell vc-cell--xl vc-cell--" + item.kind.tone);
    cell.setAttribute("aria-hidden", "true");
    if (item.viciIcon) cell.appendChild(icon(item.viciIcon));
    else {
      cell.classList.add("site-proto__initial");
      cell.textContent = item.name.charAt(0).toUpperCase();
    }
    return cell;
  }

  function prototypeCard(item) {
    var card = el("li", "vc-card vc-card--interactive");
    var body = el("div", "vc-card__body");

    var head = el("div", "site-proto__head");
    if (item.icon) {
      // a prototype's own picture, cropped to a hexagon of the cell's size (Vici's .vc-hex-img)
      var img = document.createElement("img");
      img.className = "vc-hex-img site-proto__icon";
      img.src = item.icon;
      img.alt = "";
      img.width = 65;
      img.height = 56;
      img.decoding = "async";
      img.addEventListener("error", function () {
        warn("data/prototypes.js (" + item.name + ")", "the icon " + item.icon + " was not found", "the initial is shown instead");
        img.replaceWith(protoCell(item));
      });
      head.appendChild(img);
    } else {
      head.appendChild(protoCell(item));
    }
    var titles = el("div", "site-proto__titles");
    var title = el("h2", "vc-card__title");
    var link = el("a", "vc-card__link", item.name);
    link.href = item.url;
    title.appendChild(link);
    titles.appendChild(title);
    if (item.subtitle) titles.appendChild(el("p", "vc-card__meta", item.subtitle));
    head.appendChild(titles);
    body.appendChild(head);

    body.appendChild(el("p", null, item.description));

    // What it is (prototype, demo or tech-showcase), then its topics.
    var tags = el("ul", "vc-cluster vc-cluster--sm site-tags");
    tags.setAttribute("aria-label", "Kind and topics");
    var kindItem = el("li");
    kindItem.appendChild(tag(item.kind.label, item.kind.tone, item.kind.icon));
    tags.appendChild(kindItem);
    item.tags.forEach(function (t) {
      var li = el("li");
      li.appendChild(tag(t));
      tags.appendChild(li);
    });
    body.appendChild(tags);

    if (item.note) {
      var note = el("p", "site-note");
      note.appendChild(icon("info"));
      note.appendChild(el("span", null, item.note));
      body.appendChild(note);
    }
    card.appendChild(body);

    var foot = el("div", "vc-card__footer");
    foot.appendChild(cardHint(item.kind.cta));
    if (item.code) foot.appendChild(extraLink(item.code, "Source code", " of " + item.name + " on " + siteName(item.code)));
    card.appendChild(foot);
    return card;
  }

  function renderPrototypes(root, items) {
    root.textContent = "";
    if (!items.length) {
      // the empty state takes the list's place instead of sitting in it as one grid cell
      root.hidden = true;
      root.insertAdjacentElement("afterend", emptyNote("cube", "New prototypes, demos and tech-showcases are on their way.", "Until then, my code is on ", "GitHub", "https://github.com/VictorPflueger"));
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
      warn(where, "kind should be one of: " + Object.keys(KINDS).join(", "), "shown as an article");
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

  function metaItem(iconName, text) {
    var span = el("span");
    span.appendChild(icon(iconName));
    span.appendChild(document.createTextNode(text));
    return span;
  }

  function articleCard(item) {
    var card = el("li", "vc-card vc-card--interactive site-entry");
    var body = el("div", "vc-card__body");

    var cell = el("span", "vc-cell vc-cell--xl site-entry__cell");
    cell.setAttribute("aria-hidden", "true");
    cell.appendChild(icon(item.icon));
    body.appendChild(cell);

    var meta = el("p", "site-entry__meta");
    meta.appendChild(tag(item.label));
    if (item.upcoming) meta.appendChild(tag("Upcoming", "info", "clock"));
    meta.appendChild(el("span", null, item.publisher));
    var time = el("time");
    time.dateTime = item.date.iso;
    time.appendChild(icon("calendar"));
    time.appendChild(document.createTextNode(formatDate(item.date)));
    meta.appendChild(time);
    if (item.place) meta.appendChild(metaItem("pin", item.place));
    if (item.language) meta.appendChild(metaItem("globe-hex", "In " + item.language));
    body.appendChild(meta);

    // titles are quoted as published and often long: Inter (Vici's h5 style), as Bricolage is for
    // short headlines of a line or two
    var title = el("h3", "vc-card__title vc-h5");
    var link = el("a", "vc-card__link", item.title);
    link.href = item.url;
    link.appendChild(hiddenText(" (on " + item.host + ")"));
    title.appendChild(link);
    body.appendChild(title);

    if (item.description) body.appendChild(el("p", null, item.description));

    var foot = el("div", "site-entry__foot");
    if (item.role) foot.appendChild(el("span", "site-entry__role", item.role));
    foot.appendChild(cardHint(item.cta + " " + item.host));
    item.translations.forEach(function (t) {
      foot.appendChild(extraLink(t.url, "Also in " + t.language, ": " + item.title + " (on " + t.host + ")"));
    });
    body.appendChild(foot);

    card.appendChild(body);
    return card;
  }

  function renderArticles(root, items) {
    root.textContent = "";
    if (!items.length) {
      root.appendChild(emptyNote("book", "New articles and events are on their way.", "Until then, my publications are listed on ", "LinkedIn", "https://www.linkedin.com/in/victorpflueger"));
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
      var section = el("section", "site-year-group");
      var heading = el("h2", "site-year", String(group.year));
      heading.id = "year-" + group.year;
      section.setAttribute("aria-labelledby", heading.id);
      section.appendChild(heading);
      var list = el("ul", "vc-stack site-entries");
      group.items.forEach(function (item) { list.appendChild(articleCard(item)); });
      section.appendChild(list);
      root.appendChild(section);
    });
  }

  /* ---- shared ----------------------------------------------------------------------------- */

  /* Vici's empty state: a cluster of hexagon cells, what is missing and where to look instead. */
  function emptyNote(iconName, title, before, linkText, linkUrl) {
    var note = el("div", "vc-empty site-empty");
    var art = el("div", "vc-empty__art");
    art.setAttribute("aria-hidden", "true");
    art.appendChild(el("span"));
    art.appendChild(el("span"));
    art.appendChild(el("span"));
    art.appendChild(icon(iconName));
    note.appendChild(art);
    note.appendChild(el("p", "vc-empty__title", title));
    var text = el("p", "vc-empty__text", before);
    var link = el("a", null, linkText);
    link.href = linkUrl;
    link.rel = "me";
    text.appendChild(link);
    text.appendChild(document.createTextNode("."));
    note.appendChild(text);
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
