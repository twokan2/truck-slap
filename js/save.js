/* ============================================================
   SAVE — localStorage persistence + up to 4 sibling profiles.
   All access wrapped in try/catch (Safari private mode throws).
============================================================ */
const SAVE_KEY='bcg_save_v1';
const MAX_PROFILES=4, MAX_PHOTOS=12;

let SAVE={version:1,activeProfile:null,profiles:{},hintDismissed:false};

function loadSave(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(raw){
      const s=JSON.parse(raw);
      if(s&&s.version===1&&s.profiles) SAVE=s;
    }
  }catch(e){}
  return SAVE;
}
function persist(){
  try{ localStorage.setItem(SAVE_KEY,JSON.stringify(SAVE)); }
  catch(e){
    // Quota hit? Photos are the only big payload — drop the oldest and retry once.
    try{
      const p=activeProfile();
      if(p&&p.photos&&p.photos.length){ p.photos.shift(); localStorage.setItem(SAVE_KEY,JSON.stringify(SAVE)); }
    }catch(e2){}
  }
}
function newProfile(name,mode){
  return {name:name.toUpperCase(),mode:mode||'little',built:{},stars:{},paint:{},decals:{},photos:[],
    muted:false,voice:true,lastBuilt:null};
}
function createProfile(name,mode){
  const ids=Object.keys(SAVE.profiles);
  if(ids.length>=MAX_PROFILES) return null;
  let i=1; while(SAVE.profiles['p'+i]) i++;
  const id='p'+i;
  SAVE.profiles[id]=newProfile(name,mode);
  SAVE.activeProfile=id;
  persist();
  return id;
}
function activeProfile(){ return SAVE.profiles[SAVE.activeProfile]||null; }
function setActiveProfile(id){ if(SAVE.profiles[id]){ SAVE.activeProfile=id; persist(); } }
function deleteProfile(id){
  delete SAVE.profiles[id];
  if(SAVE.activeProfile===id) SAVE.activeProfile=Object.keys(SAVE.profiles)[0]||null;
  persist();
}
function resetAllData(){
  SAVE={version:1,activeProfile:null,profiles:{},hintDismissed:false};
  try{ localStorage.removeItem(SAVE_KEY); }catch(e){}
}
function profileCount(){ return Object.keys(SAVE.profiles).length; }

/* convenience accessors for the active profile */
function pGet(field,vid){ const p=activeProfile(); return p?(vid===undefined?p[field]:(p[field]||{})[vid]):undefined; }
function savePhoto(dataUrl){
  const p=activeProfile(); if(!p)return;
  p.photos.push({url:dataUrl,ts:Date.now()});
  while(p.photos.length>MAX_PHOTOS) p.photos.shift();
  persist();
}

/* ============================================================
   BUILDER LEVELS — progression that advances a growing kid.
   XP from every build; levels quietly raise the challenge
   (fainter ghosts, tighter snaps, memory builds) in Pro mode.
============================================================ */
const LEVELS=[
  {xp:0,  name:'ROOKIE WRENCH'},
  {xp:40, name:'GEAR GETTER'},
  {xp:90, name:'TORQUE TIGER'},
  {xp:160,name:'TURBO CHIEF'},
  {xp:250,name:'MASTER MECHANIC'},
  {xp:360,name:'CRUSH COMMANDER'},
  {xp:500,name:'GARAGE LEGEND'},
];
function levelInfo(xp){
  xp=xp||0;
  let li=0;
  for(let i=0;i<LEVELS.length;i++) if(xp>=LEVELS[i].xp) li=i;
  const cur=LEVELS[li], next=LEVELS[li+1]||null;
  return {n:li+1,name:cur.name,xp,
    pct: next?Math.min(100,Math.round((xp-cur.xp)/(next.xp-cur.xp)*100)):100,
    toNext: next?next.xp-xp:0};
}
function addXP(amount){
  const p=activeProfile(); if(!p)return null;
  const before=levelInfo(p.xp).n;
  p.xp=(p.xp||0)+amount;
  const after=levelInfo(p.xp);
  persist();
  return {gained:amount,level:after,leveledUp:after.n>before};
}
