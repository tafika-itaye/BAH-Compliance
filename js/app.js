/* BAH Compliance & Quality Platform — Production JavaScript */
const CMP = (() => {
  'use strict';
  const K = { POLICIES:'bah_policies', INCIDENTS:'bah_incidents', KPIS:'bah_kpis', ACTIONS:'bah_actions', ATTESTATIONS:'bah_attest', USER:'bah_cmp_user' };

  const SEED_POLICIES = [
    { id:'POL-001', title:'Infection Prevention and Control Policy', dept:'Clinical', category:'Policy', version:'3.2', status:'active', owner:'Dr. Grace Mbewe', approvedBy:'Medical Director', approvedDate:'2025-11-01', reviewDate:'2026-11-01', lastUpdated:'2025-11-01', content:'This policy outlines the infection prevention and control measures to be followed by all clinical staff at BAH. Covers hand hygiene, PPE usage, waste segregation, sterilization protocols, and outbreak management.', attestCount:42, attestTarget:55 },
    { id:'POL-002', title:'Patient Identification and Safety SOP', dept:'Nursing', category:'SOP', version:'2.1', status:'active', owner:'Sr. Nurse Chimwemwe Nkhoma', approvedBy:'Head of Nursing', approvedDate:'2025-09-15', reviewDate:'2026-09-15', lastUpdated:'2025-09-15', content:'Standard operating procedure for patient identification using wristbands, two-identifier verification before medication administration, blood transfusion, and surgical procedures.', attestCount:38, attestTarget:55 },
    { id:'POL-003', title:'Medical Equipment Maintenance Schedule', dept:'Maintenance', category:'SOP', version:'1.4', status:'active', owner:'Joseph Phiri', approvedBy:'Hospital Administrator', approvedDate:'2025-08-01', reviewDate:'2026-08-01', lastUpdated:'2026-02-15', content:'Defines preventive maintenance schedules for all biomedical equipment, electrical systems, and facility infrastructure. Includes calibration intervals, service contracts, and equipment lifecycle management.', attestCount:12, attestTarget:15 },
    { id:'POL-004', title:'Medication Storage and Dispensing Policy', dept:'Pharmacy', category:'Policy', version:'4.0', status:'review', owner:'Pharmacist James Chirwa', approvedBy:'Pending', approvedDate:null, reviewDate:'2026-04-15', lastUpdated:'2026-03-20', content:'Covers temperature-controlled storage, controlled substance management, dispensing verification, expiry date monitoring, and emergency medication access protocols.', attestCount:0, attestTarget:20 },
    { id:'POL-005', title:'Fire Safety and Emergency Evacuation Plan', dept:'Administration', category:'Policy', version:'2.0', status:'active', owner:'Hospital Administrator', approvedBy:'Board of Directors', approvedDate:'2025-06-01', reviewDate:'2026-06-01', lastUpdated:'2025-06-01', content:'Emergency evacuation routes, fire drill schedules, assembly points, fire extinguisher locations, and responsibilities during fire emergencies. Includes patient evacuation priority protocols.', attestCount:51, attestTarget:75 },
    { id:'POL-006', title:'Blood Transfusion Protocol', dept:'Clinical', category:'SOP', version:'1.2', status:'active', owner:'Dr. Peter Mwale', approvedBy:'Medical Director', approvedDate:'2025-10-01', reviewDate:'2026-10-01', lastUpdated:'2025-10-01', content:'Step-by-step procedure for blood ordering, cross-matching verification, transfusion monitoring, adverse reaction management, and documentation requirements.', attestCount:28, attestTarget:30 },
    { id:'POL-007', title:'Data Protection and Patient Confidentiality', dept:'IT', category:'Policy', version:'1.0', status:'draft', owner:'IT Manager', approvedBy:null, approvedDate:null, reviewDate:null, lastUpdated:'2026-03-28', content:'Policy governing access to patient records, data encryption, password management, and compliance with Malawi Data Protection Act. Includes breach notification procedures.', attestCount:0, attestTarget:75 },
    { id:'POL-008', title:'Hand Hygiene Compliance SOP', dept:'Clinical', category:'SOP', version:'3.0', status:'active', owner:'Infection Control Nurse', approvedBy:'Medical Director', approvedDate:'2025-07-01', reviewDate:'2026-07-01', lastUpdated:'2025-07-01', content:'WHO 5 Moments for Hand Hygiene implementation. Covers alcohol-based hand rub technique, handwashing procedure, audit methodology, and compliance reporting.', attestCount:50, attestTarget:55 },
  ];

  const SEED_INCIDENTS = [
    { id:'INC-2026-001', title:'Medication administered to wrong patient', type:'incident', severity:'major', dept:'Ward 2', reporter:'Anonymous', reportDate:'2026-03-28', status:'investigating', description:'Patient in Bed 4 received medication intended for Bed 5. Discovered during ward round. Patient monitored — no adverse effects observed.', rootCause:'Name band missing from patient wrist. Nurse did not verify using two identifiers.', correctiveAction:'CA-001', investigator:'Dr. Grace Mbewe', notes:[{by:'System',text:'Incident reported anonymously',ts:'2026-03-28T09:00:00Z'},{by:'Dr. Grace Mbewe',text:'Investigation initiated. Interviewed ward staff. Root cause: patient identification failure.',ts:'2026-03-29T14:00:00Z'}] },
    { id:'INC-2026-002', title:'Sharps container overflowing in Theatre', type:'near-miss', severity:'near-miss', dept:'Theatre', reporter:'Sr. Nurse Nkhoma', reportDate:'2026-03-25', status:'closed', description:'Sharps container in Theatre 2 was full beyond the fill line. Discovered before any needlestick injury occurred.', rootCause:'Replacement schedule not followed. Container not checked at shift handover.', correctiveAction:'CA-002', investigator:'Infection Control', notes:[{by:'Sr. Nurse Nkhoma',text:'Found during pre-op check. Container replaced immediately.',ts:'2026-03-25T07:30:00Z'},{by:'Infection Control',text:'Added sharps container check to shift handover checklist. Closed.',ts:'2026-03-27T10:00:00Z'}] },
    { id:'INC-2026-003', title:'Patient fall in bathroom — no injury', type:'incident', severity:'no-harm', dept:'Ward 3', reporter:'Nurse Thandi Banda', reportDate:'2026-03-20', status:'closed', description:'Elderly patient slipped in bathroom. Wet floor, no grab rails installed. Patient assessed — no injuries sustained.', rootCause:'Missing grab rails in Ward 3 bathrooms. Wet floor sign not placed after cleaning.', correctiveAction:'CA-003', investigator:'Quality Team', notes:[{by:'Nurse Thandi',text:'Patient assessed on scene. Vitals stable. No injuries.',ts:'2026-03-20T15:00:00Z'},{by:'Quality Team',text:'Grab rails requisitioned for all ward bathrooms. Wet floor protocol reinforced.',ts:'2026-03-22T09:00:00Z'}] },
    { id:'INC-2026-004', title:'Power outage affecting ICU ventilators', type:'incident', severity:'major', dept:'ICU', reporter:'Dr. Peter Mwale', reportDate:'2026-03-15', status:'closed', description:'Unscheduled power outage lasted 8 minutes before generator kicked in. ICU ventilators on battery backup sustained patients. No harm.', rootCause:'Generator auto-transfer switch (ATS) delay. ATS not tested in 3 months.', correctiveAction:'CA-004', investigator:'Maintenance', notes:[{by:'Dr. Mwale',text:'All ICU patients stable. Battery backups functioned correctly.',ts:'2026-03-15T03:20:00Z'},{by:'Maintenance',text:'ATS serviced and tested. Monthly testing schedule implemented.',ts:'2026-03-17T11:00:00Z'}] },
    { id:'INC-2026-005', title:'Unlabelled specimen sent to lab', type:'near-miss', severity:'near-miss', dept:'OPD', reporter:'Anonymous', reportDate:'2026-04-01', status:'open', description:'Blood specimen tube received in lab without patient name or ID. Specimen rejected. No test performed on wrong patient.', rootCause:'Under investigation', correctiveAction:null, investigator:'Quality Team', notes:[{by:'System',text:'Incident reported anonymously',ts:'2026-04-01T10:00:00Z'}] },
    { id:'INC-2026-006', title:'Surgical count discrepancy — swab retained', type:'incident', severity:'sentinel', dept:'Theatre', reporter:'Theatre Nurse Lead', reportDate:'2026-02-10', status:'closed', description:'Post-operative X-ray revealed retained surgical swab. Patient returned to theatre for removal. No long-term harm. Full RCA conducted.', rootCause:'Surgical count protocol deviation. Distraction during closing count.', correctiveAction:'CA-005', investigator:'Medical Director', notes:[{by:'Theatre Nurse Lead',text:'Count discrepancy identified during final count. X-ray ordered immediately.',ts:'2026-02-10T16:00:00Z'},{by:'Medical Director',text:'Full root cause analysis completed. Mandatory dual-nurse counting policy implemented. Surgical timeout checklist updated.',ts:'2026-02-20T09:00:00Z'}] },
  ];

  const SEED_KPIS = [
    { id:'KPI-01', name:'Hand Hygiene Compliance', dept:'Clinical', target:95, actual:87, unit:'%', period:'March 2026', trend:'up' },
    { id:'KPI-02', name:'Incident Reporting Rate', dept:'All', target:100, actual:78, unit:'%', period:'March 2026', trend:'up' },
    { id:'KPI-03', name:'Policy Attestation Rate', dept:'All', target:95, actual:72, unit:'%', period:'Q1 2026', trend:'stable' },
    { id:'KPI-04', name:'Equipment Maintenance On-Time', dept:'Maintenance', target:100, actual:91, unit:'%', period:'March 2026', trend:'up' },
    { id:'KPI-05', name:'Medication Error Rate', dept:'Pharmacy', target:0, actual:2, unit:'per 1000 doses', period:'March 2026', trend:'down' },
    { id:'KPI-06', name:'Patient Fall Rate', dept:'Nursing', target:0, actual:1, unit:'per 1000 patient-days', period:'March 2026', trend:'stable' },
    { id:'KPI-07', name:'Fire Drill Completion', dept:'Administration', target:4, actual:3, unit:'drills/year', period:'FY 2025-26', trend:'stable' },
    { id:'KPI-08', name:'Surgical Safety Checklist Compliance', dept:'Theatre', target:100, actual:96, unit:'%', period:'March 2026', trend:'up' },
  ];

  const SEED_ACTIONS = [
    { id:'CA-001', incidentId:'INC-2026-001', action:'Implement mandatory patient wristband check at every medication round. Add second identifier verification to nursing protocol.', assignee:'Head of Nursing', dueDate:'2026-04-15', status:'open' },
    { id:'CA-002', incidentId:'INC-2026-002', action:'Add sharps container inspection to shift handover checklist. Replace containers at 75% fill level.', assignee:'Infection Control', dueDate:'2026-04-05', status:'closed' },
    { id:'CA-003', incidentId:'INC-2026-003', action:'Install grab rails in all ward bathrooms. Reinforce wet floor signage protocol.', assignee:'Maintenance Manager', dueDate:'2026-04-30', status:'open' },
    { id:'CA-004', incidentId:'INC-2026-004', action:'Implement monthly ATS testing. Add to preventive maintenance calendar.', assignee:'Chief Engineer', dueDate:'2026-04-10', status:'closed' },
    { id:'CA-005', incidentId:'INC-2026-006', action:'Mandatory dual-nurse surgical count. Updated surgical timeout checklist. Quarterly count audit.', assignee:'Theatre Manager', dueDate:'2026-03-15', status:'closed' },
  ];

  function init() {
    if (!localStorage.getItem(K.POLICIES)) localStorage.setItem(K.POLICIES, JSON.stringify(SEED_POLICIES));
    if (!localStorage.getItem(K.INCIDENTS)) localStorage.setItem(K.INCIDENTS, JSON.stringify(SEED_INCIDENTS));
    if (!localStorage.getItem(K.KPIS)) localStorage.setItem(K.KPIS, JSON.stringify(SEED_KPIS));
    if (!localStorage.getItem(K.ACTIONS)) localStorage.setItem(K.ACTIONS, JSON.stringify(SEED_ACTIONS));
    if (!localStorage.getItem(K.USER)) localStorage.setItem(K.USER, JSON.stringify({ name:'Quality Manager', role:'Admin', dept:'Quality' }));
  }

  function getPolicies() { return JSON.parse(localStorage.getItem(K.POLICIES)||'[]'); }
  function getIncidents() { return JSON.parse(localStorage.getItem(K.INCIDENTS)||'[]'); }
  function getKPIs() { return JSON.parse(localStorage.getItem(K.KPIS)||'[]'); }
  function getActions() { return JSON.parse(localStorage.getItem(K.ACTIONS)||'[]'); }
  function getUser() { return JSON.parse(localStorage.getItem(K.USER)||'{}'); }

  function savePolicies(p) { localStorage.setItem(K.POLICIES, JSON.stringify(p)); }
  function saveIncidents(i) { localStorage.setItem(K.INCIDENTS, JSON.stringify(i)); }
  function saveActions(a) { localStorage.setItem(K.ACTIONS, JSON.stringify(a)); }

  function getPolicy(id) { return getPolicies().find(p=>p.id===id); }
  function getIncident(id) { return getIncidents().find(i=>i.id===id); }

  function reportIncident(data) {
    const list = getIncidents();
    const num = list.length + 1;
    const inc = {
      id: `INC-2026-${String(num).padStart(3,'0')}`,
      title: data.title, type: data.type, severity: data.severity,
      dept: data.dept, reporter: data.anonymous ? 'Anonymous' : (getUser().name || 'Staff'),
      reportDate: new Date().toISOString().split('T')[0], status: 'open',
      description: data.description, rootCause: '', correctiveAction: null,
      investigator: 'Quality Team',
      notes: [{ by: 'System', text: `${data.type === 'near-miss' ? 'Near miss' : 'Incident'} reported${data.anonymous ? ' anonymously' : ''}.`, ts: new Date().toISOString() }],
    };
    list.push(inc); saveIncidents(list);
    return inc;
  }

  function updateIncidentStatus(id, status, note) {
    const list = getIncidents();
    const inc = list.find(i=>i.id===id);
    if (!inc) return null;
    inc.status = status;
    if (note) inc.notes.push({ by: getUser().name, text: note, ts: new Date().toISOString() });
    saveIncidents(list);
    return inc;
  }

  function addIncidentNote(id, text) {
    const list = getIncidents();
    const inc = list.find(i=>i.id===id);
    if (!inc) return;
    inc.notes.push({ by: getUser().name, text, ts: new Date().toISOString() });
    saveIncidents(list);
  }

  function toggleAttestation(policyId) {
    const list = getPolicies();
    const p = list.find(x=>x.id===policyId);
    if (!p) return;
    p.attestCount = Math.min(p.attestCount + 1, p.attestTarget);
    savePolicies(list);
  }

  function getStats() {
    const p = getPolicies(), i = getIncidents(), k = getKPIs(), a = getActions();
    return {
      totalPolicies: p.length,
      activePolicies: p.filter(x=>x.status==='active').length,
      draftPolicies: p.filter(x=>x.status==='draft').length,
      reviewPolicies: p.filter(x=>x.status==='review').length,
      avgAttestation: p.filter(x=>x.status==='active'&&x.attestTarget>0).reduce((s,x)=>s+(x.attestCount/x.attestTarget*100),0) / (p.filter(x=>x.status==='active'&&x.attestTarget>0).length||1),
      totalIncidents: i.length,
      openIncidents: i.filter(x=>x.status==='open').length,
      nearMisses: i.filter(x=>x.type==='near-miss').length,
      sentinelEvents: i.filter(x=>x.severity==='sentinel').length,
      openActions: a.filter(x=>x.status==='open').length,
      closedActions: a.filter(x=>x.status==='closed').length,
      kpisMet: k.filter(x=> x.target <= x.actual || (x.name.includes('Error')||x.name.includes('Fall') ? x.actual <= x.target : x.actual >= x.target)).length,
      kpisTotal: k.length,
      cohsasaScore: Math.round(p.filter(x=>x.status==='active').reduce((s,x)=>s+(x.attestCount/x.attestTarget*100),0) / (p.filter(x=>x.status==='active').length||1)),
    };
  }

  function formatDate(iso) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }
  function formatDateTime(iso) { if (!iso) return '—'; const d=new Date(iso); return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})+' '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); }
  function toast(msg,type='success') { let el=document.getElementById('app-toast'); if(!el){el=document.createElement('div');el.id='app-toast';el.className='toast';document.body.appendChild(el);} el.innerHTML=`${type==='success'?'✅':'❌'} ${msg}`; el.className=`toast ${type}`; requestAnimationFrame(()=>el.classList.add('show')); setTimeout(()=>el.classList.remove('show'),3500); }
  function toggleMenu() { document.querySelector('.sidebar')?.classList.toggle('open'); }

  return { init, getPolicies, getPolicy, getIncidents, getIncident, getKPIs, getActions, getUser, getStats, reportIncident, updateIncidentStatus, addIncidentNote, toggleAttestation, savePolicies, saveIncidents, saveActions, formatDate, formatDateTime, toast, toggleMenu };
})();

document.addEventListener('DOMContentLoaded', () => CMP.init());
