(function () {
  var panels = new Map();
  document.querySelectorAll('#main article[data-path]').forEach(function (panel) {
    panels.set(panel.dataset.path, panel);
  });
  function convertLinks(scope) {
    scope.querySelectorAll('a[href]').forEach(function (link) {
      var url = new URL(link.getAttribute('href'), location.origin);
      var panel = url.origin === location.origin && panels.get(url.pathname);
      if (panel) {
        link.href = '#' + panel.id;
        if (url.hash) link.dataset.section = url.hash.slice(1);
      }
    });
  }
  document.querySelectorAll('template.reader-post').forEach(function (template) {
    var panel = panels.get(template.dataset.path);
    if (!panel) return;
    var root = panel.querySelector('.reader-content').attachShadow({mode: 'open'});
    var content = template.content.cloneNode(true);
    content.querySelectorAll('script').forEach(function (script) { script.remove(); });
    root.append(document.getElementById('reader-styles').content.cloneNode(true), content);
    convertLinks(root);
    root.querySelectorAll('.highlight').forEach(function (block) {
      var code = block.querySelector('code');
      var lang = code && Array.from(code.classList).find(function (c) { return c.startsWith('language-'); });
      if (lang) block.dataset.lang = lang.slice(9);
    });
    root.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && !link.target) {
        var raw = link.getAttribute('href');
        if (raw.startsWith('#')) {
          event.preventDefault();
          var local = root.getElementById(decodeURIComponent(raw.slice(1)));
          if (local) local.scrollIntoView();
          else location.hash = raw;
        } else {
          var url = new URL(raw, location.origin);
          if (url.origin === location.origin && url.pathname === '/') {
            event.preventDefault(); location.hash = url.hash || '#writeups';
          }
        }
      }
      var img = event.target.closest('.reading-body img');
      if (img && !img.closest('a')) {
        var viewer = root.querySelector('.image-viewer');
        viewer.querySelector('img').src = img.src;
        viewer.querySelector('img').alt = img.alt;
        viewer.showModal(); viewer.onclick = function () { viewer.close(); };
      }
      var block = event.target.closest('.highlight');
      if (block) {
        var rect = block.getBoundingClientRect();
        if (event.clientX > rect.right - 80 && event.clientY < rect.top + 50) {
          navigator.clipboard.writeText(block.querySelector('code').textContent.trim()).then(function () {
            block.dataset.copied = 'true'; setTimeout(function () { delete block.dataset.copied; }, 2000);
          }).catch(function () {});
        }
      }
    });
  });
  convertLinks(document);
  // Preserve links shared by the previous reader without a page reload.
  if (location.hash.startsWith('#post=')) {
    try {
      var url = new URL(decodeURIComponent(location.hash.slice(6)), location.origin);
      var panel = panels.get(url.pathname);
      if (panel) history.replaceState(null, '', '#' + panel.id);
    } catch (_) {}
  }
})();
