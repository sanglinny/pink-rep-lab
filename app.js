
const $=id=>document.getElementById(id);
const warn=()=>{if(!document.getElementById('sw')){const d=document.createElement('div');d.id='sw';d.className='note';d.textContent='Your browser blocked saving on this device (private mode or blocked site data). Your entries will not be kept after you leave this page.';document.querySelector('main').prepend(d)}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){warn();return false}};
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
if($('tracker')){const st=load('prl_tracker',{});const names=['M','T','W','T','F','S','S'];
 const draw=()=>{let h='';for(let w=1;w<=4;w++){h+=`<p><b>Week ${w}</b></p><div class="days">`+names.map((n,i)=>{const k=w+'-'+i;return `<div class="day ${st[k]?'on':''}" data-k="${k}">${n}</div>`}).join('')+'</div>'}
  const tot=Object.values(st).filter(Boolean).length;$('tracker').innerHTML=h+`<p>Done: <b id="tdone">${tot}</b> of 12 suggested sessions (3 per week, any days you choose)</p><div class="bar"><i style="width:${Math.min(100,tot/12*100)}%"></i></div>`};
 draw();$('tracker').addEventListener('click',e=>{const d=e.target.closest('.day');if(!d)return;st[d.dataset.k]=!st[d.dataset.k];save('prl_tracker',st);draw()})}
if($('logAdd')){const draw=()=>{const l=load('prl_log',[]);$('logOut').innerHTML=l.length?'<table><tr><th>Date</th><th>Step</th><th>Clean reps</th></tr>'+l.slice(-12).reverse().map(r=>`<tr><td>${r.d}</td><td>${r.s}</td><td>${r.r}</td></tr>`).join('')+'</table>':'<p class="note">No entries yet.</p>'};
 $('logAdd').onclick=()=>{const r=parseInt($('logReps').value,10);if(isNaN(r))return;const l=load('prl_log',[]);l.push({d:new Date().toISOString().slice(0,10),s:$('logStep').value,r});save('prl_log',l);$('logReps').value='';draw()};draw()}
if($('pAdd')){const draw=()=>{const l=load('prl_pull',[]);$('pOut').innerHTML=l.length?'<table><tr><th>Date</th><th>Version</th><th>Number</th><th>Setup</th></tr>'+l.slice(-15).reverse().map(r=>`<tr><td>${r.d}</td><td>${r.v}</td><td>${r.n}</td><td>${(r.s||'').replace(/[<>&]/g,'')}</td></tr>`).join('')+'</table>':'<p class="note">No entries yet.</p>'};
 $('pAdd').onclick=()=>{const n=parseInt($('pNum').value,10);if(isNaN(n)||n<0)return;const l=load('prl_pull',[]);l.push({d:new Date().toISOString().slice(0,10),v:$('pVer').value,n,s:$('pSetup').value.slice(0,60)});save('prl_pull',l);$('pNum').value='';draw()};
 $('pCsv').onclick=()=>{const l=load('prl_pull',[]);const q=x=>{let t=String(x);if(/^[=+\-@\t\r]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"'};const t='date,version,number,setup\n'+l.map(r=>[r.d,r.v,r.n,r.s||''].map(q).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download='pink-rep-lab-log.csv';a.click()};
 $('pClear').onclick=()=>{if(confirm('Delete all trackers and logs saved on this device?')){['prl_tracker','prl_log','prl_pull'].forEach(k=>{try{localStorage.removeItem(k)}catch(e){}});location.reload()}};draw()}
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
const KEYS=['prl_tracker','prl_log','prl_pull'];
if($('jExport'))$('jExport').onclick=()=>{const data={};KEYS.forEach(k=>data[k]=load(k,k==='prl_tracker'?{}:[]));const b={app:'pink-rep-lab',version:1,exported:new Date().toISOString().slice(0,10),data};
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(b,null,1)],{type:'application/json'}));a.download='pink-rep-lab-backup.json';a.click()};
if($('jFile')){let pending=null;
 const valid=b=>{if(!b||b.app!=='pink-rep-lab'||b.version!==1||!b.data)return 'This is not a Pink Rep Lab backup (version 1).';const d=b.data;
  if(d.prl_tracker&&(typeof d.prl_tracker!=='object'||Array.isArray(d.prl_tracker)||Object.entries(d.prl_tracker).some(([k,v])=>!/^[1-4]-[0-6]$/.test(k)||typeof v!=='boolean')))return 'Tracker data is not valid.';
  if(d.prl_log&&(!Array.isArray(d.prl_log)||d.prl_log.length>5000||d.prl_log.some(r=>typeof r.d!=='string'||typeof r.s!=='string'||typeof r.r!=='number')))return 'Push-up log is not valid.';
  if(d.prl_pull&&(!Array.isArray(d.prl_pull)||d.prl_pull.length>5000||d.prl_pull.some(r=>typeof r.d!=='string'||typeof r.v!=='string'||typeof r.n!=='number'||(r.s!==undefined&&typeof r.s!=='string'))))return 'Pull-up log is not valid.';
  return ''};
 $('jFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const pv=$('jPreview');pv.hidden=false;if(f.size>1000000){pv.textContent='File is too large.';return}
  f.text().then(t=>{let b;try{b=JSON.parse(t)}catch(x){pv.textContent='This file could not be read as JSON.';return}const err=valid(b);if(err){pv.textContent=err;return}pending=b.data;
   pv.innerHTML=`<h3>Backup from ${String(b.exported||'').replace(/[<>&]/g,'')}</h3><p>Tracker ticks: ${Object.values(pending.prl_tracker||{}).filter(Boolean).length} - push-up entries: ${(pending.prl_log||[]).length} - pull-up entries: ${(pending.prl_pull||[]).length}</p><p>Nothing has been changed yet.</p><p><button class="btn" id="jMerge">Merge with my current records</button> <button class="btn o" id="jReplace">Replace my current records</button></p><p class="note">Merge keeps your current entries and adds any entry not already saved (duplicates are skipped; tracker ticks are combined). Replace deletes your current records first and uses only this file.</p>`;
   const apply=(vals)=>{const old={};KEYS.forEach(k=>{old[k]=localStorage.getItem(k)});let ok=true;KEYS.forEach(k=>{if(ok&&!save(k,vals[k]))ok=false});if(!ok){KEYS.forEach(k=>{try{old[k]===null?localStorage.removeItem(k):localStorage.setItem(k,old[k])}catch(e){}});pv.textContent='Could not save the backup in this browser. Your current records were left unchanged.';return}pv.textContent='Restored.';setTimeout(()=>location.reload(),600)};
   $('jMerge').onclick=()=>{if(!confirm('Merge this backup into the records saved in this browser?'))return;
    const tr=Object.assign({},load('prl_tracker',{}),pending.prl_tracker||{});const mg=(k,a)=>{const cur=load(k,[]);const seen=new Set(cur.map(x=>JSON.stringify(x)));(a||[]).forEach(x=>{if(!seen.has(JSON.stringify(x)))cur.push(x)});return cur};
    apply({prl_tracker:tr,prl_log:mg('prl_log',pending.prl_log),prl_pull:mg('prl_pull',pending.prl_pull)})};
   $('jReplace').onclick=()=>{if(!confirm('Replace all records saved in this browser with this backup? This cannot be undone.'))return;
    apply({prl_tracker:pending.prl_tracker||{},prl_log:pending.prl_log||[],prl_pull:pending.prl_pull||[]})}})}}
if($('jPrint'))$('jPrint').onclick=()=>window.print();
if($('cMake')){const cv=$('cCanvas'),cx=cv.getContext('2d');const img=new Image();img.src='POSE_POINT_tee.png';
 const draw=()=>{const t=($('cText').value||'My progress').trim().slice(0,60);cx.fillStyle='#fff';cx.fillRect(0,0,1080,1080);cx.fillStyle='#ff4fa3';cx.fillRect(0,0,1080,28);cx.fillRect(0,1052,1080,28);
  if(img.complete&&img.naturalWidth){const h=720,w=img.naturalWidth*h/img.naturalHeight;cx.drawImage(img,1040-w,200,w,h)}
  cx.fillStyle='#101010';let fs=84,lines;const F=()=>'bold '+fs+'px "Segoe UI","Noto Sans",Arial,sans-serif';for(;;){cx.font=F();const words=t.split(/\s+/);let line='';lines=[];words.forEach(w=>{const n=line?line+' '+w:w;if(cx.measureText(n).width>560&&line){lines.push(line);line=w}else line=n});lines.push(line);if((lines.length<=6&&lines.every(l=>cx.measureText(l).width<=560))||fs<=36)break;fs-=6}let y=300;lines.forEach(l=>{cx.fillText(l,60,y,560);y+=fs+16});
  cx.fillStyle='#ff4fa3';cx.font='bold 40px Segoe UI,Arial,sans-serif';cx.fillText('PINK REP LAB',60,1000);cv.hidden=false;$('cSave').hidden=false};
 $('cMake').onclick=()=>{if(img.complete)draw();else img.onload=draw};
 $('cSave').onclick=()=>{const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download='pink-rep-lab-card.png';a.click()}}

(()=>{const b=document.getElementById('menuBtn'),n=document.getElementById('navMenu');if(!b||!n)return;
 const set=o=>{n.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false')};
 b.onclick=()=>set(!n.classList.contains('open'));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&n.classList.contains('open')){set(false);b.focus()}});
 n.addEventListener('click',e=>{if(e.target.closest('a'))set(false)})})();
