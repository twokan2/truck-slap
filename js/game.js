/* ============================================================
   GAME — profiles, garage, build engine, finale, settings, boot
============================================================ */
const $=id=>document.getElementById(id);
let playerName='', current=null, placedCount=0, totalParts=0;
let challengeMode=false, littleMode=false, buildStart=0, timerInt=null, justUnlockedMsg='';
let currentCat='truck', majors=null, minorQueue=[], finishingTouches=false;

function builtMap(){ const p=activeProfile(); return p?p.built:{}; }
function starMap(){ const p=activeProfile(); return p?p.stars:{}; }
const builtCount=cat=>TRUCKS.filter(t=>t.cat===cat&&!t.lockedIf&&builtMap()[t.id]).length;
const isLocked=t=>{
  if(t.lockedIf==='trucks5') return builtCount('truck')<5;
  if(t.lockedIf==='dinos4') return builtCount('dino')<4;
  return false;
};
const allDone=()=>TRUCKS.every(t=>builtMap()[t.id]);

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  $('buildScreen').classList.remove('on');
  $('finale').classList.remove('on');
  if(!id)return;
  $(id).classList.add('on');
}
function assembledSVG(truck,painted){
  if(!painted) return truck.parts.map(p=>`<g>${p.svg}</g>`).join('');
  const p=activeProfile();
  return renderVehicleSVG(truck,p&&p.paint[truck.id],p&&(p.decals||{})[truck.id]);
}

/* ============================================================
   PROFILE PICKER + NAME SCREEN (F1)
============================================================ */
let pendingMode='little';
function openProfilePicker(){
  const wrap=$('profileCards'); wrap.innerHTML='';
  Object.entries(SAVE.profiles).forEach(([id,p])=>{
    const t=TRUCKS.find(x=>x.id===p.lastBuilt)||TRUCKS[0];
    const built=Object.keys(p.built).length;
    const card=document.createElement('div');
    card.className='profileCard';
    card.innerHTML=`<svg viewBox="40 50 740 450">${renderVehicleSVG(t,p.paint[t.id],(p.decals||{})[t.id])}</svg>
      <div class="pname">${p.name}</div>
      <div class="psub">${built?built+' build'+(built>1?'s':''):'New builder'} · ${p.mode==='little'?'🧸 Little':'🔧 Pro'}</div>`;
    card.onclick=()=>{
      setActiveProfile(id); audio(); sndYay();
      onProfileReady();
      say('Welcome back, '+titleCase(p.name)+'!');
    };
    wrap.appendChild(card);
  });
  if(profileCount()<MAX_PROFILES){
    const add=document.createElement('div');
    add.className='profileCard newP';
    add.innerHTML=`<div class="plus">＋</div><div class="pname">NEW BUILDER</div>`;
    add.onclick=()=>{ sndPop(); openNameScreen(); };
    wrap.appendChild(add);
  }
  show('profileScreen');
}
function openNameScreen(){
  $('nameInput').value='';
  pendingMode='little';
  syncModeCards();
  show('nameScreen');
}
function syncModeCards(){
  $('modeLittle').classList.toggle('sel',pendingMode==='little');
  $('modePro').classList.toggle('sel',pendingMode==='pro');
}
$('modeLittle').onclick=()=>{pendingMode='little';sndPop();syncModeCards()};
$('modePro').onclick=()=>{pendingMode='pro';sndPop();syncModeCards()};
$('startBtn').onclick=()=>{
  const name=($('nameInput').value.trim()||'CHAMP').toUpperCase();
  audio(); sndYay();
  createProfile(name,pendingMode);
  onProfileReady();
  say('Welcome, '+titleCase(name)+"! Let's build!");
};
$('nameInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('startBtn').click()});
function onProfileReady(){
  const p=activeProfile();
  playerName=p.name;
  setMuted(!!p.muted);
  $('muteBtn').textContent=muted?'🔇':'🔊';
  $('garageHello').textContent=`PICK YOUR BUILD, ${playerName}!`;
  renderGarage(); show('garageScreen');
  maybeShowInstallHint();
}

/* ============================================================
   GARAGE
============================================================ */
$('tabTruck').onclick=()=>{currentCat='truck';sndPop();renderGarage()};
$('tabDino').onclick=()=>{currentCat='dino';sndPop();renderGarage()};
$('trophyBtn').onclick=()=>{sndPop();openTrophyGarage()};

function renderGarage(){
  $('tabTruck').classList.toggle('on',currentCat==='truck');
  $('tabDino').classList.toggle('on',currentCat==='dino');
  $('masterBadge').classList.toggle('on',allDone());
  if(allDone()) $('masterBadge').textContent=`🏆 MASTER BUILDER ${playerName} — ALL ${TRUCKS.length} BUILDS! 🏆`;
  const p=activeProfile();
  const list=TRUCKS.filter(t=>t.cat===currentCat);
  const anyBuilt=list.some(t=>builtMap()[t.id]);
  $('garageSub').textContent = anyBuilt
    ? (p.mode==='pro'?'Rebuild any finished one to beat the clock for ⭐⭐⭐!':'Tap a finished one to build it again — or paint and drive it!')
    : 'Drag the sticker parts to build it!';
  const grid=$('truckGrid'); grid.innerHTML='';
  list.forEach(t=>{
    const locked=isLocked(t), built=!!builtMap()[t.id];
    const card=document.createElement('div');
    card.className='truckCard'+(built?' built':'')+(locked?' locked':'');
    const stars=starMap()[t.id]?'⭐'.repeat(starMap()[t.id]):(built&&p.mode==='pro'?'⏱ beat the clock!':'');
    const lockMsg=t.lockedIf==='trucks5'?'Build 5 trucks to unlock!':'Build all 4 dinos to unlock!';
    card.innerHTML=`<div class="done">⭐</div><div class="lockIco">🔒</div>
      <svg viewBox="40 50 740 450">${locked?assembledSVG(t):assembledSVG(t,true)}</svg>
      <div class="tname">${locked?'???':t.name}</div>
      <div class="tsub">${locked?lockMsg:t.sub+' · '+t.parts.length+' parts'}</div>
      <div class="stars">${locked?'':stars}</div>
      ${built?`<div class="cardActs">
        <button data-act="paint" aria-label="paint">🎨</button>
        <button data-act="photo" aria-label="photo">📸</button>
        <button data-act="drive" aria-label="drive">🎮</button></div>`:''}`;
    card.onclick=e=>{
      if(locked){sndNope();return;}
      const act=e.target.dataset&&e.target.dataset.act;
      if(act==='paint'){sndPop();openPaintShop(t,'garage');return;}
      if(act==='photo'){sndPop();openPhotoMode(t,'garage');return;}
      if(act==='drive'){sndPop();openDrive(t,'garage');return;}
      (VSOUNDS[t.id]||sndRev)();               // vehicle voice, then open fast
      setTimeout(()=>startBuild(t),260);
    };
    grid.appendChild(card);
  });
}
/* idle wiggle invite (F5) */
setInterval(()=>{
  if(!$('garageScreen').classList.contains('on'))return;
  const cards=[...document.querySelectorAll('.truckCard:not(.locked) svg')];
  if(!cards.length)return;
  const el=cards[Math.floor(Math.random()*cards.length)];
  el.classList.add('wiggle');
  setTimeout(()=>el.classList.remove('wiggle'),900);
},6000);

/* ============================================================
   BUILD MODE (with Little/Pro difficulty — F6)
============================================================ */
const stage=$('stage'), tray=$('tray');
let partBBoxes={};

function startBuild(truck){
  const p=activeProfile();
  current=truck; placedCount=0; finishingTouches=false;
  totalParts=truck.parts.length;
  littleMode=p.mode==='little';
  challengeMode=!littleMode&&!!builtMap()[truck.id];
  buildStart=Date.now();
  clearInterval(timerInt);
  const tm=$('timer');
  tm.classList.toggle('on',challengeMode);
  if(challengeMode){
    tm.textContent='0:00';
    timerInt=setInterval(()=>{const s=Math.floor((Date.now()-buildStart)/1000);
      tm.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');},250);
  }
  $('buildTitle').textContent=truck.name;
  $('progressBar').style.width='0%';
  stage.innerHTML=''; tray.innerHTML='';
  tray.classList.toggle('little',littleMode);
  const meas=document.createElementNS('http://www.w3.org/2000/svg','svg');
  meas.setAttribute('viewBox','0 0 800 520'); meas.style.cssText='position:fixed;left:-9999px;width:800px;height:520px';
  document.body.appendChild(meas);
  partBBoxes={};
  truck.parts.forEach(pt=>{
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.innerHTML=pt.svg; meas.appendChild(g);
    const b=g.getBBox(); partBBoxes[pt.id]={x:b.x,y:b.y,w:b.width,h:b.height,cx:b.x+b.width/2,cy:b.y+b.height/2};
    meas.removeChild(g);
  });
  meas.remove();
  majors=littleMode?majorPartIds(truck,partBBoxes):null;
  minorQueue=littleMode?truck.parts.filter(pt=>!majors.has(pt.id)).map(pt=>pt.id):[];
  truck.parts.forEach(pt=>{
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','ghost'); g.dataset.part=pt.id; g.innerHTML=pt.svg;
    stage.appendChild(g);
  });
  const trayParts=truck.parts.filter(pt=>!littleMode||majors.has(pt.id));
  const shuffled=[...trayParts].sort(()=>Math.random()-.5);
  shuffled.forEach(pt=>{
    const b=partBBoxes[pt.id], pad=8;
    const item=document.createElement('div');
    item.className='trayItem'; item.dataset.part=pt.id;
    item.innerHTML=`<svg viewBox="${b.x-pad} ${b.y-pad} ${b.w+pad*2} ${b.h+pad*2}" preserveAspectRatio="xMidYMid meet">${pt.svg}</svg><div class="lbl">${pt.label}</div>`;
    item.addEventListener('pointerdown',startDrag);
    tray.appendChild(item);
  });
  show('buildScreen');
}

/* ---------- DRAG ---------- */
let drag=null;
function stagePt(clientX,clientY){
  const pt=stage.createSVGPoint(); pt.x=clientX; pt.y=clientY;
  return pt.matrixTransform(stage.getScreenCTM().inverse());
}
function startDrag(e){
  if(drag)return;
  const item=e.currentTarget, pid=item.dataset.part;
  const part=current.parts.find(p=>p.id===pid), b=partBBoxes[pid];
  e.preventDefault();
  const scale=stage.getBoundingClientRect().width/800;
  const w=Math.max(40,b.w*scale), h=Math.max(30,b.h*scale);
  const ghost=document.createElement('div');
  ghost.id='dragGhost';
  ghost.innerHTML=`<svg width="${w}" height="${h}" viewBox="${b.x} ${b.y} ${b.w} ${b.h}">${part.svg}</svg>`;
  document.body.appendChild(ghost);
  item.classList.add('dragging');
  drag={pid,item,ghost,w,h,startRect:item.getBoundingClientRect()};
  moveGhost(e.clientX,e.clientY);
  window.addEventListener('pointermove',onDragMove,{passive:false});
  window.addEventListener('pointerup',onDragEnd);
  window.addEventListener('pointercancel',onDragEnd);
  sndPop();
}
function moveGhost(x,y){ drag.ghost.style.transform=`translate(${x-drag.w/2}px,${y-drag.h-14}px)`; drag.lastX=x; drag.lastY=y; }
function onDragMove(e){ e.preventDefault(); if(drag) moveGhost(e.clientX,e.clientY); }
function onDragEnd(e){
  window.removeEventListener('pointermove',onDragMove);
  window.removeEventListener('pointerup',onDragEnd);
  window.removeEventListener('pointercancel',onDragEnd);
  if(!drag)return;
  const d=drag; drag=null;
  const px=d.lastX??e.clientX, py=(d.lastY??e.clientY)-(d.h/2+14);
  const p=stagePt(px,py);
  const b=partBBoxes[d.pid];
  const dist=Math.hypot(p.x-b.cx,p.y-b.cy);
  let threshold=Math.max(110, Math.max(b.w,b.h)*0.65);
  if(littleMode) threshold*=1.6;            // Little Builder: extra-forgiving snap
  if(dist<threshold){
    d.ghost.remove(); d.item.remove();
    placePart(d.pid,px,py);
  }else{
    const onStage=document.elementFromPoint(px,d.lastY??e.clientY);
    if(onStage && $('stageWrap').contains(onStage)) sndNope();
    const r=d.startRect;
    d.ghost.classList.add('flyback');
    d.ghost.style.transform=`translate(${r.left}px,${r.top}px) scale(.4)`;
    setTimeout(()=>d.ghost.remove(),360);
    d.item.classList.remove('dragging');
  }
}
function placePart(pid,sx,sy,auto){
  const prof=activeProfile();
  const part=current.parts.find(p=>p.id===pid);
  const ghost=stage.querySelector(`.ghost[data-part="${pid}"]`);
  if(ghost)ghost.remove();
  const g=document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('class','placedPart popIn'); g.dataset.part=pid;
  g.style.transformBox='fill-box'; g.style.transformOrigin='center';
  g.innerHTML=tintSVG(part.svg,(prof.paint[current.id]||{})[pid]);   // painted builds keep their colors
  const order=current.parts.map(p=>p.id);
  const myIdx=order.indexOf(pid);
  let ref=null;
  for(const child of stage.querySelectorAll('.placedPart')){
    if(order.indexOf(child.dataset.part)>myIdx){ref=child;break;}
  }
  stage.insertBefore(g,ref);
  placedCount++;
  $('progressBar').style.width=(placedCount/totalParts*100)+'%';
  if(auto){
    sndSparkle();
    const b=partBBoxes[pid];
    svgSparkle(stage,b.cx,b.cy);
  }else{
    sndYay();
    if(sx!==undefined) burst(sx,sy,false);
    cheer(playerName);
    sayPraise(titleCase(playerName),littleMode);
  }
  const trayLeft=tray.querySelectorAll('.trayItem').length;
  if(littleMode&&!finishingTouches&&trayLeft===0&&placedCount<totalParts){
    // majors done → auto-place the fiddly bits with a sparkle shower
    finishingTouches=true;
    cheerText('FINISHING<br><span class="nm">TOUCHES!</span>');
    say('Finishing touches!');
    minorQueue.filter(id=>!stage.querySelector(`.placedPart[data-part="${id}"]`))
      .forEach((id,i)=>setTimeout(()=>placePart(id,undefined,undefined,true),500+i*380));
    return;
  }
  if(placedCount===totalParts) completeBuild();
}
function completeBuild(){
  clearInterval(timerInt);
  const p=activeProfile();
  const trucksWere=builtCount('truck'), dinosWere=builtCount('dino');
  p.built[current.id]=true; p.lastBuilt=current.id;
  justUnlockedMsg='';
  if(!current.lockedIf){
    if(current.cat==='truck'&&trucksWere<5&&builtCount('truck')>=5) justUnlockedMsg='🔓 2 SECRET TRUCKS UNLOCKED IN THE GARAGE!';
    if(current.cat==='dino'&&dinosWere<4&&builtCount('dino')>=4) justUnlockedMsg='🔓 SECRET DINO TRUCK UNLOCKED: REX RIDER!';
  }
  if(challengeMode){
    const secs=(Date.now()-buildStart)/1000, n=current.parts.length;
    const stars=secs<n*4.5?3:secs<n*8?2:1;
    p.stars[current.id]=Math.max(p.stars[current.id]||0,stars);
    current._lastStars=stars; current._lastSecs=Math.round(secs);
  } else { current._lastStars=0; }
  persist();
  say('You built the '+titleCase(current.name)+'! Amazing!');
  setTimeout(()=>runFinale(),1300);
}

/* ============================================================
   FINALE — burnout / rampage, now with headlights, skid marks,
   crash debris + camera shake, painted vehicles
============================================================ */
const fin=$('finale'), fstage=$('finaleStage');
let finRAF=null;
function runFinale(){
  fin.classList.add('on');
  speechSuppressed=true;
  $('finaleBanner').classList.remove('show');
  $('finaleBtns').classList.remove('show');
  const isDino=isDinoVehicle(current);
  fstage.innerHTML=(isDino?dinoScene():truckScene())+victimCar()+`<g id="marksLayer"></g><g id="smokeLayer"></g><g id="finTruck"></g>`;
  const tg=fstage.querySelector('#finTruck');
  const prof=activeProfile();
  let inner=renderVehicleSVG(current,prof.paint[current.id],(prof.decals||{})[current.id]);
  if(current.flip) inner=`<g transform="translate(800,0) scale(-1,1)">${inner}</g>`;
  const beam=isDino?'':`<g id="beamG" opacity="0">
    <polygon points="694,282 1010,236 1010,330 694,314" fill="#fff8d0" opacity=".16"/>
    <polygon points="694,340 1010,330 1010,412 694,366" fill="#fff8d0" opacity=".12"/></g>`;
  const S=0.56, groundY=426;
  const baseY=groundY-472*S;
  tg.innerHTML=`<g id="truckInner" transform="translate(-520,${baseY}) scale(${S})">${beam}${inner}</g>`;
  const truckInner=fstage.querySelector('#truckInner');
  // tag wheels/legs for spin & stomp animation
  let legFlip=true;
  truckInner.querySelectorAll('[data-part]').forEach(g=>{
    const pid=g.dataset.part;
    if(/wheel/i.test(pid)&&!/spare/i.test(pid)) g.classList.add('fwheel');
    else if(/^leg/i.test(pid)){ legFlip=!legFlip; g.classList.add('fleg',legFlip?'A':'B'); }
  });
  const smokeLayer=fstage.querySelector('#smokeLayer');
  const marksLayer=fstage.querySelector('#marksLayer');
  const victim=fstage.querySelector('#victimBody');
  const rw=current.rearWheel;
  const rwx=current.flip? 800-rw[0] : rw[0];
  const smokeColor=isDino?'#caa97a':'#cfd6e4';

  let smoke=[], marks=0;
  function spawnSmoke(tx,n,boost){
    for(let i=0;i<n;i++){
      smoke.push({x:tx+rwx*S+(Math.random()*40-20), y:baseY+rw[1]*S+24+(Math.random()*16-8),
        r:8+Math.random()*10, vx:-(1+Math.random()*2)*(boost?2:1), vy:-(0.4+Math.random()*1), life:1});
    }
  }
  function drawSmoke(){
    smokeLayer.innerHTML=smoke.map(s=>`<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${(s.r*(1.6-s.life)).toFixed(1)}" fill="${smokeColor}" opacity="${(s.life*.55).toFixed(2)}"/>`).join('');
  }
  function skidMark(tx){
    if(marks>46)return; marks++;
    const r=document.createElementNS('http://www.w3.org/2000/svg','rect');
    r.setAttribute('x',(tx+rwx*S-16+Math.random()*8).toFixed(1)); r.setAttribute('y',groundY+20);
    r.setAttribute('width',26); r.setAttribute('height',6); r.setAttribute('rx',3);
    r.setAttribute('fill','#0d1320'); r.setAttribute('opacity','.55');
    marksLayer.appendChild(r);
  }
  function setLegs(on){
    fstage.querySelectorAll('.fleg').forEach(l=>{
      l.classList.toggle('legA',on&&l.classList.contains('A'));
      l.classList.toggle('legB',on&&l.classList.contains('B'));
    });
  }
  function beamOn(){ const b=fstage.querySelector('#beamG'); if(b)b.setAttribute('opacity','1'); }

  let t0=null, crushed=false, midDone=false, done=false, lastStomp=0;
  const carX=700, dur={enter:1200, mid:3200, charge:4800, out:5800};
  const voice=VSOUNDS[current.id]||sndRev;
  voice();
  if(isDino) setLegs(true); else beamOn();
  function frame(ts){
    if(!t0)t0=ts; const t=ts-t0;
    let x=-520, tilt=0, moving=false;
    if(t<dur.enter){ x=-520+(t/dur.enter)*640; moving=true; }
    else if(t<dur.mid){
      if(!midDone){midDone=true;
        if(isDino){ setLegs(false); truckInner.parentElement.classList.add('shaking'); roar(72,1.8,.3); setTimeout(()=>roar(80,1.2,.26),1100); }
        else { fstage.querySelectorAll('.fwheel').forEach(w=>w.classList.add('spinwheel')); truckInner.parentElement.classList.add('shaking'); voice(); setTimeout(voice,1100); sndSkid(1.2); }
      }
      if(isDino){ x=120; }
      else { x=120+((t-dur.enter)/(dur.mid-dur.enter))*50; if(Math.random()<.6) spawnSmoke(x,2,true); if(Math.random()<.45) skidMark(x); }
    }
    else if(t<dur.charge){
      if(truckInner.parentElement.classList.contains('shaking')){truckInner.parentElement.classList.remove('shaking'); if(isDino)setLegs(true);}
      const k=(t-dur.mid)/(dur.charge-dur.mid);
      x=(isDino?120:170)+k*k*900; moving=true;
      if(Math.random()<.4) spawnSmoke(x,1,!isDino);
      const frontX=x+700*S;
      if(frontX>carX+40 && frontX<carX+260){ tilt=isDino?-6:-9; if(!crushed){crushed=true; sndCrash(); if(isDino)roar(66,1.0,.3);
        victim.style.transformBox='fill-box'; victim.style.transformOrigin='center bottom';
        victim.style.transition='transform .25s cubic-bezier(.2,.9,.3,1)';
        victim.style.transform='scaleY(.3) scaleX(1.18)';
        fstage.classList.add('dshake'); setTimeout(()=>fstage.classList.remove('dshake'),350);
        burst(innerWidth*0.7, innerHeight*0.55, false);
      } }
    }
    else { x=(isDino?120:170)+900 + (t-dur.charge)*0.9; moving=true; }
    if(isDino && moving && t-lastStomp>330){ lastStomp=t; sndStomp(); }
    const bob=isDino&&moving? Math.sin(t/85)*7 : (moving?Math.sin(t/45)*1.5:0);
    truckInner.setAttribute('transform',`translate(${x.toFixed(1)},${(baseY+bob+(tilt?-14:0)).toFixed(1)}) scale(${S}) rotate(${tilt} 400 420)`);
    smoke=smoke.filter(s=>s.life>0);
    for(const s of smoke){s.x+=s.vx; s.y+=s.vy; s.life-=.016;}
    drawSmoke();
    if(t<dur.out){ finRAF=requestAnimationFrame(frame); }
    else if(!done){ done=true; megaCelebrate(isDino); }
  }
  finRAF=requestAnimationFrame(frame);
}
function megaCelebrate(isDino){
  startMusic();
  speechSuppressed=false;
  const W=innerWidth,H=innerHeight;
  for(let i=0;i<14;i++){ setTimeout(()=>burst(W*(0.1+Math.random()*0.8), H*(0.1+Math.random()*0.45), true), i*230); }
  const b=$('finaleBanner');
  let extra='';
  if(current._lastStars){
    extra+=`<div style="font-size:clamp(26px,7vw,44px);margin-top:6px">${'⭐'.repeat(current._lastStars)}${'<span style="opacity:.25">⭐</span>'.repeat(3-current._lastStars)}</div>
    <div style="font-family:Nunito;font-weight:900;font-size:clamp(13px,3.5vw,18px);text-shadow:none;color:#ffe9c8">Time: ${current._lastSecs}s</div>`;
  }
  if(justUnlockedMsg){
    extra+=`<div style="font-family:Nunito;font-weight:900;font-size:clamp(15px,4.5vw,24px);margin-top:12px;color:#ffd23f;text-shadow:0 2px 0 #000a">${justUnlockedMsg}</div>`;
    for(let i=0;i<8;i++){ setTimeout(()=>burst(W*Math.random(), H*(0.5+Math.random()*0.3), true), 3200+i*200); }
    say(justUnlockedMsg.includes('REX')?'You unlocked the secret dino truck!':'You unlocked two secret trucks!');
    justUnlockedMsg='';
  }
  if(allDone()&&!current._lastStars){
    extra+=`<div style="font-family:Nunito;font-weight:900;font-size:clamp(15px,4.5vw,24px);margin-top:12px;color:#ffd23f;text-shadow:0 2px 0 #000a">🏆 MASTER BUILDER! EVERY BUILD COMPLETE!</div>`;
  }
  const verb=isDino?'STOMPED IT!':'CRUSHED IT!';
  $('driveBtn').textContent=isDino?'STOMP AROUND! 🦖':'DRIVE IT! 🎮';
  b.innerHTML=`<span class="nm">${playerName}</span>${verb} 🏆<div style="font-family:Nunito;font-weight:900;font-size:clamp(14px,4vw,22px);text-shadow:none;margin-top:10px;color:#ffe9c8">${current.name} — COMPLETE!</div>${extra}`;
  b.classList.add('show');
  setTimeout(()=>$('finaleBtns').classList.add('show'),900);
  sndYay(); setTimeout(sndYay,500); setTimeout(sndYay,1100);
  // the parked hero reacts to pokes while the kid admires it
  attachSurprises(fstage,current);
}
function leaveFinale(){ cancelAnimationFrame(finRAF); stopMusic(); speechSuppressed=false; fin.classList.remove('on'); }
$('againBtn').onclick=()=>{leaveFinale(); sndPop(); startBuild(current)};
$('newTruckBtn').onclick=()=>{leaveFinale(); sndPop(); renderGarage(); show('garageScreen')};
$('paintBtn').onclick=()=>{leaveFinale(); sndPop(); openPaintShop(current,'finale')};
$('photoBtn').onclick=()=>{leaveFinale(); sndPop(); openPhotoMode(current,'finale')};
$('driveBtn').onclick=()=>{leaveFinale(); sndPop(); openDrive(current,'finale')};
$('backBtn').onclick=()=>{clearInterval(timerInt); sndPop(); renderGarage(); show('garageScreen')};
$('muteBtn').onclick=()=>{
  const p=activeProfile();
  setMuted(!muted); if(p){p.muted=muted; persist();}
  $('muteBtn').textContent=muted?'🔇':'🔊';
};

/* ============================================================
   SETTINGS (gear) — voice/sound/mode toggles + parent-gated reset
============================================================ */
$('gearBtn').onclick=()=>{ sndPop(); syncSettings(); $('settingsPanel').classList.add('on'); };
$('settingsClose').onclick=()=>{ sndPop(); $('settingsPanel').classList.remove('on'); };
function syncSettings(){
  const p=activeProfile(); if(!p)return;
  $('setSound').textContent=p.muted?'🔇 Sound: OFF':'🔊 Sound: ON';
  $('setVoice').textContent=p.voice===false?'🤐 Voice: OFF':'🗣 Voice: ON';
  $('setMode').textContent=p.mode==='little'?'🧸 Little Builder':'🔧 Pro Builder';
  $('setWho').textContent='Builder: '+p.name;
}
$('setSound').onclick=()=>{ const p=activeProfile(); setMuted(!muted); p.muted=muted; persist(); $('muteBtn').textContent=muted?'🔇':'🔊'; syncSettings(); };
$('setVoice').onclick=()=>{ const p=activeProfile(); p.voice=p.voice===false; persist(); syncSettings(); if(p.voice)say('Voice is on!'); };
$('setMode').onclick=()=>{ const p=activeProfile(); p.mode=p.mode==='little'?'pro':'little'; persist(); sndPop(); syncSettings(); };
$('setSwitch').onclick=()=>{ sndPop(); $('settingsPanel').classList.remove('on'); openProfilePicker(); };
/* hold-to-erase (parent gate: 3 second press) */
function holdToErase(btn,fn){
  let t=null;
  btn.addEventListener('pointerdown',()=>{
    btn.classList.add('holding');
    t=setTimeout(()=>{ btn.classList.remove('holding'); fn(); },3000);
  });
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>btn.addEventListener(ev,()=>{ btn.classList.remove('holding'); clearTimeout(t); }));
}
holdToErase($('eraseProfile'),()=>{
  deleteProfile(SAVE.activeProfile);
  sndBoing(); $('settingsPanel').classList.remove('on');
  profileCount()?openProfilePicker():openNameScreen();
});
holdToErase($('eraseAll'),()=>{
  resetAllData();
  sndBoing(); $('settingsPanel').classList.remove('on');
  openNameScreen();
});

/* ============================================================
   PWA install hint (F8) — iPad Safari only, one-time
============================================================ */
function maybeShowInstallHint(){
  const isIOSSafari=/iP(ad|hone|od)|Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1&&!window.navigator.standalone;
  if(!isIOSSafari||SAVE.hintDismissed)return;
  $('installHint').classList.add('on');
}
$('hintClose').onclick=()=>{ SAVE.hintDismissed=true; persist(); $('installHint').classList.remove('on'); };

/* ============================================================
   BOOT
============================================================ */
loadSave();
$('heroTruckSvg').innerHTML = assembledSVG(TRUCKS[0]);
if(profileCount()) openProfilePicker(); else openNameScreen();
if('serviceWorker' in navigator){
  addEventListener('load',()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}
