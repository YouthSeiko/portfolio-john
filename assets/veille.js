(function () {
  var SUPA_URL = 'https://poblajswlpxvcahjmdba.supabase.co';
  var SUPA_KEY = 'sb_publishable_9XjEihKaXa6yplGtOWc_vA_uYdks4Nt';
  var section = document.getElementById('veille');
  var navLink = document.getElementById('nav-veille');
  var grid = document.getElementById('veille-grid');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function relDate(iso) {
    if (!iso) return '';
    var d = new Date(iso), now = new Date();
    var days = Math.floor((now - d) / 864e5);
    if (days <= 0) return "aujourd'hui";
    if (days === 1) return 'hier';
    if (days < 30) return 'il y a ' + days + ' j';
    var months = Math.floor(days / 30);
    if (months < 12) return 'il y a ' + months + ' mois';
    var years = Math.floor(months / 12);
    return 'il y a ' + years + ' an' + (years > 1 ? 's' : '');
  }

  fetch(SUPA_URL + '/rest/v1/pins?select=title,url,source,summary,created_at&order=created_at.desc&limit=24', {
    headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY }
  })
    .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
    .then(function (rows) {
      if (!Array.isArray(rows) || !rows.length) return;
      grid.innerHTML = rows.map(function (a) {
        var title = esc(a.title || 'Article');
        var url = esc(a.url || '#');
        var src = esc(a.source || '');
        var sum = esc((a.summary || '').slice(0, 160));
        var date = esc(relDate(a.created_at));
        return '<article class="veille-card"><a href="' + url + '" target="_blank" rel="noopener">' +
          '<div class="veille-meta"><i class="fa-solid fa-newspaper"></i>' +
          (src ? '<span class="veille-source">' + src + '</span>' : '') +
          (date ? '<span class="veille-date">' + date + '</span>' : '') +
          '</div><h3>' + title + '</h3>' +
          (sum ? '<p>' + sum + '</p>' : '') +
          '<span class="veille-cta">Lire l\'article <i class="fa-solid fa-arrow-up-right-from-square"></i></span>' +
          '</a></article>';
      }).join('');
      section.hidden = false;
      navLink.hidden = false;
    })
    .catch(function () {});
})();
