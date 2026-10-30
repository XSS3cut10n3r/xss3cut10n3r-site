(function () {
  "use strict";
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    // Posts on the homepage render in shadow roots, which page-level selectors cannot reach.
    document.querySelectorAll(".reader-content").forEach(function (h) { h.setAttribute("data-theme", theme); });
    if (meta) meta.setAttribute("content", theme === "light" ? "#f6f7f9" : "#13151a");
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      b.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    });
  }
  apply(root.getAttribute("data-theme") || "dark");
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".theme-toggle");
    if (!btn) return;
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", next); } catch (err) {}
    apply(next);
    // The homepage replays its load fade-in on a switch; other pages just change.
    if (document.getElementById("wrapper") && document.body.classList.contains("is-loading") === false) {
      document.body.classList.add("is-loading");
      void document.body.offsetWidth;
      setTimeout(function () { document.body.classList.remove("is-loading"); }, 100);
    }
  });
})();
