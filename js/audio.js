/* ============================================================
   AUDIO — 100% synthesized WebAudio. AudioContext is created
   lazily on first user gesture (iOS requirement).
============================================================ */
let muted=false, AC=null;
function audio(){ if(!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){} } return AC; }
function tone(f1,f2,dur,type='sine',vol=.18,delay=0){
  if(muted)return; const ac=audio(); if(!ac)return;
  const t=ac.currentTime+delay;
  const o=ac.createOscillator(), g=ac.createGain();
  o.type=type; o.frequency.setValueAtTime(f1,t);
  o.frequency.exponentialRampToValueAtTime(Math.max(f2,1),t+dur);
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t+dur);
}
const sndPop=()=>{tone(520,180,.16,'square',.14)};
const sndYay=()=>{tone(420,840,.22,'triangle',.2); tone(560,1100,.25,'triangle',.18,.12)};
const sndBoom=()=>{tone(160,40,.5,'sawtooth',.16)};
const sndNope=()=>{tone(240,120,.22,'square',.1)};
const sndRev=()=>{tone(70,210,.9,'sawtooth',.22)};
const sndStomp=()=>{tone(95,32,.2,'sine',.3)};

function holdTone(type,f,dur,vol,wob){
  if(muted)return; const ac=audio(); if(!ac)return;
  const o=ac.createOscillator(),g=ac.createGain();
  o.type=type; o.frequency.value=f;
  if(wob){const l=ac.createOscillator(),lg=ac.createGain();l.frequency.value=wob;lg.gain.value=f*.06;l.connect(lg).connect(o.frequency);l.start();l.stop(ac.currentTime+dur);}
  g.gain.setValueAtTime(.001,ac.currentTime); g.gain.linearRampToValueAtTime(vol,ac.currentTime+.06);
  g.gain.setValueAtTime(vol,ac.currentTime+dur-.12); g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+dur);
  o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime+dur);
}
function sirenWail(dur){
  if(muted)return; const ac=audio(); if(!ac)return;
  const o=ac.createOscillator(),g=ac.createGain();
  o.type='triangle'; const t=ac.currentTime;
  for(let i=0;i<dur*2;i++){o.frequency.setValueAtTime(620,t+i*.5);o.frequency.linearRampToValueAtTime(930,t+i*.5+.25);o.frequency.linearRampToValueAtTime(620,t+i*.5+.5);}
  g.gain.setValueAtTime(.16,t); g.gain.setValueAtTime(.16,t+dur-.15); g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(g).connect(ac.destination); o.start(); o.stop(t+dur);
}
function roar(base=78,dur=1.5,vol=.26){
  if(muted)return; const ac=audio(); if(!ac)return;
  const t=ac.currentTime;
  const o=ac.createOscillator(),g=ac.createGain();
  o.type='sawtooth'; o.frequency.setValueAtTime(base,t);
  o.frequency.linearRampToValueAtTime(base*1.5,t+dur*.3);
  o.frequency.exponentialRampToValueAtTime(base*.6,t+dur);
  const l=ac.createOscillator(),lg=ac.createGain(); l.frequency.value=15; lg.gain.value=base*.35;
  l.connect(lg).connect(o.frequency); l.start(t); l.stop(t+dur);
  g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(vol,t+.08);
  g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t+dur);
  // breathy growl layer
  const n=ac.createBufferSource(); n.buffer=noiseBuf(ac,dur);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=420;
  const ng=ac.createGain(); ng.gain.setValueAtTime(vol*.5,t); ng.gain.exponentialRampToValueAtTime(.001,t+dur);
  n.connect(lp).connect(ng).connect(ac.destination); n.start(t);
}
function jingle(){
  const notes=[523,659,784,1046,784,659,523,659,784];
  notes.forEach((f,i)=>tone(f,f,.16,'square',.12,i*.17));
}
const VSOUNDS={
  trail(){ tone(60,260,1.2,'sawtooth',.22); tone(80,300,1.0,'sawtooth',.2,.7); },
  mega(){ holdTone('sawtooth',46,1.6,.24,9); tone(40,200,1.4,'sawtooth',.25,.6); },
  volt(){ tone(180,1500,1.8,'sine',.16); tone(184,1510,1.8,'triangle',.09); },
  rig(){ holdTone('sawtooth',233,1.2,.16); holdTone('sawtooth',311,1.2,.16); },
  fire(){ sirenWail(3.5); },
  garbage(){ holdTone('sawtooth',58,1.6,.2,7); tone(300,720,.9,'sine',.1,.4); tone(720,300,.9,'sine',.1,1.3); },
  icecream(){ jingle(); },
  tow(){ tone(65,240,1.1,'sawtooth',.22); tone(900,600,.07,'square',.08,.5); tone(880,560,.07,'square',.08,.68); tone(920,600,.07,'square',.08,.86); },
  rocket(){ tone(70,1100,1.8,'sawtooth',.2); tone(90,1300,1.2,'square',.12,.4); },
  gold(){ holdTone('sawtooth',50,1.5,.24,8); tone(45,220,1.3,'sawtooth',.24,.65); },
  trex(){ roar(78,1.7,.28); },
  trike(){ roar(105,1.3,.24); tone(220,140,.4,'triangle',.14,1.0); },
  stego(){ roar(92,1.4,.22); },
  bronto(){ holdTone('sine',105,1.8,.26,5); tone(105,62,1.2,'sine',.22,.9); },
  rexrider(){ roar(70,1.4,.26); tone(40,210,1.3,'sawtooth',.24,.8); }
};

/* ---------- finale music: heavy industrial stomp ---------- */
let music={on:false,timer:null,master:null};
function distCurve(k){const n=256,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i*2/n-1;c[i]=(3+k)*x*20*(Math.PI/180)/(Math.PI+k*Math.abs(x));}return c;}
function noiseBuf(ac,dur){const b=ac.createBuffer(1,Math.max(1,ac.sampleRate*dur),ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b;}
function startMusic(){
  const ac=audio(); if(!ac||music.on)return;
  music.on=true;
  const master=ac.createGain(); master.gain.value= muted?0:.55; master.connect(ac.destination);
  music.master=master;
  const sh=ac.createWaveShaper(); sh.curve=distCurve(90); sh.oversample='2x';
  const shG=ac.createGain(); shG.gain.value=.30; sh.connect(shG).connect(master);
  const bpm=104, eighth=60/bpm/2;
  const riff=[0,0,3,0,6,5,3,1, 0,0,3,0,8,6,5,3];
  function bar(t0){
    for(let i=0;i<16;i++){
      const t=t0+i*eighth, f=55*Math.pow(2,riff[i]/12);
      const o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain();
      o.type='sawtooth';o.frequency.value=f; o2.type='square';o2.frequency.value=f/2;
      g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.9,t+.012);
      g.gain.exponentialRampToValueAtTime(.02,t+eighth*.85);
      o.connect(g);o2.connect(g);g.connect(sh);
      o.start(t);o.stop(t+eighth);o2.start(t);o2.stop(t+eighth);
      if(i%4===0||i===10){const k=ac.createOscillator(),kg=ac.createGain();k.type='sine';
        k.frequency.setValueAtTime(130,t);k.frequency.exponentialRampToValueAtTime(38,t+.13);
        kg.gain.setValueAtTime(.8,t);kg.gain.exponentialRampToValueAtTime(.001,t+.16);
        k.connect(kg).connect(master);k.start(t);k.stop(t+.18);}
      if(i%4===2){const s=ac.createBufferSource();s.buffer=noiseBuf(ac,.15);
        const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1900;bp.Q.value=.8;
        const sg=ac.createGain();sg.gain.setValueAtTime(.35,t);sg.gain.exponentialRampToValueAtTime(.001,t+.13);
        s.connect(bp).connect(sg).connect(master);s.start(t);}
      if(i%2===1){const h=ac.createBufferSource();h.buffer=noiseBuf(ac,.05);
        const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=7000;
        const hg=ac.createGain();hg.gain.setValueAtTime(.08,t);hg.gain.exponentialRampToValueAtTime(.001,t+.05);
        h.connect(hp).connect(hg).connect(master);h.start(t);}
    }
  }
  const barLen=16*eighth;
  let next=ac.currentTime+.05;
  bar(next); bar(next+barLen);
  next+=barLen*2;
  music.timer=setInterval(()=>{ if(!music.on)return; bar(next); bar(next+barLen); next+=barLen*2; },barLen*2000-120);
}
function stopMusic(){
  music.on=false;
  if(music.timer){clearInterval(music.timer);music.timer=null;}
  if(music.master){const m=music.master,ac=AC; try{m.gain.setValueAtTime(m.gain.value,ac.currentTime);m.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.4);}catch(e){} setTimeout(()=>{try{m.disconnect()}catch(e){}},500); music.master=null;}
}

/* ============================================================
   NEW v4 SOUNDS
============================================================ */
const sndSplat=()=>{tone(300,90,.12,'triangle',.16); tone(520,140,.16,'sine',.1,.02)};
const sndSparkle=()=>{tone(1200,2400,.14,'sine',.08); tone(1600,3200,.16,'sine',.06,.06)};
const sndSqueak=()=>{tone(1400,900,.09,'square',.07); tone(1500,950,.08,'square',.06,.1)};
const sndPutt=()=>{tone(90,55,.09,'square',.16); tone(95,60,.09,'square',.14,.13); tone(88,52,.1,'square',.12,.27)};
const sndChomp=()=>{tone(220,60,.12,'square',.2); tone(90,40,.14,'sine',.24,.09)};
const sndBlink=()=>{tone(900,1400,.07,'sine',.08)};
const sndClonk=()=>{tone(180,70,.18,'triangle',.2)};
const sndBoing=()=>{tone(280,700,.18,'sine',.16); tone(700,320,.2,'sine',.12,.16)};
const sndShutter=()=>{tone(1800,600,.05,'square',.12); tone(500,1500,.06,'square',.1,.07)};
const sndThump=()=>{tone(110,35,.16,'sine',.28)};
function sndAirHorn(){ holdTone('sawtooth',233,.7,.18); holdTone('sawtooth',311,.7,.18); }
function sndSirenBlip(){ if(muted)return; const ac=audio(); if(!ac)return;
  const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;
  o.type='triangle'; o.frequency.setValueAtTime(620,t); o.frequency.linearRampToValueAtTime(930,t+.22); o.frequency.linearRampToValueAtTime(620,t+.44);
  g.gain.setValueAtTime(.15,t); g.gain.exponentialRampToValueAtTime(.001,t+.5);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t+.5);
}
function sndJingleBar(){ [523,659,784,659].forEach((f,i)=>tone(f,f,.15,'square',.11,i*.15)); }
function sndFanfare(){ [392,523,659,784].forEach((f,i)=>tone(f,f*1.01,.22,'triangle',.16,i*.14)); tone(1046,1046,.5,'triangle',.14,.56); }
function sndCrash(){
  if(muted)return; const ac=audio(); if(!ac)return; const t=ac.currentTime;
  const n=ac.createBufferSource(); n.buffer=noiseBuf(ac,.4);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(3200,t); lp.frequency.exponentialRampToValueAtTime(220,t+.35);
  const g=ac.createGain(); g.gain.setValueAtTime(.4,t); g.gain.exponentialRampToValueAtTime(.001,t+.4);
  n.connect(lp).connect(g).connect(ac.destination); n.start(t);
  tone(120,30,.5,'sine',.3);
}
function sndSkid(dur=.5){
  if(muted)return; const ac=audio(); if(!ac)return; const t=ac.currentTime;
  const n=ac.createBufferSource(); n.buffer=noiseBuf(ac,dur);
  const bp=ac.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2600; bp.Q.value=2.5;
  const g=ac.createGain(); g.gain.setValueAtTime(.12,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
  n.connect(bp).connect(g).connect(ac.destination); n.start(t);
}

/* Continuous engine loop whose RPM follows drive speed (realism) */
const engine={on:false,osc:null,osc2:null,gain:null,lp:null,noise:null,ng:null};
function engineStart(){
  const ac=audio(); if(!ac||engine.on||muted)return;
  engine.on=true;
  const g=ac.createGain(); g.gain.value=.0001;
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=260; lp.Q.value=1.2;
  const o=ac.createOscillator(); o.type='sawtooth'; o.frequency.value=42;
  const o2=ac.createOscillator(); o2.type='square'; o2.frequency.value=21;
  const og=ac.createGain(); og.gain.value=.55; const og2=ac.createGain(); og2.gain.value=.3;
  o.connect(og).connect(lp); o2.connect(og2).connect(lp);
  const n=ac.createBufferSource(); n.buffer=noiseBuf(ac,2); n.loop=true;
  const nf=ac.createBiquadFilter(); nf.type='lowpass'; nf.frequency.value=140;
  const ng=ac.createGain(); ng.gain.value=.16; n.connect(nf).connect(ng).connect(lp);
  lp.connect(g).connect(ac.destination);
  o.start(); o2.start(); n.start();
  g.gain.linearRampToValueAtTime(.14,ac.currentTime+.25);
  Object.assign(engine,{osc:o,osc2:o2,gain:g,lp,noise:n,ng});
}
/* s: 0 idle → 1 flat out */
function engineSpeed(s){
  if(!engine.on)return; const ac=AC; if(!ac)return;
  const f=42+s*150, t=ac.currentTime;
  engine.osc.frequency.setTargetAtTime(f,t,.08);
  engine.osc2.frequency.setTargetAtTime(f/2,t,.08);
  engine.lp.frequency.setTargetAtTime(260+s*1400,t,.08);
  engine.gain.gain.setTargetAtTime(.12+s*.1,t,.1);
}
function engineStop(){
  if(!engine.on)return; engine.on=false;
  const ac=AC;
  try{
    engine.gain.gain.setTargetAtTime(.0001,ac.currentTime,.12);
    const e={...engine};
    setTimeout(()=>{['osc','osc2','noise'].forEach(k=>{try{e[k].stop()}catch(x){}}); try{e.gain.disconnect()}catch(x){}},400);
  }catch(e){}
  engine.osc=engine.osc2=engine.gain=engine.lp=engine.noise=null;
}

/* per-vehicle horn/tap sound (F5) */
const HORNS={
  fire:sndSirenBlip, tow:()=>{tone(600,600,.12,'square',.14); tone(600,600,.12,'square',.14,.16)},
  icecream:sndJingleBar, rig:sndAirHorn, garbage:sndAirHorn, gold:sndAirHorn,
};
function hornFor(id){ return HORNS[id]||(()=>{tone(440,430,.18,'square',.16); tone(440,430,.14,'square',.14,.22)}); }

function setMuted(m){
  muted=m;
  if(music.master&&AC) music.master.gain.value=m?0:.55;
  if(m) engineStop();
  if(m && window.speechSynthesis) try{speechSynthesis.cancel()}catch(e){}
}
