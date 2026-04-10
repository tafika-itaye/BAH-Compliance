// ===== BAH COMPLIANCE — API DATA LAYER =====
// Replaces localStorage with ASP.NET Core API calls
// Drop-in replacement: same function signatures, async init

var API_BASE = 'http://localhost:5115'; // change to production URL on deployment

// ---- TOKEN MANAGEMENT ----
function getToken()          { return sessionStorage.getItem('bah_token'); }
function setToken(t)         { sessionStorage.setItem('bah_token', t); }
function getUser()           { var u = sessionStorage.getItem('bah_user'); return u ? JSON.parse(u) : null; }
function setUser(u)          { sessionStorage.setItem('bah_user', JSON.stringify(u)); }
function logout()            { sessionStorage.clear(); window.location.href = 'index.html'; }

function requireLogin() {
  var u = getUser();
  if (!u || !getToken()) { window.location.href = 'index.html'; return null; }
  return u;
}

// ---- IN-MEMORY CACHE ----
var _cache = {
  incidents:  [],
  policies:   [],
  sops:       [],
  actions:    [],
  pending:    [],
  kpis:       [],
  stats:      null,
  loaded:     false
};

// ---- API FETCH HELPER ----
function apiFetch(path, options) {
  options = options || {};
  var headers = { 'Content-Type': 'application/json' };
  var token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  options.headers = Object.assign(headers, options.headers || {});
  return fetch(API_BASE + path, options).then(function(res) {
    if (res.status === 401) { logout(); return Promise.reject('Unauthorized'); }
    if (!res.ok) return res.json().then(function(e) { return Promise.reject(e.message || 'Error'); });
    if (res.status === 204) return null;
    return res.json();
  });
}

// ---- AUTH ----
function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email, password: password })
  }).then(function(data) {
    setToken(data.token);
    setUser({
      name:     data.fullName,
      email:    data.email,
      role:     mapRole(data.role),
      dept:     data.department,
      title:    data.role,
      initials: getInitials(data.fullName)
    });
    return data;
  });
}

function mapRole(apiRole) {
  var map = {
    'SuperAdmin':     'admin',
    'QualityManager': 'quality',
    'ITStaff':        'staff',
    'Maintenance':    'staff',
    'Procurement':    'staff',
    'Staff':          'staff'
  };
  return map[apiRole] || 'staff';
}

function getInitials(name) {
  var parts = (name || '').split(' ');
  return ((parts[0]||'')[0] + (parts[1]||'')[0]).toUpperCase();
}

// ---- LOAD ALL DATA ----
function loadAllData() {
  if (!getToken()) return Promise.resolve();
  return Promise.all([
    apiFetch('/api/incidents'),
    apiFetch('/api/policies'),
    apiFetch('/api/corrective-actions'),
    apiFetch('/api/kb'),
    apiFetch('/api/stats/compliance')
  ]).then(function(results) {
    _cache.incidents = results[0] || [];
    _cache.policies  = results[1] || [];
    _cache.actions   = results[2] || [];
    _cache.sops      = results[3] || [];
    _cache.stats     = results[4] || {};
    _cache.kpis      = (_cache.stats && _cache.stats.kpis) ? _cache.stats.kpis : [];

    // pending attestations — policies not yet attested by current user
    _cache.pending = _cache.policies
      .filter(function(p) { return p.status === 'Active' && (!p.attestations || p.attestations.length === 0); })
      .map(function(p) { return p.policyNumber || p.id; });

    _cache.loaded = true;
  }).catch(function(err) {
    console.error('Failed to load data:', err);
  });
}

// ---- SYNCHRONOUS GETTERS (from cache) ----
function getIncidents()  { return _cache.incidents; }
function getPolicies()   { return _cache.policies; }
function getSOPs()       { return _cache.sops; }
function getActions()    { return _cache.actions; }
function getPending()    { return _cache.pending; }
function getKPIs()       { return _cache.kpis; }

function getIncident(id) {
  return _cache.incidents.find(function(i) { return i.id === id || i.incidentNumber === id; }) || null;
}

function getPolicy(id) {
  return _cache.policies.find(function(p) { return p.id === id || p.policyNumber === id; }) || null;
}

// ---- WRITE OPERATIONS (async) ----
function reportIncident(data) {
  return apiFetch('/api/incidents', {
    method: 'POST',
    body: JSON.stringify({
      title:       data.title || data.desc,
      description: data.what || data.description || '',
      type:        data.type === 'Near Miss' ? 'NearMiss' : 'Incident',
      severity:    mapSeverity(data.severity),
      department:  data.dept,
      eventDate:   data.reported || new Date().toISOString(),
      isAnonymous: data.anonymous || data.reporter === 'Anonymous'
    })
  }).then(function(result) {
    return loadAllData().then(function() { return result; });
  });
}

function mapSeverity(s) {
  var map = {
    'Near Miss':    'NearMiss',
    'No Harm':      'NoHarm',
    'Adverse Event':'Minor',
    'Sentinel Event':'SentinelEvent',
    'Major':        'Major',
    'Minor':        'Minor'
  };
  return map[s] || 'NoHarm';
}

function updateIncidentStatus(id, status, note) {
  var inc = getIncident(id);
  if (!inc) return Promise.reject('Incident not found');
  return apiFetch('/api/incidents/' + inc.id + '/status', {
    method: 'PATCH',
    body: JSON.stringify({ status: status, note: note })
  }).then(function() {
    return loadAllData();
  });
}

function addIncidentNote(id, text) {
  var inc = getIncident(id);
  if (!inc) return Promise.reject('Incident not found');
  return apiFetch('/api/incidents/' + inc.id + '/notes', {
    method: 'POST',
    body: JSON.stringify({ text: text })
  }).then(function() {
    return loadAllData();
  });
}

function toggleAttestation(policyId) {
  var pol = getPolicy(policyId);
  if (!pol) return Promise.reject('Policy not found');
  return apiFetch('/api/policies/' + pol.id + '/attest', {
    method: 'POST'
  }).then(function() {
    return loadAllData();
  });
}

// ---- STATS (from cache) ----
function getStats() {
  var p = getPolicies();
  var i = getIncidents();
  var k = getKPIs();
  var a = getActions();

  return {
    totalPolicies:   p.length,
    activePolicies:  p.filter(function(x){ return x.status === 'Active'; }).length,
    draftPolicies:   p.filter(function(x){ return x.status === 'Draft'; }).length,
    reviewPolicies:  p.filter(function(x){ return x.status === 'UnderReview'; }).length,
    avgAttestation:  50, // computed server-side in full impl
    totalIncidents:  i.length,
    openIncidents:   i.filter(function(x){ return x.status === 'Open'; }).length,
    nearMisses:      i.filter(function(x){ return x.type === 'NearMiss'; }).length,
    sentinelEvents:  i.filter(function(x){ return x.severity === 'SentinelEvent'; }).length,
    openActions:     a.filter(function(x){ return x.status === 'Open'; }).length,
    closedActions:   a.filter(function(x){ return x.status === 'Closed'; }).length,
    kpisMet:         k.filter(function(x){ return x.status === 'OnTarget'; }).length,
    kpisTotal:       k.length,
    cohsasaScore:    _cache.stats ? 78 : 0,
  };
}

// ---- HELPERS (unchanged from original) ----
function statusBadge(s) {
  var map = {
    'Published':'win-badge-green', 'Active':'win-badge-green',
    'Pending Approval':'win-badge-yellow', 'UnderReview':'win-badge-yellow', 'Under Review':'win-badge-yellow',
    'Expired':'win-badge-red',
    'Investigating':'win-badge-yellow', 'Action Plan':'win-badge-orange',
    'Closed':'win-badge-gray',
    'In Progress':'win-badge-blue', 'InProgress':'win-badge-blue',
    'Overdue':'win-badge-red',
    'Open':'win-badge-blue',
    'Current':'win-badge-green', 'Review Due':'win-badge-red',
    'Archived':'win-badge-gray', 'Draft':'win-badge-gray',
    'OnTarget':'win-badge-green', 'AtRisk':'win-badge-yellow', 'OffTarget':'win-badge-red'
  };
  return '<span class="win-badge ' + (map[s] || 'win-badge-gray') + '">' + s + '</span>';
}

function severityDot(s) {
  var map = { 'NearMiss':'#f59e0b', 'Near Miss':'#f59e0b', 'NoHarm':'#6b7280', 'No Harm':'#6b7280', 'Minor':'#ef4444', 'Major':'#ef4444', 'Adverse Event':'#ef4444', 'SentinelEvent':'#7c3aed', 'Sentinel Event':'#7c3aed' };
  return '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + (map[s]||'#6b7280') + ';margin-right:5px;vertical-align:middle"></span>';
}

function progressBar(pct, color) {
  color = color || 'var(--accent)';
  return '<div class="prog-bg"><div class="prog-fill" style="width:' + pct + '%;background:' + color + '"></div></div>';
}

function timeAgo(d) {
  if (!d) return '—';
  var diff = Math.floor((new Date() - new Date(d)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return diff + ' days ago';
}

function avatarHtml(initials, size) {
  size = size || 32;
  var colors = ['#0067c0','#107c10','#c75700','#5c2d91','#c42b1c','#004b8f'];
  var ini = initials || 'U';
  var i = (ini.charCodeAt(0) + (ini.charCodeAt(1)||0)) % colors.length;
  return '<div class="bah-avatar" style="width:' + size + 'px;height:' + size + 'px;background:' + colors[i] + ';font-size:' + Math.round(size*0.36) + 'px">' + ini + '</div>';
}

function showToast(msg, type) {
  type = type || 'success';
  var icons = { success:'✔', warning:'⚠', error:'✖' };
  var t = document.createElement('div');
  t.className = 'win-toast win-toast-' + type;
  t.innerHTML = '<span class="toast-icon">' + (icons[type]||'ℹ') + '</span>' + msg;
  document.body.appendChild(t);
  setTimeout(function() { t.classList.add('hide'); setTimeout(function(){ t.remove(); }, 300); }, 3000);
}

// ---- WINDOWS 11 CSS (unchanged) ----
var WIN_CSS = '\
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");\
:root{\
  --win-bg:#f3f3f3;--win-surface:#ffffff;--win-surface2:#f9f9f9;--win-surface3:#efefef;\
  --win-border:#e0e0e0;--win-border2:#d0d0d0;\
  --accent:#0067c0;--accent-light:#dce9f9;--accent-hover:#005ba4;\
  --text:#1a1a1a;--text-muted:#666;--text-dim:#999;\
  --success:#107c10;--warning:#c75700;--danger:#c42b1c;\
  --sidebar-w:220px;--topbar-h:48px;\
}\
*{box-sizing:border-box;margin:0;padding:0;}\
body{font-family:"Inter",system-ui,sans-serif;background:var(--win-bg);color:var(--text);font-size:14px;min-height:100vh;}\
a{color:var(--accent);text-decoration:none;}\
a:hover{text-decoration:underline;}\
.shell{display:flex;min-height:100vh;}\
.sidebar{width:var(--sidebar-w);background:rgba(243,243,243,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-right:1px solid var(--win-border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;}\
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh;}\
.topbar{background:rgba(249,249,249,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--win-border);height:var(--topbar-h);padding:0 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}\
.content{padding:20px;flex:1;}\
.sb-header{padding:12px 14px 10px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--win-border);}\
.sb-logo{width:28px;height:28px;background:var(--accent);border-radius:4px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;flex-shrink:0;}\
.sb-app-name{font-size:12px;font-weight:600;color:var(--text);line-height:1.2;}\
.sb-app-sub{font-size:10px;color:var(--text-muted);}\
.sb-nav{padding:6px;flex:1;overflow-y:auto;}\
.sb-section{font-size:10px;font-weight:600;color:var(--text-dim);letter-spacing:.6px;text-transform:uppercase;padding:10px 8px 4px;}\
.sb-link{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:6px;color:var(--text-muted);font-size:13px;cursor:pointer;transition:all .12s;margin-bottom:1px;text-decoration:none;white-space:nowrap;}\
.sb-link:hover{background:rgba(0,0,0,0.05);color:var(--text);text-decoration:none;}\
.sb-link.active{background:var(--accent-light);color:var(--accent);font-weight:600;}\
.sb-link .icon{font-size:14px;width:18px;text-align:center;flex-shrink:0;}\
.sb-link .sb-badge{margin-left:auto;background:var(--danger);color:#fff;font-size:10px;font-weight:700;padding:1px 5px;border-radius:10px;min-width:18px;text-align:center;}\
.sb-link.active .sb-badge{background:var(--accent);}\
.sb-user{padding:10px 12px;border-top:1px solid var(--win-border);display:flex;align-items:center;gap:8px;}\
.sb-user-name{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\
.sb-user-role{font-size:10px;color:var(--text-muted);}\
.btn-logout{margin-left:auto;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:15px;padding:2px;}\
.btn-logout:hover{color:var(--danger);}\
.page-title{font-size:14px;font-weight:600;color:var(--text);}\
.breadcrumb{font-size:11px;color:var(--text-muted);display:flex;align-items:center;gap:4px;margin-bottom:1px;}\
.breadcrumb a{color:var(--text-muted);text-decoration:none;}\
.breadcrumb a:hover{color:var(--accent);}\
.topbar-right{display:flex;align-items:center;gap:8px;}\
.topbar-date{font-size:12px;color:var(--text-muted);}\
.btn{display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:4px;font-family:"Inter",sans-serif;font-size:13px;font-weight:500;cursor:pointer;border:1px solid transparent;transition:all .12s;white-space:nowrap;text-decoration:none;}\
.btn-primary{background:var(--accent);color:#fff;border-color:var(--accent);}\
.btn-primary:hover{background:var(--accent-hover);text-decoration:none;color:#fff;}\
.btn-secondary{background:var(--win-surface);color:var(--text);border-color:var(--win-border2);}\
.btn-secondary:hover{background:var(--win-surface3);text-decoration:none;}\
.btn-danger{background:#fff;color:var(--danger);border-color:#f0c0bb;}\
.btn-danger:hover{background:#fff0ee;}\
.btn-sm{padding:4px 10px;font-size:12px;}\
.card{background:var(--win-surface);border:1px solid var(--win-border);border-radius:8px;padding:16px;}\
.card-title{font-size:13px;font-weight:600;margin-bottom:12px;color:var(--text);}\
.win-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;}\
.win-badge-green{background:#dff6dd;color:#107c10;border:1px solid #c3e6c3;}\
.win-badge-yellow{background:#fff4ce;color:#9a6100;border:1px solid #f7dba0;}\
.win-badge-red{background:#fde7e9;color:#c42b1c;border:1px solid #f4aaaa;}\
.win-badge-blue{background:#dce9f9;color:#0067c0;border:1px solid #a8caec;}\
.win-badge-orange{background:#fff0e0;color:#c75700;border:1px solid #f5c890;}\
.win-badge-gray{background:#f0f0f0;color:#555;border:1px solid #ddd;}\
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:18px;}\
.stat-card{background:var(--win-surface);border:1px solid var(--win-border);border-radius:8px;padding:14px 16px;}\
.stat-label{font-size:11px;color:var(--text-muted);margin-bottom:4px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;}\
.stat-value{font-size:24px;font-weight:300;color:var(--text);line-height:1.1;}\
.stat-sub{font-size:11px;color:var(--text-muted);margin-top:4px;}\
.stat-ok{color:var(--success);}.stat-warn{color:var(--warning);}.stat-bad{color:var(--danger);}\
.win-table-wrap{background:var(--win-surface);border:1px solid var(--win-border);border-radius:8px;overflow:hidden;}\
.win-table{width:100%;border-collapse:collapse;}\
.win-table th{text-align:left;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px;padding:8px 14px;border-bottom:1px solid var(--win-border);background:var(--win-surface2);white-space:nowrap;}\
.win-table td{padding:10px 14px;border-bottom:1px solid var(--win-border);font-size:13px;vertical-align:middle;}\
.win-table tr:last-child td{border-bottom:none;}\
.win-table tr:hover td{background:#f5f5f5;}\
.win-table td a{color:var(--accent);cursor:pointer;}\
.form-group{margin-bottom:14px;}\
.form-label{display:block;font-size:12px;font-weight:600;color:var(--text);margin-bottom:5px;}\
.form-control{width:100%;background:var(--win-surface);border:1px solid var(--win-border2);border-radius:4px;padding:7px 10px;color:var(--text);font-family:"Inter",sans-serif;font-size:13px;outline:none;transition:border-color .15s,box-shadow .15s;}\
.form-control:focus{border-color:var(--accent);box-shadow:0 0 0 2px rgba(0,103,192,.15);}\
select.form-control option{background:#fff;}\
textarea.form-control{resize:vertical;min-height:80px;line-height:1.6;}\
.win-search{display:flex;align-items:center;gap:7px;background:var(--win-surface);border:1px solid var(--win-border2);border-radius:4px;padding:6px 10px;}\
.win-search input{background:none;border:none;outline:none;font-family:"Inter",sans-serif;font-size:13px;color:var(--text);width:200px;}\
.win-search:focus-within{border-color:var(--accent);box-shadow:0 0 0 2px rgba(0,103,192,.15);}\
.filter-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center;}\
.filter-select{background:var(--win-surface);border:1px solid var(--win-border2);border-radius:4px;padding:6px 10px;color:var(--text);font-family:"Inter",sans-serif;font-size:13px;outline:none;cursor:pointer;}\
.filter-select:focus{border-color:var(--accent);}\
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}\
.win-modal{background:var(--win-surface);border:1px solid var(--win-border);border-radius:8px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.18);}\
.win-modal-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px 12px;border-bottom:1px solid var(--win-border);}\
.win-modal-title{font-size:14px;font-weight:600;}\
.win-modal-close{background:none;border:none;color:var(--text-muted);font-size:18px;cursor:pointer;padding:2px 6px;border-radius:3px;}\
.win-modal-close:hover{background:var(--win-surface3);}\
.win-modal-body{padding:16px 18px;}\
.win-modal-footer{padding:10px 18px 16px;display:flex;gap:8px;justify-content:flex-end;border-top:1px solid var(--win-border);}\
.prog-bg{background:var(--win-surface3);border-radius:3px;height:6px;overflow:hidden;}\
.prog-fill{height:100%;border-radius:3px;background:var(--accent);transition:width .5s ease;}\
.bah-avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;flex-shrink:0;font-family:"Inter",sans-serif;}\
.win-toast{position:fixed;bottom:20px;right:20px;z-index:999;background:var(--win-surface);border:1px solid var(--win-border2);border-radius:6px;padding:12px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 16px rgba(0,0,0,.14);font-size:13px;animation:toastIn .2s ease;}\
.win-toast.hide{animation:toastOut .2s ease forwards;}\
.win-toast-success .toast-icon{color:var(--success);font-size:16px;}\
.win-toast-warning .toast-icon{color:var(--warning);font-size:16px;}\
.win-toast-error .toast-icon{color:var(--danger);font-size:16px;}\
@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}\
@keyframes toastOut{to{opacity:0;transform:translateY(12px)}}\
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;}\
.three-col{display:grid;grid-template-columns:2fr 1fr;gap:14px;}\
@media(max-width:750px){.two-col,.three-col{grid-template-columns:1fr;}}\
.empty-state{text-align:center;padding:40px 20px;color:var(--text-muted);}\
.empty-icon{font-size:36px;margin-bottom:10px;}\
.tag{display:inline-block;background:var(--win-surface3);border:1px solid var(--win-border);border-radius:3px;padding:1px 6px;font-size:11px;color:var(--text-muted);margin:2px;}\
';

// ---- PAGE INIT HELPER ----
// Call this at the top of every page script instead of initData()
// Usage: initPage('dashboard').then(function(user) { renderPage(user); });
function initPage(pageName) {
  var user = requireLogin();
  if (!user) return Promise.reject('Not logged in');
  return loadAllData().then(function() {
    return user;
  });
}

// ---- DEMO USERS (for index.html login hints) ----
var DEMO_USERS = {
  'admin@bah.mw':   { hint: 'Admin@2026' },
  'quality@bah.mw': { hint: 'Quality@2026' },
  'staff@bah.mw':   { hint: 'Staff@2026' }
};
