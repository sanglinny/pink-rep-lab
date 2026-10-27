
const $=id=>document.getElementById(id);
const warn=()=>{if(!document.getElementById('sw')){const d=document.createElement('div');d.id='sw';d.className='note';d.textContent='Your browser blocked saving on this device (private mode or blocked site data). Your entries will not be kept after you leave this page.';document.querySelector('main').prepend(d)}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){warn();return false}};
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
if($('tracker')){const st=load('prl_tracker',{});const prof=load('prl_profile',{});const pd=Array.isArray(prof.days)?prof.days:[];const names=['M','T','W','T','F','S','S'];
 const draw=()=>{let h='';for(let w=1;w<=4;w++){h+=`<p><b>Week ${w}</b></p><div class="days">`+names.map((n,i)=>{const k=w+'-'+i;return `<div class="day ${st[k]?'on':''}${pd.includes(i)?' plan':''}" data-k="${k}">${n}</div>`}).join('')+'</div>'}
  const tot=Object.values(st).filter(Boolean).length;$('tracker').innerHTML=h+`<p>Done: <b id="tdone">${tot}</b> of 12 suggested sessions (3 per week, any days you choose)</p><div class="bar"><i style="width:${Math.min(100,tot/12*100)}%"></i></div>`};
 draw();$('tracker').addEventListener('click',e=>{const d=e.target.closest('.day');if(!d)return;st[d.dataset.k]=!st[d.dataset.k];save('prl_tracker',st);draw()})}
if($('logAdd')){const draw=()=>{const l=load('prl_log',[]);$('logOut').innerHTML=l.length?'<table><tr><th>Date</th><th>Step</th><th>Clean reps</th></tr>'+l.slice(-12).reverse().map(r=>`<tr><td>${r.d}</td><td>${r.s}</td><td>${r.r}</td></tr>`).join('')+'</table>':'<p class="note">No entries yet.</p>'};
 $('logAdd').onclick=()=>{const r=parseInt($('logReps').value,10);if(isNaN(r))return;const l=load('prl_log',[]);l.push({d:new Date().toISOString().slice(0,10),s:$('logStep').value,r});save('prl_log',l);$('logReps').value='';draw()};draw()}
if($('pAdd')){const draw=()=>{const l=load('prl_pull',[]);$('pOut').innerHTML=l.length?'<table><tr><th>Date</th><th>Version</th><th>Number</th><th>Setup</th></tr>'+l.slice(-15).reverse().map(r=>`<tr><td>${r.d}</td><td>${r.v}</td><td>${r.n}</td><td>${(r.s||'').replace(/[<>&]/g,'')}</td></tr>`).join('')+'</table>':'<p class="note">No entries yet.</p>'};
 $('pAdd').onclick=()=>{const n=parseInt($('pNum').value,10);if(isNaN(n)||n<0)return;const l=load('prl_pull',[]);l.push({d:new Date().toISOString().slice(0,10),v:$('pVer').value,n,s:$('pSetup').value.slice(0,60)});save('prl_pull',l);$('pNum').value='';draw()};
 $('pCsv').onclick=()=>{const l=load('prl_pull',[]);const q=x=>{let t=String(x);if(/^[=+\-@\t\r]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"'};const t='date,version,number,setup\n'+l.map(r=>[r.d,r.v,r.n,r.s||''].map(q).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download='pink-rep-lab-log.csv';a.click()};
 $('pClear').onclick=()=>{if(confirm('Delete all trackers and logs saved on this device?')){['prl_tracker','prl_log','prl_pull','prl_profile'].forEach(k=>{try{localStorage.removeItem(k)}catch(e){}});location.reload()}};draw()}
if($('tGo'))$('tGo').onclick=()=>{const w=+$('tWall').value,i=+$('tInc').value,f=+$('tFloor').value;let s,m;
 if(f>=12){s='Floor push-ups';m='You can do more than 12 clean floor reps. Keep the floor version and add difficulty (slower lowering, feet raised) or keep building volume.'}
 else if(f>=8){s='Floor push-ups';m='Start on the floor: 2 to 3 sets of about 8 to 12 clean reps.'}
 else if(i>=12){s='Lower incline';m='Use a lower surface (bench to chair to low step) until floor reps reach 8.'}
 else if(i>=8){s='Incline push-ups';m='Start on the incline: 2 to 3 sets of about 8 to 12 clean reps, then lower the surface.'}
 else if(w>=12){s='Incline push-ups';m='Wall is easy: move to a high incline (table or counter).'}
 else{s='Wall push-ups';m='Start at the wall: palms at chest height, walk your feet back as it gets easy.'}
 $('tOut').hidden=false;$('tOut').innerHTML=`<div class="tag">Suggested starting step</div><h3>${s}</h3><p>${m}</p><p class="note">Our own simple guide, not a medical test. If it feels too hard, go back to an easier step. Stop if pain is sharp or lasting.</p><p><a href=\"plans.html\">See the ladder and plan</a> - <a href=\"videos.html\">Watch the push-up video</a></p>`};
if($('dGo'))$('dGo').onclick=()=>{const kg=+$('dKg').value;if(!kg)return;const g=Math.round(kg*1.6);
 $('dOut').hidden=false;$('dOut').innerHTML=`<div class="tag">Rough guide</div><h3>about ${g} g of total protein per day (reference estimate)</h3><p>That is 1.6 g per kg (${kg} kg), counting all the protein you eat in a day. A reference for healthy adults who do resistance training, not a rule or a prescription. A dietitian or doctor can tailor it if you have a health condition.</p><p><a href=\"videos.html\">Watch the muscle growth video</a></p>`};

if($('jSummary')){const tr=load('prl_tracker',{});const done=Object.values(tr).filter(Boolean).length;const pl=load('prl_log',[]);const pu=load('prl_pull',[]);
 const lastPush=pl.length?pl[pl.length-1]:null;const byV={};pu.forEach(r=>{byV[r.v]=r});
 const esc=t=>String(t).replace(/[<>&]/g,'');
 $('jSummary').innerHTML=`<div class="card"><div class="tag">Tracker</div><h3>${done} of 12 sessions</h3><div class="bar"><i style="width:${Math.min(100,done/12*100)}%"></i></div><p><a href="plans.html">Continue</a></p></div>
 <div class="card"><div class="tag">Push-ups</div><h3>${lastPush?esc(lastPush.s)+': '+esc(lastPush.r)+' clean reps':'No entry yet'}</h3><p>${lastPush?esc(lastPush.d):'Nothing saved yet. Add your first entry on the Plans page.'}</p></div>
 <div class="card"><div class="tag">Pull-up baseline</div><h3>${Object.keys(byV).length?Object.keys(byV).length+' version(s) logged':'No entry yet'}</h3><p>${Object.values(byV).map(r=>esc(r.v)+': '+esc(r.n)+' ('+esc(r.d)+')').join('<br>')||'Nothing saved yet. Add your first entry on the Tests page.'}</p></div>`}
const KEYS=['prl_tracker','prl_log','prl_pull','prl_profile'];
if($('jExport'))$('jExport').onclick=()=>{const data={};KEYS.forEach(k=>data[k]=load(k,(k==='prl_tracker'||k==='prl_profile')?{}:[]));const b={app:'pink-rep-lab',version:1,exported:new Date().toISOString().slice(0,10),data};
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(b,null,1)],{type:'application/json'}));a.download='pink-rep-lab-backup.json';a.click()};
if($('jFile')){let pending=null;
 const valid=b=>{if(!b||b.app!=='pink-rep-lab'||b.version!==1||!b.data)return 'This is not a Pink Rep Lab backup (version 1).';const d=b.data;
  if(d.prl_tracker&&(typeof d.prl_tracker!=='object'||Array.isArray(d.prl_tracker)||Object.entries(d.prl_tracker).some(([k,v])=>!/^[1-4]-[0-6]$/.test(k)||typeof v!=='boolean')))return 'Tracker data is not valid.';
  if(d.prl_log&&(!Array.isArray(d.prl_log)||d.prl_log.length>5000||d.prl_log.some(r=>typeof r.d!=='string'||typeof r.s!=='string'||typeof r.r!=='number')))return 'Push-up log is not valid.';
  if(d.prl_pull&&(!Array.isArray(d.prl_pull)||d.prl_pull.length>5000||d.prl_pull.some(r=>typeof r.d!=='string'||typeof r.v!=='string'||typeof r.n!=='number'||(r.s!==undefined&&typeof r.s!=='string'))))return 'Pull-up log is not valid.';
  if(d.prl_profile&&(typeof d.prl_profile!=='object'||Array.isArray(d.prl_profile)||(d.prl_profile.name!==undefined&&typeof d.prl_profile.name!=='string')||(d.prl_profile.days!==undefined&&(!Array.isArray(d.prl_profile.days)||d.prl_profile.days.some(x=>!Number.isInteger(x)||x<0||x>6)))))return 'Plan profile is not valid.';
  return ''};
 $('jFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const pv=$('jPreview');pv.hidden=false;if(f.size>1000000){pv.textContent='File is too large.';return}
  f.text().then(t=>{let b;try{b=JSON.parse(t)}catch(x){pv.textContent='This file could not be read as JSON.';return}const err=valid(b);if(err){pv.textContent=err;return}pending=b.data;
   pv.innerHTML=`<h3>Backup from ${String(b.exported||'').replace(/[<>&]/g,'')}</h3><p>Tracker ticks: ${Object.values(pending.prl_tracker||{}).filter(Boolean).length} - push-up entries: ${(pending.prl_log||[]).length} - pull-up entries: ${(pending.prl_pull||[]).length}</p><p>Nothing has been changed yet.</p><p><button class="btn" id="jMerge">Merge with my current records</button> <button class="btn o" id="jReplace">Replace my current records</button></p><p class="note">Merge keeps your current entries and adds any entry not already saved (duplicates are skipped; tracker ticks are combined). Replace deletes your current records first and uses only this file.</p>`;
   const apply=(vals)=>{const old={};KEYS.forEach(k=>{old[k]=localStorage.getItem(k)});let ok=true;KEYS.forEach(k=>{if(ok&&!save(k,vals[k]))ok=false});if(!ok){KEYS.forEach(k=>{try{old[k]===null?localStorage.removeItem(k):localStorage.setItem(k,old[k])}catch(e){}});pv.textContent='Could not save the backup in this browser. Your current records were left unchanged.';return}pv.textContent='Restored.';setTimeout(()=>location.reload(),600)};
   $('jMerge').onclick=()=>{if(!confirm('Merge this backup into the records saved in this browser?'))return;
    const tr=Object.assign({},load('prl_tracker',{}),pending.prl_tracker||{});const mg=(k,a)=>{const cur=load(k,[]);const seen=new Set(cur.map(x=>JSON.stringify(x)));(a||[]).forEach(x=>{if(!seen.has(JSON.stringify(x)))cur.push(x)});return cur};
    apply({prl_tracker:tr,prl_log:mg('prl_log',pending.prl_log),prl_pull:mg('prl_pull',pending.prl_pull),prl_profile:Object.assign({},load('prl_profile',{}),pending.prl_profile||{})})};
   $('jReplace').onclick=()=>{if(!confirm('Replace all records saved in this browser with this backup? This cannot be undone.'))return;
    apply({prl_tracker:pending.prl_tracker||{},prl_log:pending.prl_log||[],prl_pull:pending.prl_pull||[],prl_profile:pending.prl_profile||{}})}})}}
if($('jPrint'))$('jPrint').onclick=()=>window.print();
if($('cMake')){const cv=$('cCanvas'),cx=cv.getContext('2d');const img=new Image();img.src='POSE_POINT_tee.png';
 const draw=()=>{const t=($('cText').value||'My progress').trim().slice(0,60);cx.fillStyle='#fff';cx.fillRect(0,0,1080,1080);cx.fillStyle='#ff4fa3';cx.fillRect(0,0,1080,28);cx.fillRect(0,1052,1080,28);
  if(img.complete&&img.naturalWidth){const h=720,w=img.naturalWidth*h/img.naturalHeight;cx.drawImage(img,1040-w,200,w,h)}
  cx.fillStyle='#101010';let fs=84,lines;const F=()=>'bold '+fs+'px "Segoe UI","Noto Sans",Arial,sans-serif';for(;;){cx.font=F();const words=t.split(/\s+/);let line='';lines=[];words.forEach(w=>{const n=line?line+' '+w:w;if(cx.measureText(n).width>560&&line){lines.push(line);line=w}else line=n});lines.push(line);if((lines.length<=6&&lines.every(l=>cx.measureText(l).width<=560))||fs<=36)break;fs-=6}let y=300;lines.forEach(l=>{cx.fillText(l,60,y,560);y+=fs+16});
  cx.fillStyle='#ff4fa3';cx.font='bold 40px Segoe UI,Arial,sans-serif';cx.fillText('PINK REP LAB',60,1000);cv.hidden=false;$('cSave').hidden=false};
 $('cMake').onclick=()=>{if(img.complete)draw();else img.onload=draw};
 $('cSave').onclick=()=>{const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download='pink-rep-lab-card.png';a.click()}}

const DAYN=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const esc2=t=>String(t).replace(/[<>&"]/g,'');
function planHtml(p){
 const days=(p.days||[]).slice().sort((a,b)=>a-b);const nm=p.name?esc2(p.name)+"'s":'Your';
 const adj=days.some((d,i)=>{const n=days[(i+1)%days.length];return days.length>1&&((n-d+7)%7)===1});
 let goal='',session='',prog='',links='';
 if(p.goal==='push'){const v={wall:'wall push-ups',incline:'incline push-ups (hands on a sturdy bench or table)',floor:'floor push-ups'}[p.level]||'incline push-ups';
  goal='Do more push-ups';session=`<li>Warm up gently.</li><li>${v}: 2 to 3 sets of about 8 to 12 clean reps. Stop a set when your form breaks.</li><li>Rest until you can keep good form.</li>`;
  prog='More than 12 clean reps easily? Move up one step (wall, incline, floor). Cannot reach 8 clean reps? Move down one step. This 8 to 12 range is our own practice rule, not a scientific threshold.';
  links='<a href="plans.html">Push-up ladder</a> - <a href="tests.html">Push-up starting guide</a>'}
 else if(p.goal==='pull'){goal='Work toward a first pull-up';
  const e=p.equip;let opts='';
  if(e==='bar'||e==='band')opts+='<li>Hang with your shoulders set: 2 to 3 short holds. Count seconds, stop before grip or form breaks.</li>';
  if(e==='band')opts+='<li>Band-assisted pulls: 2 to 3 sets of controlled reps. Follow the band instructions and check the band and bar first.</li>';
  if(e==='bar'||e==='band')opts+='<li>Slow lowering is optional, only if you can control the descent from a stable step.</li>';
  if(e==='support')opts+='<li>Rows: 2 to 3 sets of controlled reps, only on a support you have verified will hold your weight.</li>';
  if(e==='none')opts+='<li>No safe bar or support yet: skip the pull options for now. Train push-ups and squats, and watch for the next video on training your back with almost no equipment.</li>';
  session=opts+'<li>Rest until you can maintain good form.</li>';
  prog='These are coaching options, not a tested ladder in any trial. Move on only when you complete all planned sets with consistent form across repeated sessions; if you lose control, go back to the easier option. Record the same version and setup each time.';
  links='<a href="plans.html#pullup">Pull-up options</a> - <a href="tests.html#pullup">Baseline log</a>'}
 else if(p.goal==='home'){goal='Train at home with almost nothing';
  session=`<li>Incline push-up on a sturdy surface.</li>${p.equip==='support'?'<li>Table row, only on a support you verified. If unsure, skip it.</li>':''}<li>Bodyweight squat, controlled on the way down.</li><li>Glute bridge, squeeze at the top.</li><li>About 2 to 3 sets each, stopping before form breaks.</li>`;
  prog='When all sets are clean across several sessions, make one move slightly harder. If a move hurts or you cannot control it, pick an easier version.';
  links='<a href="plans.html#home">Home starter plan</a>'}
 else{goal='Understand and start building muscle';
  session='<li>Pick 2 or 3 moves you can control (for example incline push-up, squat, glute bridge).</li><li>Take sets close to hard but with good form; last reps should feel hard, not a collapse.</li><li>Rest long enough to do the next set well.</li>';
  prog='Muscles grow from enough hard work, food, protein and sleep. Compare yourself with your own numbers, not other people. Protein is a reference point of about 1.6 g per kg per day in one meta-analysis, not a rule.';
  links='<a href="videos.html">Muscle growth video</a> - <a href="diet.html">Protein guide</a>'}
 return `<div class="plan-out"><span class="tag">${nm} starter plan</span><h2 style="margin-top:.2em">${goal}</h2>
 <h3>When</h3><p>${days.length?days.map(d=>DAYN[d]).join(', '):'Pick 2 or 3 days'} (${days.length||0} sessions a week). ${adj?'Try to leave a rest day between sessions if you can.':''}</p>
 <h3>Each session</h3><ul>${session}</ul><h3>When to move on</h3><p>${prog}</p>
 <div class="callout"><b>Train within your control</b>Stop with chest pain, unusual shortness of breath, dizziness or sharp pain. Severe or lasting chest pain: get emergency help. Skip any option that is not safe for you.</div>
 <p>${links}</p><p><a class="btn" href="plans.html#tracker">Open my 4-week tracker</a><a class="btn o" href="journey.html">Open My journey</a><button class="btn o" onclick="window.print()">Print my plan</button></p></div>`}
if($('fDays')){const sel=new Set(load('prl_profile',{}).days||[]);const dd=$('fDays');dd.className='days pick';
 const draw=()=>{dd.innerHTML=DAYN.map((n,i)=>`<div class="day ${sel.has(i)?'on':''}" data-i="${i}" role="checkbox" aria-checked="${sel.has(i)}" tabindex="0">${n}</div>`).join('')};draw();
 const tog=e=>{const d=e.target.closest('.day');if(!d)return;const i=+d.dataset.i;if(sel.has(i))sel.delete(i);else if(sel.size<3)sel.add(i);draw()};
 dd.addEventListener('click',tog);dd.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();tog(e)}});
 const pr=load('prl_profile',null);if(pr&&pr.goal){$('fName').value=pr.name||'';$('fGoal').value=pr.goal;$('fLevel').value=pr.level||'wall';$('fEquip').value=pr.equip||'none';$('fOut').innerHTML=planHtml(pr)}
 $('fMake').onclick=()=>{const er=$('fErr');er.hidden=true;
  if(sel.size<2){er.textContent='Please pick 2 or 3 training days.';er.hidden=false;return}
  if(!$('fOk').checked){er.textContent='Please tick the safety box first.';er.hidden=false;return}
  const p={name:$('fName').value.trim().slice(0,24),goal:$('fGoal').value,level:$('fLevel').value,equip:$('fEquip').value,days:[...sel].sort((a,b)=>a-b),created:new Date().toISOString().slice(0,10)};
  if(!save('prl_profile',p)){er.textContent='Your browser blocked saving, so the plan will not be kept. You can still use it now.';er.hidden=false}
  $('fOut').innerHTML=planHtml(p);$('fOut').scrollIntoView({behavior:'smooth',block:'start'})}}
if($('jPlanBox')){const pr=load('prl_profile',null);$('jPlanBox').innerHTML=pr&&pr.goal?planHtml(pr)+'<p><a href="join.html">Change my plan</a></p>':'<p>You have not made a plan yet. It takes about a minute, with no account and no email.</p><p><a class="btn" href="join.html">Start free &rarr;</a></p>'}

(()=>{const b=document.getElementById('menuBtn'),n=document.getElementById('navMenu');if(!b||!n)return;
 const set=o=>{n.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false')};
 b.onclick=()=>set(!n.classList.contains('open'));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&n.classList.contains('open')){set(false);b.focus()}});
 n.addEventListener('click',e=>{if(e.target.closest('a'))set(false)})})();
