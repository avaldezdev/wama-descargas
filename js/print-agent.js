// Completa la página con las últimas versiones publicadas en GitHub Releases (APK y Windows).
// Si la API no responde, la página igual funciona: el botón usa el enlace
// /releases/latest/download/PrintAgent.apk, que GitHub resuelve siempre a la última.
(function () {
  var REPO = 'avaldezdev/wama-print-agent-releases';
  var API = 'https://api.github.com/repos/' + REPO + '/releases/latest';

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

  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (rel) {
      var version = String(rel.tag_name || '').replace(/^v/, '');
      var apk = (rel.assets || []).filter(function (a) { return /^PrintAgent-v.*\.apk$/.test(a.name); })[0];
      if (apk) document.getElementById('downloadBtn').href = apk.browser_download_url;

      var size = apk ? ' · ' + (apk.size / 1048576).toFixed(1) + ' MB' : '';
      document.getElementById('versionLine').innerHTML =
        'Última versión <strong>' + esc(version) + '</strong> · ' + esc(fecha(rel.published_at)) + size;

      var html = notas(rel.body);
      if (html) {
        document.getElementById('changes').innerHTML =
          '<h3>Versión ' + esc(version) + '</h3>' + html;
      }
    })
    .catch(function () { /* queda el contenido por defecto */ });

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
    })
    .catch(function () { /* queda el enlace por defecto */ });
})();
