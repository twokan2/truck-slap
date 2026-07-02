/* ============================================================
   PAINT SHOP (F2) — tap a swatch, tap a part. Decals drag to
   reposition, hold to remove. No wrong answers, no undo stack.
============================================================ */
let paintTruck=null, paintSel=null, paintReturn='garage';

const paintStage=document.getElementById('paintStage');

function paintPt(clientX,clientY){
  const pt=paintStage.createSVGPoint(); pt.x=clientX; pt.y=clientY;
  return pt.matrixTransform(paintStage.getScreenCTM().inverse());
}
function profPaint(vid){
  const p=activeProfile();
  if(!p.paint[vid]) p.paint[vid]={};
  return p.paint[vid];
}
function profDecals(vid){
  const p=activeProfile();
  if(!p.decals) p.decals={};
  if(!p.decals[vid]) p.decals[vid]=[];
  return p.decals[vid];
}

function openPaintShop(truck,returnTo){
  paintTruck=truck; paintSel=null; paintReturn=returnTo||'garage';
  document.getElementById('paintTitle').textContent=truck.name;
  renderPaintStage();
  renderPaintTray();
  show('paintShop');
  say("Let's paint it!");
}
function renderPaintStage(){
  const p=activeProfile();
  paintStage.innerHTML=renderVehicleSVG(paintTruck,p.paint[paintTruck.id],profDecals(paintTruck.id));
}
function renderPaintTray(){
  const sw=document.getElementById('swatches');
  sw.innerHTML=PAINT_COLORS.map(c=>`<button class="swatch" data-color="${c}" style="background:${c}" aria-label="paint ${c}"></button>`).join('')
    +`<button class="swatch resetSw" id="resetPaint">↺</button>`;
  const dr=document.getElementById('decalRow');
  dr.innerHTML=Object.entries(DECALS).map(([k,d])=>
    `<button class="swatch decalSw" data-decal="${k}" title="${d.label}"><svg viewBox="-50 -34 100 68">${d.svg}</svg></button>`).join('');
  sw.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>selectSwatch(b,{type:'color',val:b.dataset.color}));
  dr.querySelectorAll('[data-decal]').forEach(b=>b.onclick=()=>selectSwatch(b,{type:'decal',val:b.dataset.decal}));
  document.getElementById('resetPaint').onclick=()=>{
    const p=activeProfile();
    delete p.paint[paintTruck.id];
    if(p.decals) delete p.decals[paintTruck.id];
    persist(); sndSplat(); renderPaintStage();
  };
}
function selectSwatch(btn,sel){
  paintSel=sel; sndPop();
  document.querySelectorAll('.swatch').forEach(b=>b.classList.toggle('sel',b===btn));
}

/* stage interaction: recolor part / drop decal / drag decal / surprises */
let decalDrag=null;
paintStage.addEventListener('pointerdown',e=>{
  // decal hit? (drag to move, hold to remove)
  let el=e.target;
  while(el&&el!==paintStage&&!(el.dataset&&el.dataset.decal!==undefined&&el.classList&&el.classList.contains('decal'))) el=el.parentNode;
  if(el&&el!==paintStage&&el.classList&&el.classList.contains('decal')){
    e.preventDefault();
    const idx=+el.dataset.decal, list=profDecals(paintTruck.id);
    decalDrag={el,idx,moved:false,holdT:setTimeout(()=>{ // hold still = remove
      if(decalDrag&&!decalDrag.moved){
        list.splice(idx,1); persist(); sndBoing(); renderPaintStage(); decalDrag=null;
      }
    },700)};
    const move=ev=>{
      if(!decalDrag)return;
      const pt=paintPt(ev.clientX,ev.clientY);
      const d=list[idx]; if(!d)return;
      if(Math.abs(pt.x-d.x)>6||Math.abs(pt.y-d.y)>6) decalDrag.moved=true;
      d.x=Math.round(pt.x); d.y=Math.round(pt.y);
      el.setAttribute('transform',`translate(${d.x} ${d.y}) scale(${d.s||1}) rotate(${d.r||0})`);
    };
    const up=()=>{
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',up);
      window.removeEventListener('pointercancel',up);
      if(decalDrag){ clearTimeout(decalDrag.holdT); if(decalDrag.moved) persist(); decalDrag=null; }
    };
    window.addEventListener('pointermove',move,{passive:false});
    window.addEventListener('pointerup',up);
    window.addEventListener('pointercancel',up);
    return;
  }

  const pt=paintPt(e.clientX,e.clientY);
  if(paintSel&&paintSel.type==='decal'){
    const list=profDecals(paintTruck.id);
    list.push({d:paintSel.val,x:Math.round(pt.x),y:Math.round(pt.y),s:1.4});
    persist(); sndSplat(); confettiPuff(e.clientX,e.clientY);
    renderPaintStage();
    return;
  }
  // part hit?
  el=e.target;
  while(el&&el!==paintStage&&!(el.dataset&&el.dataset.part)) el=el.parentNode;
  if(el&&el!==paintStage&&el.dataset&&el.dataset.part){
    const pid=el.dataset.part;
    if(paintSel&&paintSel.type==='color'){
      const pm=profPaint(paintTruck.id);
      pm[pid]=paintSel.val; persist();
      const part=paintTruck.parts.find(p=>p.id===pid);
      el.innerHTML=tintSVG(part.svg,paintSel.val);
      sndSplat(); confettiPuff(e.clientX,e.clientY);
    }else{
      // nothing armed → let the vehicle react instead
      doSurprise(paintStage,paintTruck,el,pid);
    }
  }
});
document.getElementById('paintBack').addEventListener('click',()=>{
  sndPop();
  if(paintReturn==='finale'){ show(null); document.getElementById('finale').classList.add('on'); }
  else { renderGarage(); show('garageScreen'); }
});
document.getElementById('paintPhoto').addEventListener('click',()=>{ sndPop(); openPhotoMode(paintTruck,'paint'); });
