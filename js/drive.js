/* ============================================================
   DRIVE MODE (F4) — endless side-scrolling sandbox.
   Real-ish physics: acceleration/friction, ramp launches with
   gravity, wheels that roll at road speed, suspension bob,
   engine RPM that follows the throttle. Hold right half of the
   screen = go right, left half = reverse. That's the whole UI.
============================================================ */
const DRV={
  on:false, truck:null, from:'garage', raf:null,
  wx:0, vx:0, yOff:0, vy:0, air:false, pitch:0, wheels:[], legs:[],
  holdL:false, holdR:false, pointers:{}, props:[], segs:{}, t:0, lastTs:0,
  strideAcc:0, smokeAcc:0, lastSkid:0, shakeT:0, isDino:false, S:0.56, baseY:0,
};
const DRV_GROUND=426, DRV_SEG=1500, DRV_VIEW=1000;

const driveEl=document.getElementById('drive');
const driveStage=document.getElementById('driveStage');

function wrapMod(v,m){ return ((v%m)+m)%m; }

/* ---------- scenery strips (1000 wide, repeat) ---------- */
function farStrip(isDino){
  return isDino
    ? `<path d="M40 426 L210 180 L290 290 L350 220 L470 426 Z M520 426 L640 260 L730 360 L790 300 L900 426 Z" fill="#2a1530"/>
       <path d="M196 200 Q210 168 224 200 Q236 178 218 158 Q200 174 196 200 Z" fill="#ff6b35" opacity=".95"/>`
    : `<path d="M0 330 L0 250 L60 250 L60 290 L130 290 L130 210 L200 210 L200 300 L280 300 L280 240 L350 240 L350 310 L430 310 L430 260 L520 260 L520 300 L600 300 L600 230 L680 230 L680 310 L770 310 L770 270 L860 270 L860 320 L1000 320 L1000 330 Z" fill="#161f45"/>`;
}
function midStrip(isDino){
  return isDino
    ? `<path d="M160 426 Q166 330 196 312 Q188 368 192 426 Z" fill="#1d2e1a"/><path d="M196 316 Q160 294 142 304 Q170 308 194 322 Z M196 316 Q232 290 252 302 Q222 306 198 322 Z" fill="#2f5d2a"/>
       <path d="M700 426 Q704 350 728 336 Q720 382 724 426 Z" fill="#1d2e1a"/><path d="M728 340 Q698 322 682 330 Q706 334 726 344 Z" fill="#2f5d2a"/>`
    : `<g><rect x="180" y="300" width="10" height="126" fill="#111827"/><rect x="150" y="292" width="70" height="14" rx="7" fill="#374151"/><circle cx="158" cy="306" r="9" fill="#ffe9a8" opacity=".9"/></g>
       <g><rect x="700" y="300" width="10" height="126" fill="#111827"/><rect x="670" y="292" width="70" height="14" rx="7" fill="#374151"/><circle cx="678" cy="306" r="9" fill="#ffe9a8" opacity=".9"/></g>`;
}

/* ---------- props ---------- */
function propSVG(p){
  switch(p.type){
    case 'car': return victimCarBody(p.hue);
    case 'ramp': return `<polygon points="0,0 190,0 190,-85" fill="#94a3b8" stroke="#1a2233" stroke-width="5" stroke-linejoin="round"/><line x1="46" y1="0" x2="190" y2="-64" stroke="#64748b" stroke-width="4"/><line x1="96" y1="0" x2="190" y2="-42" stroke="#64748b" stroke-width="4"/>`;
    case 'cone': return `<g class="pc" data-i="0">${coneSVG(0)}</g><g class="pc" data-i="1">${coneSVG(56)}</g><g class="pc" data-i="2">${coneSVG(112)}</g>`;
    case 'barrels': return `<g class="pc" data-i="0">${barrelSVG(0)}</g><g class="pc" data-i="1">${barrelSVG(62)}</g><g class="pc" data-i="2">${barrelSVG(124)}</g>`;
    case 'bush': return `<path d="M0 0 Q-8 -46 24 -52 Q36 -74 62 -64 Q88 -70 94 -44 Q112 -30 100 -8 Q96 0 88 0 Z" fill="#2f5d2a" stroke="#1a2233" stroke-width="5" stroke-linejoin="round"/><circle cx="34" cy="-38" r="6" fill="#4a8a42"/><circle cx="66" cy="-48" r="6" fill="#4a8a42"/>`;
  }
  return '';
}
function coneSVG(dx){ return `<polygon points="${dx+22},-52 ${dx+44},0 ${dx},0" fill="#f97316" stroke="#1a2233" stroke-width="4" stroke-linejoin="round"/><rect x="${dx+8}" y="-30" width="28" height="9" fill="#fff"/>`; }
function barrelSVG(dx){ return `<rect x="${dx}" y="-72" width="52" height="72" rx="10" fill="#3b82f6" stroke="#1a2233" stroke-width="5"/><rect x="${dx}" y="-52" width="52" height="12" fill="#93c5fd"/><rect x="${dx}" y="-30" width="52" height="12" fill="#93c5fd"/>`; }
function victimCarBody(hue){
  const c=['#2dd4bf','#f472b6','#fbbf24','#a78bfa'][hue%4];
  return `<g class="carBody"><path d="M0 -16 Q4 -44 34 -48 L56 -78 Q62 -88 76 -88 L128 -88 Q142 -88 148 -78 L168 -48 Q196 -44 200 -16 L200 0 L0 0 Z" fill="${c}" stroke="#1a2233" stroke-width="5" stroke-linejoin="round"/>
  <path d="M66 -78 L124 -78 L140 -50 L56 -50 Z" fill="#bae6fd" stroke="#1a2233" stroke-width="4"/>
  <circle cx="46" cy="0" r="22" fill="#222a38" stroke="#1a2233" stroke-width="5"/><circle cx="46" cy="0" r="10" fill="#cdd6e3"/>
  <circle cx="154" cy="0" r="22" fill="#222a38" stroke="#1a2233" stroke-width="5"/><circle cx="154" cy="0" r="10" fill="#cdd6e3"/></g>`;
}

function genSegment(si){
  if(DRV.segs[si]) return;
  DRV.segs[si]=[];
  const base=si*DRV_SEG;
  const kinds=['car','ramp','cone','barrels','bush','car'];
  const n=2+Math.floor(Math.random()*2);
  const used=[];
  for(let i=0;i<n;i++){
    let x=base+150+Math.random()*(DRV_SEG-400);
    if(used.some(u=>Math.abs(u-x)<330)){ continue; }
    used.push(x);
    const type=kinds[Math.floor(Math.random()*kinds.length)];
    const p={type,x,hue:Math.floor(Math.random()*4),done:false,hits:{},el:null,seg:si};
    p.el=document.createElementNS(NSVG,'g');
    p.el.setAttribute('transform',`translate(${x} ${DRV_GROUND})`);
    p.el.innerHTML=propSVG(p);
    document.getElementById('dvProps').appendChild(p.el);
    DRV.props.push(p);
    DRV.segs[si].push(p);
  }
}
function pruneSegments(camX){
  for(const si of Object.keys(DRV.segs)){
    const base=si*DRV_SEG;
    if(base<camX-DRV_SEG*2.5||base>camX+DRV_SEG*3.5){
      DRV.segs[si].forEach(p=>{ p.el.remove(); const i=DRV.props.indexOf(p); if(i>=0)DRV.props.splice(i,1); });
      delete DRV.segs[si];   // revisiting regenerates fresh, uncrushed props
    }
  }
}

/* ---------- vehicle assembly ---------- */
function buildDriveVehicle(truck){
  const p=activeProfile();
  let inner=renderVehicleSVG(truck,p.paint[truck.id],(p.decals||{})[truck.id]);
  if(truck.flip) inner=`<g transform="translate(800,0) scale(-1,1)">${inner}</g>`;
  document.getElementById('dvVehInner').innerHTML=inner;
  DRV.wheels=[]; DRV.legs=[];
  document.querySelectorAll('#dvVehInner [data-part]').forEach(g=>{
    const pid=g.dataset.part;
    if(/wheel/i.test(pid)&&!/spare/i.test(pid)){
      g.style.transformBox='fill-box'; g.style.transformOrigin='center';
      let r=36; try{ r=g.getBBox().width/2; }catch(e){}
      DRV.wheels.push({g,r,angle:0});
    }else if(/^leg/i.test(pid)){
      g.classList.add(DRV.legs.length%2?'dlegB':'dlegA');
      DRV.legs.push(g);
    }
  });
}

/* ---------- open / close ---------- */
function openDrive(truck,from){
  DRV.on=true; DRV.truck=truck; DRV.from=from||'garage';
  DRV.isDino=isDinoVehicle(truck);
  DRV.wx=0; DRV.vx=0; DRV.yOff=0; DRV.vy=0; DRV.air=false; DRV.pitch=0;
  DRV.props=[]; DRV.segs={}; DRV.holdL=DRV.holdR=false; DRV.pointers={};
  DRV.t=0; DRV.lastTs=0; DRV.strideAcc=0;
  DRV.S=0.56; DRV.baseY=DRV_GROUND-472*DRV.S;
  speechSuppressed=true;
  const isDino=DRV.isDino;
  const sky=isDino
    ? `<defs><linearGradient id="dvG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1038"/><stop offset=".55" stop-color="#5b2a52"/><stop offset="1" stop-color="#b14b32"/></linearGradient></defs>`
    : `<defs><linearGradient id="dvG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1230"/><stop offset=".62" stop-color="#1b2a5e"/><stop offset="1" stop-color="#2c3f7a"/></linearGradient></defs>`;
  const stars=Array.from({length:34},()=>`<circle cx="${Math.random()*1000}" cy="${Math.random()*260}" r="${1+Math.random()*1.5}" fill="#fff" opacity="${.3+Math.random()*.6}"/>`).join('');
  driveStage.innerHTML=`${sky}<rect width="1000" height="560" fill="url(#dvG)"/>${stars}
    ${isDino?'<circle cx="820" cy="150" r="52" fill="#ffe9a8" opacity=".9"/>':''}
    <g id="dvFar"><g>${farStrip(isDino)}</g><g transform="translate(1000 0)">${farStrip(isDino)}</g><g transform="translate(2000 0)">${farStrip(isDino)}</g></g>
    <g id="dvMid"><g>${midStrip(isDino)}</g><g transform="translate(1000 0)">${midStrip(isDino)}</g><g transform="translate(2000 0)">${midStrip(isDino)}</g></g>
    <rect y="${DRV_GROUND}" width="1000" height="134" fill="${isDino?'#4a2e1d':'#252b3e'}"/>
    <rect y="${DRV_GROUND}" width="1000" height="8" fill="${isDino?'#2a1810':'#11151f'}"/>
    <g id="dvDash">${Array.from({length:12},(_,i)=>`<rect x="${i*110}" y="492" width="56" height="8" rx="4" fill="#f4d35e" opacity="${isDino?0.35:0.85}"/>`).join('')}</g>
    <g id="dvProps"></g>
    <g id="dvFx"></g>
    <g id="dvVeh"><g id="dvVehInner"></g></g>`;
  buildDriveVehicle(truck);
  driveEl.classList.add('on');
  document.getElementById('driveHints').classList.add('show');
  setTimeout(()=>document.getElementById('driveHints').classList.remove('show'),3500);
  if(!isDino){ engineStart(); sndRev(); } else { roar(84,1.2,.22); }
  DRV.raf=requestAnimationFrame(driveFrame);
}
function closeDrive(){
  DRV.on=false;
  cancelAnimationFrame(DRV.raf);
  engineStop();
  speechSuppressed=false;
  driveEl.classList.remove('on');
  sndPop();
  if(DRV.from==='finale'){ document.getElementById('finale').classList.add('on'); }
  else { renderGarage(); show('garageScreen'); }
}

/* ---------- input: hold right half → forward, left half → reverse ---------- */
function drvRecount(){
  let l=false,r=false;
  Object.values(DRV.pointers).forEach(s=>{ if(s==='L')l=true; else r=true; });
  DRV.holdL=l; DRV.holdR=r;
}
driveEl.addEventListener('pointerdown',e=>{
  if(e.target.closest&&e.target.closest('#driveDone'))return;
  DRV.pointers[e.pointerId]=(e.clientX<innerWidth/2)?'L':'R';
  drvRecount();
});
['pointerup','pointercancel'].forEach(ev=>driveEl.addEventListener(ev,e=>{ delete DRV.pointers[e.pointerId]; drvRecount(); }));
document.getElementById('driveDone').addEventListener('click',closeDrive);

/* ---------- physics + render loop ---------- */
function drvScreenPos(wxPt,wyPt){
  // world→client coords for canvas fireworks (viewBox slice mapping)
  const r=driveStage.getBoundingClientRect();
  const sc=Math.max(r.width/1000,r.height/560);
  return {x:r.left+r.width/2+(wxPt-500)*sc, y:r.top+r.height/2+(wyPt-280)*sc};
}
function driveFrame(ts){
  if(!DRV.on)return;
  if(!DRV.lastTs)DRV.lastTs=ts;
  let dt=Math.min((ts-DRV.lastTs)/1000,.05); DRV.lastTs=ts; DRV.t+=dt;
  const D=DRV, veh={front:D.wx+430, back:D.wx+30, cx:D.wx+230};

  /* throttle */
  const ACC=760, REV=-520, FRIC=420, VMAX=640, VMIN=-330;
  if(D.holdR) D.vx+=ACC*dt;
  else if(D.holdL) D.vx+=REV*dt;
  else D.vx-=Math.sign(D.vx)*Math.min(FRIC*dt,Math.abs(D.vx));
  D.vx=Math.max(VMIN,Math.min(VMAX,D.vx));

  /* burnout: hard throttle at low speed → skid + smoke */
  if(!D.isDino&&D.holdR&&Math.abs(D.vx)<170&&D.t-D.lastSkid>.5){
    D.lastSkid=D.t; sndSkid(.4);
    svgPuff(document.getElementById('dvFx'),340+40,DRV_GROUND-6,'#cfd6e4');
  }

  /* ramps & gravity */
  let groundOff=0, slopePitch=0;
  if(!D.air){
    for(const p of D.props){
      if(p.type!=='ramp')continue;
      const rel=veh.cx-p.x;
      if(rel>0&&rel<190){ groundOff=-85*(rel/190); slopePitch=-15; }
      if(rel>=190&&rel<210&&D.yOff>-84&&D.vx>220){ // launched off the lip
        D.air=true; D.vy=-Math.abs(D.vx)*0.45; D.yOff=-85;
        sndBoing();
      }
    }
    if(!D.air) D.yOff=groundOff;
  }else{
    D.vy+=1500*dt; D.yOff+=D.vy*dt;
    slopePitch=Math.max(-14,Math.min(10,D.vy*.02));
    if(D.yOff>=0){ // touchdown
      D.air=false; D.yOff=0; D.vy=0; sndThump();
      svgPuff(document.getElementById('dvFx'),340+60,DRV_GROUND-4,D.isDino?'#caa97a':'#8a93a3');
      const inner=document.getElementById('dvVehInner');
      inner.style.transformBox='fill-box';
      inner.animate([{transform:'scaleY(.94) translateY(6px)'},{transform:'scaleY(1) translateY(0)'}],{duration:220,easing:'ease-out'});
    }
  }

  D.wx+=D.vx*dt;
  const camX=D.wx-110;

  /* engine / footsteps */
  const spd=Math.abs(D.vx);
  if(!D.isDino){ engineSpeed(spd/VMAX); }
  else{
    D.strideAcc+=spd*dt;
    if(D.strideAcc>150&&spd>30){ D.strideAcc=0; sndStomp(); }
    const dur=spd>25?Math.max(.16,Math.min(.6,150/spd)):0;
    D.legs.forEach(l=>{
      l.style.animationDuration=dur?dur+'s':'';
      l.style.animationPlayState=dur?'running':'paused';
    });
  }

  /* dust while accelerating on dirt */
  D.smokeAcc+=dt;
  if(spd>420&&D.smokeAcc>.28){ D.smokeAcc=0; svgPuff(document.getElementById('dvFx'),300,DRV_GROUND-6,D.isDino?'#caa97a':'#3a4460'); }

  /* prop interactions */
  for(const p of D.props){
    if(p.done)continue;
    if(p.type==='car'){
      if(spd>150&&((D.vx>0&&Math.abs(veh.front-(p.x+40))<58)||(D.vx<0&&Math.abs(veh.back-(p.x+170))<58))){
        p.done=true;
        const body=p.el.querySelector('.carBody');
        body.style.transformBox='fill-box'; body.style.transformOrigin='center bottom';
        body.animate([{transform:'scaleY(1)'},{transform:'scaleY(.28) scaleX(1.16)'}],{duration:240,easing:'cubic-bezier(.2,.9,.3,1)',fill:'forwards'});
        sndCrash();
        const sp=drvScreenPos(p.x+100,DRV_GROUND-40);
        burst(sp.x,sp.y,false);
        driveStage.classList.remove('dshake'); void driveStage.getBoundingClientRect(); driveStage.classList.add('dshake');
        setTimeout(()=>driveStage.classList.remove('dshake'),320);
        D.vx*=.86;
      }
    }else if(p.type==='cone'||p.type==='barrels'||p.type==='bush'){
      const w=p.type==='bush'?100:160;
      if(spd>60&&veh.front>p.x-10&&veh.back<p.x+w+10){
        p.done=true;
        const bits=p.el.querySelectorAll('.pc');
        if(p.type==='bush'){
          sndBoing();
          p.el.style.transformBox='fill-box'; p.el.style.transformOrigin='center bottom';
          p.el.animate([{transform:'rotate(0deg) scale(1)'},{transform:`rotate(${D.vx>0?14:-14}deg) scale(1.06)`},{transform:'rotate(0deg) scale(1)'}],{duration:500});
        }else bits.forEach((b,i)=>{
          setTimeout(()=>{
            (p.type==='cone'?sndBoing:sndClonk)();
            b.style.transformBox='fill-box'; b.style.transformOrigin='center bottom';
            const dir=D.vx>0?1:-1;
            b.animate([
              {transform:'translate(0,0) rotate(0deg)'},
              {transform:`translate(${dir*(90+i*40)}px,-${70+Math.random()*50}px) rotate(${dir*220}deg)`,offset:.55},
              {transform:`translate(${dir*(130+i*55)}px,4px) rotate(${dir*340}deg)`}
            ],{duration:620,easing:'cubic-bezier(.3,.6,.6,1)',fill:'forwards'});
          },i*90);
        });
      }
    }
  }

  /* world gen */
  const si=Math.floor(camX/DRV_SEG);
  for(let k=si-1;k<=si+2;k++) genSegment(k);
  pruneSegments(camX);

  /* render: parallax + props + vehicle */
  document.getElementById('dvFar').setAttribute('transform',`translate(${-wrapMod(camX*.18,1000)} 0)`);
  document.getElementById('dvMid').setAttribute('transform',`translate(${-wrapMod(camX*.5,1000)} 0)`);
  document.getElementById('dvDash').setAttribute('transform',`translate(${-wrapMod(camX,110)} 0)`);
  document.getElementById('dvProps').setAttribute('transform',`translate(${-camX} 0)`);
  document.getElementById('dvFx').setAttribute('transform',`translate(0 0)`);

  const bob=D.isDino? (spd>25?Math.sin(D.t*spd*.045)*6:0) : (spd>40?Math.sin(D.t*17)*1.6:0);
  const accelPitch=D.holdR?-2.4:(D.holdL?1.8:0);
  const pitch=slopePitch+(D.air?slopePitch:accelPitch);
  document.getElementById('dvVeh').setAttribute('transform',
    `translate(${D.wx-camX} ${D.baseY+D.yOff+bob}) scale(${D.S}) rotate(${pitch} 400 440)`);

  /* wheels roll with the road */
  for(const w of DRV.wheels){
    w.angle+=(D.vx*dt)/(w.r*D.S);
    w.g.style.transform=`rotate(${w.angle}rad)`;
  }

  DRV.raf=requestAnimationFrame(driveFrame);
}
