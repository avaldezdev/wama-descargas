// Completa la página de Windows con la última versión publicada en GitHub Releases.
// Si la API no responde, el botón usa el enlace fijo al instalador de la versión actual.
(function () {
  var REPO = 'avaldezdev/wama-print-agent-releases';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fecha(iso) {
    try {
      return new Date(iso).toLocaleDateString('es-PY', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return ''; }
  }

  // Las notas del release son una lista simple en markdown ("- punto").
  function notas(body) {
    var lines = String(body || '').split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    var items = lines.filter(function (l) { return /^[-*] /.test(l); })
      .map(function (l) { return '<li>' + esc(l.replace(/^[-*] /, '')) + '</li>'; });
    var text = lines.filter(function (l) { return !/^[-*] /.test(l) && !/^#/.test(l); })
      .map(function (l) { return '<p>' + esc(l) + '</p>'; });
    return text.join('') + (items.length ? '<ul>' + items.join('') + '</ul>' : '');
  }

  // Windows: va en el mismo repo con etiqueta `windows-v*` y NO es "latest" (esa es del APK),
  // así que se busca el release más nuevo con ese prefijo.
  fetch('https://api.github.com/repos/' + REPO + '/releases?per_page=30', {
    headers: { Accept: 'application/vnd.github+json' }
  })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (list) {
      var rel = (list || []).filter(function (x) {
        return !x.draft && !x.prerelease && /^windows-v/.test(x.tag_name || '');
      })[0];
      if (!rel) return;
      var version = String(rel.tag_name).replace(/^windows-v/, '');
      var exe = (rel.assets || []).filter(function (a) { return a.name === 'WAMA-Print-Agent-Setup.exe'; })[0];
      if (exe) document.getElementById('downloadWinBtn').href = exe.browser_download_url;

      var size = exe ? ' · ' + (exe.size / 1048576).toFixed(0) + ' MB' : '';
      document.getElementById('versionLineWin').innerHTML =
        'Última versión <strong>' + esc(version) + '</strong> · ' + esc(fecha(rel.published_at)) + size;

      var html = notas(rel.body);
      if (html) {
        document.getElementById('changesWin').innerHTML =
          '<h3>Versión ' + esc(version) + '</h3>' + html;
      }
    })
    .catch(function () { /* queda el enlace por defecto */ });
})();
