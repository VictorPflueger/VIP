/* Victor Pflüger — applies the theme chosen with the toggle before the page is drawn, so a dark
 * choice doesn't flash light first. vici/dist/vici.js does the rest: the toggle itself and
 * remembering the choice. Without a stored choice the page follows the system setting.
 */
(function () {
  "use strict";
  try {
    var theme = window.localStorage.getItem("vc-theme");
    if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    /* storage is blocked: the page follows the system setting */
  }
})();
