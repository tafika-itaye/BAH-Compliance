function renderSidebar(activePage) {
  var user = getUser();
  if (!user) return;

  var isQuality = user.role === 'quality' || user.role === 'admin';
  var isCEO     = user.role === 'ceo'     || user.role === 'quality' || user.role === 'admin';

  var pending     = getPending().length;
  var openInc     = getIncidents().filter(function(i){ return i.status === 'Investigating' || i.status === 'Action Plan'; }).length;
  var overdueAct  = getActions().filter(function(a){ return a.status === 'Overdue'; }).length;

  var nav = '';
  nav += '<div class="sb-section">Overview</div>';
  nav += sbLink('dashboard', '⊞', 'Dashboard', 'dashboard.html', activePage, 0);

  nav += '<div class="sb-section">Policies &amp; SOPs</div>';
  if (isQuality) nav += sbLink('policies', '📋', 'Policy Management', 'policies.html', activePage, 0);
  nav += sbLink('sops', '📘', 'SOP Library', 'sops.html', activePage, 0);
  nav += sbLink('attestations', '✍', 'My Attestations', 'attestations.html', activePage, pending);

  nav += '<div class="sb-section">Incidents</div>';
  nav += sbLink('report', '⚠', 'Report Incident', 'report-incident.html', activePage, 0);
  if (isQuality) {
    nav += sbLink('incidents', '☰', 'All Incidents', 'incidents.html', activePage, openInc);
    nav += sbLink('actions', '🔧', 'Corrective Actions', 'corrective-actions.html', activePage, overdueAct);
  }

  if (isCEO) {
    nav += '<div class="sb-section">Performance</div>';
    nav += sbLink('kpi', '📊', 'KPI Dashboard', 'kpi.html', activePage, 0);
    nav += sbLink('export', '📤', 'COHSASA Export', 'cohsasa-export.html', activePage, 0);
  }

  if (user.role === 'admin') {
    nav += '<div class="sb-section">System</div>';
    nav += sbLink('settings', '⚙', 'Settings', 'settings.html', activePage, 0);
  }

  var colors = ['#0067c0','#107c10','#c75700','#5c2d91','#c42b1c','#004b8f'];
  var ini = user.initials || 'U';
  var ci  = (ini.charCodeAt(0) + (ini.charCodeAt(1)||0)) % colors.length;

  var html = '<div class="sb-header">'
    + '<div class="sb-logo">TN</div>'
    + '<div><div class="sb-app-name">Compliance System</div><div class="sb-app-sub">BAH Instance</div></div>'
    + '</div>'
    + '<nav class="sb-nav">' + nav + '</nav>'
    + '<div class="sb-user">'
    + '<div class="bah-avatar" style="width:30px;height:30px;background:' + colors[ci] + ';font-size:11px;font-weight:700;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0">' + ini + '</div>'
    + '<div style="flex:1;min-width:0"><div class="sb-user-name">' + user.name + '</div><div class="sb-user-role">' + user.title + '</div></div>'
    + '<button class="btn-logout" onclick="logout()" title="Sign out">⏻</button>'
    + '</div>';

  document.getElementById('sidebar').innerHTML = html;
}

function sbLink(id, icon, label, href, activePage, badge) {
  var active    = id === activePage ? ' active' : '';
  var badgeHtml = badge ? '<span class="sb-badge">' + badge + '</span>' : '';
  return '<a class="sb-link' + active + '" href="' + href + '"><span class="icon">' + icon + '</span>' + label + badgeHtml + '</a>';
}

function topbarDate() {
  return new Date().toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
}
