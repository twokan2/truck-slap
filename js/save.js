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
