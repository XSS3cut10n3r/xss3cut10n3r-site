(function () {
  "use strict";

  var progress = document.querySelector(".reading-progress");
  var article = document.querySelector(".post-content");
  if (progress && article) {
    var update = function () {
      var pct = ((window.scrollY - article.offsetTop + window.innerHeight) / article.offsetHeight) * 100;
      progress.style.width = Math.max(0, Math.min(100, pct)) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  // Chroma code blocks: label with the language and copy on a click in the header strip.
  document.querySelectorAll(".highlight").forEach(function (block) {
    var code = block.querySelector("code");
    if (!code) return;
    var lang = Array.from(code.classList).find(function (c) { return c.indexOf("language-") === 0; });
    if (lang) block.setAttribute("data-lang", lang.slice(9));
    block.addEventListener("click", function (e) {
      var r = block.getBoundingClientRect();
      if (e.clientX - r.left < r.width - 80 || e.clientY - r.top > 50) return;
      navigator.clipboard.writeText(code.textContent.trim()).then(function () {
        block.setAttribute("data-copied", "true");
        setTimeout(function () { block.removeAttribute("data-copied"); }, 2000);
      });
    });
  });

  var toc = document.getElementById("toc-content");
  var headings = document.querySelectorAll(".post-body h2, .post-body h3");
  if (toc && headings.length) {
    var list = document.createElement("ul");
    headings.forEach(function (h, i) {
      if (!h.id) h.id = "heading-" + i;
      var li = document.createElement("li");
      if (h.tagName === "H3") li.className = "toc-sub";
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });
    toc.appendChild(list);
    var links = toc.querySelectorAll("a");
    var spy = function () {
      var current = 0;
      headings.forEach(function (h, i) { if (h.getBoundingClientRect().top <= 100) current = i; });
      links.forEach(function (l, i) { l.classList.toggle("active", i === current); });
    };
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  }
})();
