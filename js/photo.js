/* ============================================================
   PHOTO MODE + TROPHY GARAGE (F3)
   Renders the painted vehicle onto a backdrop with a license
   plate, saves PNGs (≤12) into the profile, share via
   navigator.share({files}) with download fallback.
============================================================ */
let photoTruck=null, photoBackdrop='garage', photoReturn='garage', photoDataUrl=null;

function escXML(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function buildPhotoSVG(truck,backdrop){
  const p=activeProfile();
  const scene=PHOTO_BACKDROPS[backdrop].fn();
  const inner=renderVehicleSVG(truck,p.paint[truck.id],(p.decals||{})[truck.id]);
  // vehicle art is 800x520 with ground ≈472; scene ground is y=426 in 1000x560
  const S=0.62, tx=(1000-800*S)/2, ty=426-472*S;
  const flip=truck.flip?`<g transform="translate(800,0) scale(-1,1)">${inner}</g>`:inner;
  const stars=p.stars[truck.id]||0;
  const starRow=Array.from({length:3},(_,i)=>
    `<path transform="translate(${846+i*44} 612) scale(1.55)" d="M0,-10 L2.9,-3.2 L10,-2.6 L4.7,2.2 L6.3,9.3 L0,5.6 L-6.3,9.3 L-4.7,2.2 L-10,-2.6 L-2.9,-3.2 Z" fill="${i<stars?'#ffd23f':'#3a4460'}" stroke="#1a2233" stroke-width="1.5"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="660" viewBox="0 0 1000 660">
    ${scene}
    <g transform="translate(${tx} ${ty}) scale(${S})">${flip}</g>
    <rect x="0" y="560" width="1000" height="100" fill="#141a30"/>
    <rect x="14" y="572" width="972" height="76" rx="14" fill="#f6f9ff" stroke="#8a93a3" stroke-width="4"/>
    <circle cx="40" cy="610" r="6" fill="#8a93a3"/><circle cx="960" cy="610" r="6" fill="#8a93a3"/>
    <text x="60" y="622" font-family="'Arial Rounded MT Bold','Trebuchet MS',sans-serif" font-weight="bold" font-size="40" fill="#1a2233">${escXML(p.name)}</text>
    <text x="500" y="622" text-anchor="middle" font-family="'Arial Rounded MT Bold','Trebuchet MS',sans-serif" font-weight="bold" font-size="30" fill="#c2410c">${escXML(truck.name)}</text>
    ${starRow}
  </svg>`;
}
function rasterize(svgStr,w,h){
  return new Promise((res,rej)=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement('canvas'); c.width=w; c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      res(c);
    };
    img.onerror=rej;
    img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgStr);
  });
}
async function renderPhoto(){
  try{
    const c=await rasterize(buildPhotoSVG(photoTruck,photoBackdrop),800,528);
    photoDataUrl=c.toDataURL('image/png');
    document.getElementById('photoPreview').src=photoDataUrl;
  }catch(e){ photoDataUrl=null; }
}
function openPhotoMode(truck,returnTo){
  photoTruck=truck; photoReturn=returnTo||'garage';
  photoBackdrop=truck.cat==='dino'?'volcano':'garage';
  const chips=document.getElementById('backdropChips');
  chips.innerHTML=Object.entries(PHOTO_BACKDROPS).map(([k,b])=>
    `<button class="chip ${k===photoBackdrop?'sel':''}" data-bd="${k}">${b.label}</button>`).join('');
  chips.querySelectorAll('[data-bd]').forEach(b=>b.onclick=()=>{
    photoBackdrop=b.dataset.bd; sndPop();
    chips.querySelectorAll('.chip').forEach(c=>c.classList.toggle('sel',c===b));
    renderPhoto();
  });
  document.getElementById('photoPreview').removeAttribute('src');
  show('photoScreen');
  sndShutter();
  renderPhoto();
}
async function sharePhoto(dataUrl,name){
  try{
    const blob=await (await fetch(dataUrl)).blob();
    const file=new File([blob],(name||'build')+'.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:'Build & Crush Garage'});
      return;
    }
  }catch(e){ if(e&&e.name==='AbortError')return; }
  const a=document.createElement('a');
  a.href=dataUrl; a.download=(name||'build')+'.png';
  document.body.appendChild(a); a.click(); a.remove();
}
document.getElementById('photoSave').addEventListener('click',()=>{
  if(!photoDataUrl)return;
  savePhoto(photoDataUrl);
  sndFanfare(); confettiPuff(innerWidth/2,innerHeight/2);
  cheerText('SAVED TO<br><span class="nm">TROPHY GARAGE!</span>');
});
document.getElementById('photoShare').addEventListener('click',()=>{
  if(photoDataUrl) sharePhoto(photoDataUrl,photoTruck.id);
});
document.getElementById('photoBack').addEventListener('click',()=>{
  sndPop();
  if(photoReturn==='finale'){ show(null); document.getElementById('finale').classList.add('on'); }
  else if(photoReturn==='paint'){ show('paintShop'); }
  else { renderGarage(); show('garageScreen'); }
});

/* ---------- Trophy Garage ---------- */
function openTrophyGarage(){
  const p=activeProfile();
  const grid=document.getElementById('trophyGrid');
  if(!p.photos.length){
    grid.innerHTML=`<div class="trophyEmpty">📸<br>Finish a build, then tap PHOTO to fill your Trophy Garage!</div>`;
  }else{
    grid.innerHTML=p.photos.slice().reverse().map((ph,i)=>
      `<div class="trophyCard" style="--tilt:${(i%2?1:-1)*(1+(i%3))}deg"><img src="${ph.url}" alt="trophy photo"></div>`).join('');
    grid.querySelectorAll('.trophyCard img').forEach(img=>img.onclick=()=>openTrophyFull(img.src));
  }
  show('trophyScreen');
  sndFanfare();
}
function openTrophyFull(src){
  const m=document.getElementById('trophyFull');
  m.querySelector('img').src=src;
  m.classList.add('on');
  let holdT=null;
  const del=m.querySelector('#trophyDelete');
  del.onpointerdown=()=>{
    del.classList.add('holding');
    holdT=setTimeout(()=>{
      const p=activeProfile();
      const i=p.photos.findIndex(ph=>ph.url===src);
      if(i>=0){ p.photos.splice(i,1); persist(); }
      sndBoing(); m.classList.remove('on'); openTrophyGarage();
    },1500);
  };
  const cancel=()=>{ del.classList.remove('holding'); clearTimeout(holdT); };
  del.onpointerup=cancel; del.onpointercancel=cancel; del.onpointerleave=cancel;
  m.querySelector('#trophyShare').onclick=()=>sharePhoto(src,'trophy');
  m.querySelector('#trophyClose').onclick=()=>{ sndPop(); m.classList.remove('on'); };
}
document.getElementById('trophyBack').addEventListener('click',()=>{ sndPop(); renderGarage(); show('garageScreen'); });
