// ===== BAH COMPLIANCE — SHARED DATA =====

const USER_KEY = 'bah_user';
const TICKETS_KEY = 'bah_incidents';
const POLICIES_KEY = 'bah_policies';
const SOPS_KEY = 'bah_sops';
const ACTIONS_KEY = 'bah_actions';
const ATTEST_KEY = 'bah_attestations';

const DEMO_USERS = {
  'quality@bah.mw':   { name:'Quality Officer', initials:'QO', role:'quality',  dept:'Quality & Safety', title:'COHSASA Lead',       password:'password' },
  'nurse@bah.mw':     { name:'Nurse Moyo',       initials:'NM', role:'staff',    dept:'Ward 3 — Nursing', title:'Registered Nurse',   password:'password' },
  'ceo@bah.mw':       { name:'K. Kasinja',        initials:'KK', role:'ceo',     dept:'Executive',        title:'Chief Executive Officer', password:'password' },
  'doctor@bah.mw':    { name:'Dr. C. Mwanza',     initials:'DR', role:'staff',   dept:'OPD',              title:'General Practitioner', password:'password' },
  'admin@bah.mw':     { name:'Administrator',     initials:'AD', role:'admin',   dept:'System',           title:'System Admin',        password:'password' },
};

const DEFAULT_INCIDENTS = [
  { id:'INC-0041', desc:'Medication — wrong dosage administered (caught by nurse)', type:'Near Miss',  severity:'Near Miss',    dept:'OPD',       reported:'2026-03-17', reporter:'Anonymous', investigator:'Quality Officer', status:'Investigating', what:'During medication preparation for Ward 3, a dosage of 500mg was drawn up instead of the prescribed 250mg. The error was identified by the supervising nurse before administration. Patient was not affected.', factors:'Similar vial labelling between 250mg and 500mg concentration. High workload at time of incident.', action:'Correct dose administered. Incident reported to ward supervisor. Vials segregated and flagged for pharmacy review.', step:3 },
  { id:'INC-0040', desc:'Slip and fall — patient in corridor, no injury',            type:'Incident',   severity:'No Harm',      dept:'Ward 2',    reported:'2026-03-16', reporter:'Staff',     investigator:'Quality Officer', status:'Action Plan',   what:'Patient slipped in the main corridor near Ward 2. No injury was sustained. Wet floor from recent mopping was not signed.', factors:'Absent wet floor signage. High foot traffic area.', action:'Immediate wet floor sign placed. Patient assessed and cleared.', step:4 },
  { id:'INC-0039', desc:'Equipment — infusion pump alarm not heard by staff',        type:'Near Miss',  severity:'Near Miss',    dept:'Ward 3',    reported:'2026-03-15', reporter:'Anonymous', investigator:'Quality Officer', status:'Closed',        what:'Infusion pump alarm triggered but was not heard by nursing staff for approximately 8 minutes due to ambient noise levels.', factors:'High ambient noise. Alarm volume settings at minimum.', action:'Alarm volume increased. Noise audit conducted.', step:5 },
  { id:'INC-0038', desc:'Specimen mislabelling — caught at lab before processing',   type:'Near Miss',  severity:'No Harm',      dept:'Laboratory',reported:'2026-03-14', reporter:'Staff',     investigator:'Lab Manager',     status:'Closed',        what:'Two blood specimens were swapped during labelling. Identified during pre-analytical checks at the lab before processing.', factors:'Busy ward round. Distraction during labelling process.', action:'Re-labelling protocol reinforced. Double-check procedure implemented.', step:5 },
  { id:'INC-0037', desc:'Patient fall in bathroom — minor bruise',                   type:'Incident',   severity:'Adverse Event', dept:'Ward 1',   reported:'2026-03-12', reporter:'Staff',     investigator:'Quality Officer', status:'Closed',        what:'Elderly patient fell in bathroom. Sustained minor bruise to left forearm. Incident reported immediately.', factors:'Absence of grab bars near toilet. Patient not assessed for fall risk on admission.', action:'Patient treated. Fall risk reassessment done. Maintenance requested for grab bars.', step:5 },
  { id:'INC-0036', desc:'Unlocked medication cabinet found during rounds',            type:'Near Miss',  severity:'No Harm',      dept:'Pharmacy',  reported:'2026-03-10', reporter:'Staff',     investigator:'Pharmacy Lead',   status:'Closed',        what:'During routine rounds medication cabinet found unlocked and unattended for an estimated 15 minutes.', factors:'Staff distracted by urgent patient call. Habit of not re-locking immediately.', action:'Cabinet locked and audited. Reminder issued to pharmacy team.', step:5 },
  { id:'INC-0035', desc:'Equipment — defibrillator battery low, found during check', type:'Incident',   severity:'No Harm',      dept:'Emergency', reported:'2026-03-10', reporter:'Staff',     investigator:'Biomedical',      status:'Closed',        what:'Defibrillator unit found with low battery during weekly equipment check. Unit was not used on any patient.', factors:'Battery replacement schedule not being followed consistently.', action:'Battery replaced. Schedule updated. Biomedical team alerted.', step:5 },
  { id:'INC-0034', desc:'Documentation — incomplete surgical checklist submitted',   type:'Near Miss',  severity:'No Harm',      dept:'Theatre',   reported:'2026-03-07', reporter:'Staff',     investigator:'Theatre Lead',    status:'Action Plan',   what:'Post-operative surgical checklist submitted with 3 of 20 items unchecked. No adverse outcomes occurred.', factors:'Rush to complete before next case. Checklist design not intuitive.', action:'Team briefed. Checklist revised and re-printed. Training scheduled.', step:4 },
];

const DEFAULT_POLICIES = [
  { id:'POL-001', title:'Infection Control Policy',           category:'Clinical',    version:'v4.2', updated:'2026-03-14', attested:34,  total:112, reviewDue:'Sep 2026', status:'Pending Approval', cohsasa:'IPC-001', owner:'Quality Officer', cycle:'Annual',   content:'1. Purpose\n\nThis policy establishes the standards and procedures for infection prevention and control at Blantyre Adventist Hospital, in alignment with COHSASA standards and WHO guidelines.\n\n2. Scope\n\nApplies to all clinical staff, support staff, and visitors. All clinical departments are required to comply with the hand hygiene, PPE, and waste management sections.\n\n3. Key Requirements\n\n3.1 Hand hygiene must be performed at the WHO 5 moments.\n\n3.2 PPE must be worn in all patient contact areas.\n\n3.3 Sharps disposal must follow the colour-coded bin protocol.\n\n3.4 Monthly infection surveillance reports must be submitted to the Quality Officer.', byDept:{Nursing:'18/52',OPD:'12/18',Laboratory:'2/14',Emergency:'2/28'} },
  { id:'POL-002', title:'Patient Privacy Policy',             category:'Governance',  version:'v3.0', updated:'2026-03-03', attested:178, total:180, reviewDue:'Mar 2027', status:'Published',        cohsasa:'GOV-003', owner:'Quality Officer', cycle:'Annual',   content:'1. Purpose\n\nTo protect the privacy and confidentiality of all patient information in accordance with Malawi data protection laws and COHSASA governance standards.\n\n2. Scope\n\nAll staff who access patient records, including clinical, administrative, and support staff.\n\n3. Key Requirements\n\n3.1 Patient information must not be shared without written consent.\n\n3.2 Electronic records must be accessed only by authorised personnel.\n\n3.3 Any breach of patient privacy must be reported immediately to the Quality Officer.', byDept:{Nursing:'52/52',OPD:'18/18',Administration:'80/82',Laboratory:'14/14'} },
  { id:'POL-003', title:'Medication Administration Policy',   category:'Clinical',    version:'v2.1', updated:'2026-03-10', attested:18,  total:42,  reviewDue:'Mar 2027', status:'Published',        cohsasa:'MED-002', owner:'Pharmacy Lead',  cycle:'Annual',   content:'1. Purpose\n\nTo ensure safe and accurate medication administration to all patients.\n\n2. Scope\n\nAll nursing and pharmacy staff involved in prescribing, dispensing, or administering medications.\n\n3. The Five Rights\n\n3.1 Right patient — verify using two identifiers.\n\n3.2 Right drug — check against prescription.\n\n3.3 Right dose — calculate and verify.\n\n3.4 Right route — confirm administration method.\n\n3.5 Right time — administer as scheduled.', byDept:{Nursing:'14/30',Pharmacy:'4/12'} },
  { id:'POL-004', title:'Fire Safety & Evacuation Policy',    category:'Safety',      version:'v5.0', updated:'2026-01-15', attested:180, total:180, reviewDue:'Jan 2027', status:'Published',        cohsasa:'SAF-001', owner:'Safety Officer', cycle:'Annual',   content:'1. Purpose\n\nTo ensure all staff are prepared to respond to fire emergencies and safely evacuate patients and visitors.\n\n2. Evacuation Routes\n\nEvacuation maps are posted at all exits. Primary and secondary routes are clearly marked.\n\n3. Staff Responsibilities\n\n3.1 All staff must know the location of fire extinguishers.\n\n3.2 Fire drills are conducted quarterly.\n\n3.3 No fire doors to be propped open at any time.', byDept:{Nursing:'52/52',OPD:'18/18',Administration:'82/82',Laboratory:'14/14',Emergency:'14/14'} },
  { id:'POL-005', title:'Waste Management Policy',            category:'Safety',      version:'v2.3', updated:'2024-12-01', attested:0,   total:180, reviewDue:'Jan 2026', status:'Expired',          cohsasa:'SAF-003', owner:'Safety Officer', cycle:'Annual',   content:'This policy has expired and is due for renewal. Contact the Quality Officer to initiate the review process.', byDept:{} },
  { id:'POL-006', title:'Hand Hygiene Policy',                category:'Clinical',    version:'v3.1', updated:'2026-02-20', attested:155, total:180, reviewDue:'Feb 2027', status:'Published',        cohsasa:'IPC-002', owner:'Quality Officer', cycle:'Annual',   content:'1. Purpose\n\nTo prevent healthcare-associated infections through rigorous hand hygiene practice in line with WHO guidelines.\n\n2. The Five Moments\n\n2.1 Before patient contact\n\n2.2 Before aseptic procedure\n\n2.3 After body fluid exposure risk\n\n2.4 After patient contact\n\n2.5 After contact with patient surroundings', byDept:{Nursing:'52/52',OPD:'16/18',Emergency:'14/14',Laboratory:'14/14'} },
];

const DEFAULT_SOPS = [
  { id:'SOP-001', title:'IV Line Insertion Procedure',        dept:'Inpatient · Nursing', icon:'💉', version:'v3.1', updated:'2026-03-03', status:'Current',     category:'Inpatient' },
  { id:'SOP-002', title:'Medication Dispensing Protocol',     dept:'Pharmacy',             icon:'💊', version:'v4.0', updated:'2026-02-15', status:'Current',     category:'Pharmacy' },
  { id:'SOP-003', title:'Specimen Collection & Labelling',    dept:'Laboratory',           icon:'🔬', version:'v2.2', updated:'2026-03-01', status:'Review Due',  category:'Laboratory' },
  { id:'SOP-004', title:'Cardiac Arrest Response',            dept:'Emergency · All clinical', icon:'🚨', version:'v5.2', updated:'2026-02-24', status:'Current', category:'Emergency' },
  { id:'SOP-005', title:'Hand Hygiene Protocol',              dept:'All Departments',      icon:'🧴', version:'v2.0', updated:'2026-02-15', status:'Current',     category:'All' },
  { id:'SOP-006', title:'Dental Sterilisation Procedure',     dept:'Dental',               icon:'🦷', version:'v1.3', updated:'2026-02-02', status:'Current',     category:'Dental' },
  { id:'SOP-007', title:'Surgical Safety Checklist',          dept:'Theatre',              icon:'🏥', version:'v3.0', updated:'2026-01-20', status:'Current',     category:'Theatre' },
  { id:'SOP-008', title:'Patient Identification Protocol',    dept:'All Departments',      icon:'🪪', version:'v2.1', updated:'2026-03-10', status:'Current',     category:'All' },
];

const DEFAULT_ACTIONS = [
  { id:'CA-012', action:'Review medication vial labelling protocol with pharmacy', source:'INC-0041', assigned:'Pharmacy Lead',  due:'2026-03-19', progress:60, status:'In Progress' },
  { id:'CA-011', action:'Install additional handrails — Ward 2 corridor',          source:'INC-0040', assigned:'Maintenance',    due:'2026-03-15', progress:20, status:'Overdue' },
  { id:'CA-010', action:'Alarm volume audit — all infusion pumps in hospital',     source:'INC-0039', assigned:'Biomedical',     due:'2026-03-22', progress:45, status:'In Progress' },
  { id:'CA-009', action:'Update specimen labelling SOP with double-check step',    source:'INC-0038', assigned:'Lab Manager',    due:'2026-03-10', progress:10, status:'Overdue' },
  { id:'CA-008', action:'Bathroom non-slip mat installation — Ward 1 bathrooms',   source:'INC-0037', assigned:'Maintenance',    due:'2026-03-12', progress:0,  status:'Overdue' },
  { id:'CA-007', action:'Defibrillator battery replacement schedule update',       source:'INC-0035', assigned:'Biomedical',     due:'2026-03-08', progress:100,status:'Closed' },
  { id:'CA-006', action:'Surgical checklist compliance training for theatre staff',source:'INC-0034', assigned:'Theatre Lead',   due:'2026-03-05', progress:100,status:'Closed' },
  { id:'CA-005', action:'Fall risk assessment tool added to admission form',       source:'INC-0037', assigned:'Quality Officer',due:'2026-03-20', progress:80, status:'In Progress' },
];

const DEFAULT_PENDING = ['POL-001','POL-003','SOP-003'];

// ---- init ----
function initData(){
  if(!localStorage.getItem(TICKETS_KEY))   localStorage.setItem(TICKETS_KEY,  JSON.stringify(DEFAULT_INCIDENTS));
  if(!localStorage.getItem(POLICIES_KEY))  localStorage.setItem(POLICIES_KEY, JSON.stringify(DEFAULT_POLICIES));
  if(!localStorage.getItem(SOPS_KEY))      localStorage.setItem(SOPS_KEY,     JSON.stringify(DEFAULT_SOPS));
  if(!localStorage.getItem(ACTIONS_KEY))   localStorage.setItem(ACTIONS_KEY,  JSON.stringify(DEFAULT_ACTIONS));
  if(!localStorage.getItem(ATTEST_KEY))    localStorage.setItem(ATTEST_KEY,   JSON.stringify(DEFAULT_PENDING));
}
function getIncidents(){ return JSON.parse(localStorage.getItem(TICKETS_KEY)||'[]'); }
function saveIncidents(d){ localStorage.setItem(TICKETS_KEY, JSON.stringify(d)); }
function getPolicies(){  return JSON.parse(localStorage.getItem(POLICIES_KEY)||'[]'); }
function savePolicies(d){ localStorage.setItem(POLICIES_KEY, JSON.stringify(d)); }
function getSOPs(){      return JSON.parse(localStorage.getItem(SOPS_KEY)||'[]'); }
function getActions(){   return JSON.parse(localStorage.getItem(ACTIONS_KEY)||'[]'); }
function saveActions(d){ localStorage.setItem(ACTIONS_KEY, JSON.stringify(d)); }
function getPending(){   return JSON.parse(localStorage.getItem(ATTEST_KEY)||'[]'); }
function savePending(d){ localStorage.setItem(ATTEST_KEY, JSON.stringify(d)); }
function getUser(){      return JSON.parse(localStorage.getItem(USER_KEY)||'null'); }
function logout(){       localStorage.removeItem(USER_KEY); window.location.href='index.html'; }

function requireLogin(){
  const u=getUser();
  if(!u){ window.location.href='index.html'; return null; }
  return u;
}

function statusBadge(s){
  const map={
    'Published':'win-badge-green','Pending Approval':'win-badge-yellow','Under Review':'win-badge-blue',
    'Expired':'win-badge-red','Investigating':'win-badge-yellow','Action Plan':'win-badge-orange',
    'Closed':'win-badge-gray','In Progress':'win-badge-blue','Overdue':'win-badge-red','Open':'win-badge-blue',
    'Current':'win-badge-green','Review Due':'win-badge-red',
  };
  return `<span class="win-badge ${map[s]||'win-badge-gray'}">${s}</span>`;
}

function severityDot(s){
  const map={'Near Miss':'#f59e0b','No Harm':'#6b7280','Adverse Event':'#ef4444','Sentinel Event':'#7c3aed'};
  return `<span class="sev-dot" style="background:${map[s]||'#6b7280'}"></span>`;
}

function progressBar(pct, color='var(--accent)'){
  return `<div class="prog-bg"><div class="prog-fill" style="width:${pct}%;background:${color}"></div></div>`;
}

function timeAgo(d){
  if(!d) return '—';
  const diff=Math.floor((new Date()-new Date(d))/86400000);
  if(diff===0) return 'Today'; if(diff===1) return 'Yesterday';
  return diff+' days ago';
}

function showToast(msg, type='success'){
  const icons={success:'✔',warning:'⚠',error:'✖'};
  const t=document.createElement('div');
  t.className=`win-toast win-toast-${type}`;
  t.innerHTML=`<span class="toast-icon">${icons[type]||'ℹ'}</span>${msg}`;
  document.body.appendChild(t);
  setTimeout(()=>{ t.classList.add('hide'); setTimeout(()=>t.remove(),300); },3000);
}

// ---- WINDOWS 11 SHARED CSS ----
const WIN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

:root {
  /* Windows 11 palette */
  --win-bg:       #f3f3f3;
  --win-surface:  #ffffff;
  --win-surface2: #f9f9f9;
  --win-surface3: #efefef;
  --win-border:   #e0e0e0;
  --win-border2:  #d0d0d0;
  --accent:       #0067c0;
  --accent-light: #cce4f6;
  --accent-hover: #005ba4;
  --text:         #1a1a1a;
  --text-muted:   #666666;
  --text-dim:     #999999;
  --success:      #107c10;
  --warning:      #c75700;
  --danger:       #c42b1c;
  --info:         #0067c0;
  --sidebar-w:    220px;
  --topbar-h:     48px;
}

* { box-sizing:border-box; margin:0; padding:0; }

body {
  font-family:'Segoe UI', 'Inter', system-ui, sans-serif;
  background:var(--win-bg);
  color:var(--text);
  font-size:14px;
  min-height:100vh;
}

/* ── LAYOUT ── */
.shell { display:flex; min-height:100vh; }

.sidebar {
  width:var(--sidebar-w);
  background:rgba(243,243,243,0.85);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border-right:1px solid var(--win-border);
  display:flex; flex-direction:column;
  position:fixed; top:0; left:0; height:100vh; z-index:100;
}

.main { margin-left:var(--sidebar-w); flex:1; display:flex; flex-direction:column; min-height:100vh; }

.topbar {
  background:rgba(249,249,249,0.9);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid var(--win-border);
  height:var(--topbar-h); padding:0 20px;
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0; z-index:50;
}

.content { padding:20px; flex:1; }

/* ── SIDEBAR ── */
.sb-header {
  padding:12px 14px 8px;
  display:flex; align-items:center; gap:10px;
  border-bottom:1px solid var(--win-border);
}
.sb-logo {
  width:28px; height:28px;
  background:var(--accent);
  border-radius:4px;
  display:flex; align-items:center; justify-content:center;
  color:#fff; font-size:13px; font-weight:700; flex-shrink:0;
}
.sb-app-name { font-size:12px; font-weight:600; color:var(--text); line-height:1.2; }
.sb-app-sub  { font-size:10px; color:var(--text-muted); }

.sb-nav { padding:6px 6px; flex:1; overflow-y:auto; }
.sb-section {
  font-size:10px; font-weight:600; color:var(--text-dim);
  letter-spacing:.6px; text-transform:uppercase;
  padding:10px 8px 4px;
}
.sb-link {
  display:flex; align-items:center; gap:8px;
  padding:7px 8px; border-radius:6px;
  color:var(--text-muted); font-size:13px;
  cursor:pointer; transition:all .12s;
  margin-bottom:1px; text-decoration:none;
  white-space:nowrap;
}
.sb-link:hover { background:rgba(0,0,0,0.05); color:var(--text); }
.sb-link.active { background:var(--accent-light); color:var(--accent); font-weight:600; }
.sb-link .icon { font-size:14px; width:18px; text-align:center; flex-shrink:0; }
.sb-link .sb-badge { margin-left:auto; background:var(--danger); color:#fff; font-size:10px; font-weight:700; padding:1px 5px; border-radius:10px; }
.sb-link.active .sb-badge { background:var(--accent); }

.sb-user {
  padding:10px 12px; border-top:1px solid var(--win-border);
  display:flex; align-items:center; gap:8px;
}
.sb-avatar {
  width:30px; height:30px; border-radius:50%;
  background:var(--accent); color:#fff;
  display:flex; align-items:center; justify-content:center;
  font-size:11px; font-weight:700; flex-shrink:0;
}
.sb-user-name { font-size:12px; font-weight:600; line-height:1.2; }
.sb-user-role { font-size:10px; color:var(--text-muted); }
.btn-logout {
  margin-left:auto; background:none; border:none;
  color:var(--text-muted); cursor:pointer; font-size:16px; padding:2px; line-height:1;
}
.btn-logout:hover { color:var(--danger); }

/* ── TOPBAR ── */
.page-title { font-size:14px; font-weight:600; color:var(--text); }
.breadcrumb { font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:4px; }
.breadcrumb a { color:var(--text-muted); text-decoration:none; }
.breadcrumb a:hover { color:var(--accent); }
.breadcrumb span { color:var(--text-dim); }
.topbar-right { display:flex; align-items:center; gap:8px; }
.topbar-date { font-size:12px; color:var(--text-muted); }

/* ── WINDOWS BUTTONS ── */
.btn {
  display:inline-flex; align-items:center; gap:5px;
  padding:6px 14px; border-radius:4px;
  font-family:'Segoe UI','Inter',sans-serif;
  font-size:13px; font-weight:400; cursor:pointer;
  border:1px solid transparent; transition:all .12s;
  white-space:nowrap;
}
.btn-primary {
  background:var(--accent); color:#fff;
  border-color:var(--accent);
}
.btn-primary:hover { background:var(--accent-hover); }
.btn-secondary {
  background:var(--win-surface); color:var(--text);
  border-color:var(--win-border2);
}
.btn-secondary:hover { background:var(--win-surface3); }
.btn-danger {
  background:#fff; color:var(--danger);
  border-color:#f0c0bb;
}
.btn-danger:hover { background:#fff0ee; }
.btn-sm { padding:4px 10px; font-size:12px; }
.btn-icon { padding:6px; border-radius:4px; background:none; border:1px solid transparent; cursor:pointer; color:var(--text-muted); font-size:14px; transition:all .12s; }
.btn-icon:hover { background:var(--win-surface3); border-color:var(--win-border); }

/* ── WINDOWS CARDS ── */
.card {
  background:var(--win-surface);
  border:1px solid var(--win-border);
  border-radius:8px;
  padding:16px;
}
.card-title { font-size:13px; font-weight:600; margin-bottom:12px; color:var(--text); }
.card-sm { padding:12px; }

/* ── WINDOWS BADGES ── */
.win-badge {
  display:inline-block; padding:2px 8px; border-radius:4px;
  font-size:11px; font-weight:600; letter-spacing:.1px;
}
.win-badge-green  { background:#dff6dd; color:#107c10; border:1px solid #c3e6c3; }
.win-badge-yellow { background:#fff4ce; color:#9a6100; border:1px solid #f7dba0; }
.win-badge-red    { background:#fde7e9; color:#c42b1c; border:1px solid #f4aaaa; }
.win-badge-blue   { background:#dce9f9; color:#0067c0; border:1px solid #a8caec; }
.win-badge-orange { background:#fff0e0; color:#c75700; border:1px solid #f5c890; }
.win-badge-gray   { background:#f0f0f0; color:#555;    border:1px solid #ddd; }
.win-badge-purple { background:#f0eaff; color:#5c2d91; border:1px solid #c8b0e8; }

/* ── STATS ── */
.stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin-bottom:18px; }
.stat-card {
  background:var(--win-surface); border:1px solid var(--win-border);
  border-radius:8px; padding:14px 16px;
}
.stat-label { font-size:11px; color:var(--text-muted); margin-bottom:4px; font-weight:600; text-transform:uppercase; letter-spacing:.3px; }
.stat-value { font-size:24px; font-weight:300; color:var(--text); line-height:1.1; }
.stat-sub   { font-size:11px; color:var(--text-muted); margin-top:4px; }
.stat-ok    { color:var(--success); } .stat-warn { color:var(--warning); } .stat-bad { color:var(--danger); }

/* ── TABLE ── */
.win-table-wrap { background:var(--win-surface); border:1px solid var(--win-border); border-radius:8px; overflow:hidden; }
.win-table { width:100%; border-collapse:collapse; }
.win-table th {
  text-align:left; font-size:11px; font-weight:600; color:var(--text-muted);
  text-transform:uppercase; letter-spacing:.4px;
  padding:8px 14px; border-bottom:1px solid var(--win-border);
  background:var(--win-surface2); white-space:nowrap;
}
.win-table td { padding:10px 14px; border-bottom:1px solid var(--win-border); font-size:13px; vertical-align:middle; }
.win-table tr:last-child td { border-bottom:none; }
.win-table tr:hover td { background:#f5f5f5; }
.win-table td a { color:var(--accent); cursor:pointer; text-decoration:none; }
.win-table td a:hover { text-decoration:underline; }

/* ── FORMS ── */
.form-group { margin-bottom:14px; }
.form-label { display:block; font-size:12px; font-weight:600; color:var(--text); margin-bottom:5px; }
.form-control {
  width:100%; background:var(--win-surface);
  border:1px solid var(--win-border2); border-radius:4px;
  padding:7px 10px; color:var(--text);
  font-family:'Segoe UI','Inter',sans-serif; font-size:13px; outline:none;
  transition:border-color .15s, box-shadow .15s;
}
.form-control:focus { border-color:var(--accent); box-shadow:0 0 0 2px rgba(0,103,192,0.15); }
select.form-control option { background:#fff; }
textarea.form-control { resize:vertical; min-height:80px; line-height:1.6; }

/* ── SEARCH ── */
.win-search {
  display:flex; align-items:center; gap:7px;
  background:var(--win-surface); border:1px solid var(--win-border2);
  border-radius:4px; padding:6px 10px;
}
.win-search input { background:none; border:none; outline:none; font-family:'Segoe UI','Inter',sans-serif; font-size:13px; color:var(--text); width:200px; }
.win-search:focus-within { border-color:var(--accent); box-shadow:0 0 0 2px rgba(0,103,192,0.15); }

/* ── FILTER ROW ── */
.filter-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; align-items:center; }
.filter-select {
  background:var(--win-surface); border:1px solid var(--win-border2);
  border-radius:4px; padding:6px 10px; color:var(--text);
  font-family:'Segoe UI','Inter',sans-serif; font-size:13px; outline:none; cursor:pointer;
}
.filter-select:focus { border-color:var(--accent); }

/* ── MODAL ── */
.modal-overlay {
  position:fixed; inset:0; background:rgba(0,0,0,0.4);
  z-index:200; display:flex; align-items:center; justify-content:center; padding:20px;
}
.win-modal {
  background:var(--win-surface); border:1px solid var(--win-border);
  border-radius:8px; width:100%; max-width:540px; max-height:90vh;
  overflow-y:auto; box-shadow:0 8px 32px rgba(0,0,0,0.18);
}
.win-modal-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 18px 0; border-bottom:1px solid var(--win-border); padding-bottom:12px;
}
.win-modal-title { font-size:14px; font-weight:600; }
.win-modal-close { background:none; border:none; color:var(--text-muted); font-size:18px; cursor:pointer; }
.win-modal-close:hover { color:var(--text); background:var(--win-surface3); border-radius:4px; }
.win-modal-body { padding:16px 18px; }
.win-modal-footer { padding:10px 18px 16px; display:flex; gap:8px; justify-content:flex-end; border-top:1px solid var(--win-border); }

/* ── PROGRESS ── */
.prog-bg { background:var(--win-surface3); border-radius:3px; height:6px; overflow:hidden; }
.prog-fill { height:100%; border-radius:3px; background:var(--accent); transition:width .5s ease; }
.sev-dot { display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:5px; vertical-align:middle; }

/* ── WORKFLOW STEPS ── */
.workflow { display:flex; gap:0; margin-bottom:20px; overflow-x:auto; }
.wf-step { flex:1; min-width:100px; text-align:center; position:relative; }
.wf-step::after { content:''; position:absolute; top:15px; left:50%; right:-50%; height:2px; background:var(--win-border2); z-index:0; }
.wf-step:last-child::after { display:none; }
.wf-circle {
  width:30px; height:30px; border-radius:50%; border:2px solid var(--win-border2);
  background:var(--win-surface); color:var(--text-muted);
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; margin:0 auto 6px; position:relative; z-index:1;
}
.wf-step.done .wf-circle { background:var(--accent); border-color:var(--accent); color:#fff; }
.wf-step.active .wf-circle { border-color:var(--accent); color:var(--accent); }
.wf-step.done::after { background:var(--accent); }
.wf-label { font-size:10px; color:var(--text-muted); font-weight:600; }
.wf-step.done .wf-label { color:var(--accent); }
.wf-step.active .wf-label { color:var(--text); }

/* ── TOAST ── */
.win-toast {
  position:fixed; bottom:20px; right:20px; z-index:999;
  background:var(--win-surface); border:1px solid var(--win-border2);
  border-radius:6px; padding:12px 16px;
  display:flex; align-items:center; gap:10px;
  box-shadow:0 4px 16px rgba(0,0,0,0.14); font-size:13px;
  animation:toastIn .2s ease;
}
.win-toast.hide { animation:toastOut .2s ease forwards; }
.win-toast-success .toast-icon { color:var(--success); font-size:16px; }
.win-toast-warning .toast-icon { color:var(--warning); font-size:16px; }
.win-toast-error   .toast-icon { color:var(--danger);  font-size:16px; }
@keyframes toastIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
@keyframes toastOut { to{opacity:0;transform:translateY(12px)} }

/* ── MISC ── */
.two-col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.three-col { display:grid; grid-template-columns:2fr 1fr; gap:14px; }
@media(max-width:750px){.two-col,.three-col{grid-template-columns:1fr;}}
.empty-state { text-align:center; padding:40px 20px; color:var(--text-muted); }
.empty-icon { font-size:36px; margin-bottom:10px; }
.divider { height:1px; background:var(--win-border); margin:14px 0; }
.tag { display:inline-block; background:var(--win-surface3); border:1px solid var(--win-border); border-radius:3px; padding:1px 6px; font-size:11px; color:var(--text-muted); }
a { color:var(--accent); text-decoration:none; }
a:hover { text-decoration:underline; }
`;
