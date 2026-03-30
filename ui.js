// Renders the sidebar based on current user role
function renderSidebar(activePage){
  const user = getUser();
  if(!user) return;
  const isQuality = user.role==='quality'||user.role==='admin';
  const isCEO     = user.role==='ceo'||user.role==='quality'||user.role==='admin';

  const pending = getPending().length;
  const openInc = getIncidents().filter(i=>i.status==='Investigating'||i.status==='Action Plan').length;
  const overdueAct = getActions().filter(a=>a.status==='Overdue').length;

  const nav = [
    { section:'Overview' },
    { id:'dashboard', icon:'⊞',  label:'Dashboard',         href:'dashboard.html',    show:true },
    { section:'Policies & SOPs' },
    { id:'policies',  icon:'📋', label:'Policy Management', href:'policies.html',      show:isQuality },
    { id:'sops',      icon:'📘', label:'SOP Library',       href:'sops.html',          show:true },
    { id:'attestations',icon:'✍',label:'My Attestations',  href:'attestations.html',  show:true,  badge:pending||null },
    { section:'Incidents' },
    { id:'report',    icon:'⚠',  label:'Report Incident',   href:'report-incident.html',show:true },
    { id:'incidents', icon:'☰',  label:'All Incidents',     href:'incidents.html',     show:isQuality, badge:openInc||null },
    { id:'actions',   icon:'🔧', label:'Corrective Actions',href:'corrective-actions.html',show:isQuality, badge:overdueAct||null },
    { section:'Performance', show:isCEO },
    { id:'kpi',       icon:'📊', label:'KPI Dashboard',     href:'kpi.html',           show:isCEO },
    { id:'export',    icon:'📤', label:'COHSASA Export',    href:'cohsasa-export.html', show:isCEO },
    { section:'System' },
    { id:'settings',  icon:'⚙',  label:'Settings',          href:'settings.html',      show:user.role==='admin' },
  ];

  let html = `
    <div class="sb-header">
      <div class="sb-logo">TN</div>
      <div><div class="sb-app-name">Compliance System</div><div class="sb-app-sub">BAH Instance</div></div>
    </div>
    <nav class="sb-nav">`;

  nav.forEach(item=>{
    if(item.section){ if(item.show===false) return; html+=`<div class="sb-section">${item.section}</div>`; return; }
    if(item.show===false) return;
    const active = item.id===activePage ? 'active' : '';
    const badge  = item.badge ? `<span class="sb-badge">${item.badge}</span>` : '';
    html+=`<a class="sb-link ${active}" href="${item.href}"><span class="icon">${item.icon}</span>${item.label}${badge}</a>`;
  });

  html += `</nav>
    <div class="sb-user">
      <div class="sb-avatar" style="background:${avatarColor(user.initials)}">${user.initials}</div>
      <div style="flex:1;min-width:0">
        <div class="sb-user-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${user.name}</div>
        <div class="sb-user-role">${user.title}</div>
      </div>
      <button class="btn-logout" onclick="logout()" title="Sign out">⏻</button>
    </div>`;

  document.getElementById('sidebar').innerHTML = html;
}

function avatarColor(initials){
  const colors=['#0067c0','#107c10','#c75700','#5c2d91','#c42b1c','#004b8f'];
  const i = ((initials||'AA').charCodeAt(0)+(initials||'AA').charCodeAt(1)||0)%colors.length;
  return colors[i];
}

function topbarDate(){
  return new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
}
