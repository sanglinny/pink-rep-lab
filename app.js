
const $=id=>document.getElementById(id);
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
if($('tracker')){const st=load('prl_tracker',{});const names=['M','T','W','T','F','S','S'];
 const draw=()=>{let h='';for(let w=1;w<=4;w++){h+=`<p><b>Week ${w}</b></p><div class="days">`+names.map((n,i)=>{const k=w+'-'+i;return `<div class="day ${st[k]?'on':''}" data-k="${k}">${n}</div>`}).join('')+'</div>'}
  const tot=Object.values(st).filter(Boolean).length;$('tracker').innerHTML=h+`<p>Done: <b id="tdone">${tot}</b> of 12 suggested sessions (3 per week, any days you choose)</p><div class="bar"><i style="width:${Math.min(100,tot/12*100)}%"></i></div>`};
 draw();$('tracker').addEventListener('click',e=>{const d=e.target.closest('.day');if(!d)return;st[d.dataset.k]=!st[d.dataset.k];save('prl_tracker',st);draw()})}
if($('logAdd')){const draw=()=>{const l=load('prl_log',[]);$('logOut').innerHTML=l.length?'<table><tr><th>Date</th><th>Step</th><th>Clean reps</th></tr>'+l.slice(-12).reverse().map(r=>`<tr><td>${r.d}</td><td>${r.s}</td><td>${r.r}</td></tr>`).join('')+'</table>':'<p class="note">No entries yet.</p>'};
 $('logAdd').onclick=()=>{const r=parseInt($('logReps').value,10);if(isNaN(r))return;const l=load('prl_log',[]);l.push({d:new Date().toISOString().slice(0,10),s:$('logStep').value,r});save('prl_log',l);$('logReps').value='';draw()};draw()}
if($('tGo'))$('tGo').onclick=()=>{const w=+$('tWall').value,i=+$('tInc').value,f=+$('tFloor').value;let s,m;
 if(f>=12){s='Floor push-ups';m='You can do more than 12 clean floor reps. Keep the floor version and add difficulty (slower lowering, feet raised) or keep building volume.'}
 else if(f>=8){s='Floor push-ups';m='Start on the floor: 2 to 3 sets of about 8 to 12 clean reps.'}
 else if(i>=12){s='Lower incline';m='Use a lower surface (bench to chair to low step) until floor reps reach 8.'}
 else if(i>=8){s='Incline push-ups';m='Start on the incline: 2 to 3 sets of about 8 to 12 clean reps, then lower the surface.'}
 else if(w>=12){s='Incline push-ups';m='Wall is easy: move to a high incline (table or counter).'}
 else{s='Wall push-ups';m='Start at the wall: palms at chest height, walk your feet back as it gets easy.'}
 $('tOut').hidden=false;$('tOut').innerHTML=`<div class="tag">Suggested starting step</div><h3>${s}</h3><p>${m}</p><p class="note">Our own simple scale, not a medical test. Stop if pain is sharp or lasting.</p>`};
if($('dGo'))$('dGo').onclick=()=>{const kg=+$('dKg').value;if(!kg)return;const g=Math.round(kg*1.6);
 $('dOut').hidden=false;$('dOut').innerHTML=`<div class="tag">Rough guide</div><h3>about ${g} g of protein per day</h3><p>That is 1.6 g per kg (${kg} kg). A guide for healthy adults, not a rule or a prescription. A dietitian or doctor can tailor it if you have a health condition.</p>`};
