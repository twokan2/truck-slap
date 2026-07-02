/* ============================================================
   FX — fireworks / confetti canvas + cheer banner
============================================================ */
const fx=document.getElementById('fxCanvas'), fctx=fx.getContext('2d');
function sizeFx(){fx.width=innerWidth*devicePixelRatio; fx.height=innerHeight*devicePixelRatio; fctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
sizeFx(); addEventListener('resize',sizeFx);
let particles=[], fxRunning=false;
let FX_MAX=900;               // adaptive cap: lowered if frames drop
const FCOLORS=['#ffd23f','#ff5d2e','#4aa3ff','#39c66d','#ff6bd6','#fff'];

function burst(x,y,big){
  sndBoom();
  spray(x,y,big?90:55,big?7.5:5.5,big?3.4:2.6);
}
function confettiPuff(x,y){ spray(x,y,18,3.2,2.2,true); }
function spray(x,y,n,sp,r,quiet){
  if(particles.length>FX_MAX) n=Math.floor(n/3);
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, v=(0.3+Math.random())*sp;
    particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,decay:.012+Math.random()*.012,
      c:FCOLORS[Math.floor(Math.random()*FCOLORS.length)],r});
  }
  if(!fxRunning){fxRunning=true;requestAnimationFrame(fxLoop)}
}
let fxLastTs=0;
function fxLoop(ts){
  // degrade gracefully: if the frame delta indicates jank, halve the particle budget
  if(fxLastTs&&ts-fxLastTs>34&&FX_MAX>150) FX_MAX=Math.floor(FX_MAX*.7);
  fxLastTs=ts;
  fctx.clearRect(0,0,innerWidth,innerHeight);
  particles=particles.filter(p=>p.life>0);
  for(const p of particles){
    p.x+=p.vx; p.y+=p.vy; p.vy+=.06; p.vx*=.985; p.vy*=.985; p.life-=p.decay;
    fctx.globalAlpha=Math.max(p.life,0);
    fctx.fillStyle=p.c;
    fctx.shadowColor=p.c; fctx.shadowBlur=10;
    fctx.beginPath(); fctx.arc(p.x,p.y,p.r*p.life+0.6,0,7); fctx.fill();
  }
  fctx.globalAlpha=1; fctx.shadowBlur=0;
  if(particles.length){requestAnimationFrame(fxLoop)}else{fxRunning=false;fctx.clearRect(0,0,innerWidth,innerHeight)}
}

const PRAISE=['BOOM!','PERFECT FIT!','AWESOME!','NAILED IT!','GREAT JOB!','WOW!','ROAR-SOME!'];
function cheer(name){
  const W=innerWidth,H=innerHeight;
  for(let i=0;i<3;i++){
    setTimeout(()=>burst(W*(0.15+Math.random()*0.7), H*(0.12+Math.random()*0.35), false), i*180);
  }
  const b=document.getElementById('cheerBanner');
  b.innerHTML=`${PRAISE[Math.floor(Math.random()*PRAISE.length)]}<span class="nm">${name}!</span>`;
  b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
}
function cheerText(txt){
  const b=document.getElementById('cheerBanner');
  b.innerHTML=txt;
  b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
}

/* small in-SVG sparkle (auto-place "finishing touches" moment) */
function svgSparkle(svgRoot,x,y){
  const NS='http://www.w3.org/2000/svg';
  const g=document.createElementNS(NS,'g');
  g.innerHTML=Array.from({length:6},(_,i)=>{
    const a=i/6*Math.PI*2, d=26;
    return `<circle cx="${x}" cy="${y}" r="5" fill="#ffd23f"><animate attributeName="cx" to="${x+Math.cos(a)*d}" dur="0.4s" fill="freeze"/><animate attributeName="cy" to="${y+Math.sin(a)*d}" dur="0.4s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="freeze"/></circle>`;
  }).join('');
  svgRoot.appendChild(g);
  setTimeout(()=>g.remove(),500);
}
