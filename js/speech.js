/* ============================================================
   SPEECH — Web Speech API encouragement (F7).
   Optional polish: the game is fully playable without it.
   iOS: first speak() must run inside a user-gesture call stack;
   always cancel() before speaking so speech never queues up.
============================================================ */
const speechOK=('speechSynthesis' in window);
let speechSuppressed=false;   // true during finale run + drive mode
let cachedVoice=null, voiceLookedUp=false;

function pickVoice(){
  if(voiceLookedUp||!speechOK) return cachedVoice;
  try{
    const vs=speechSynthesis.getVoices();
    if(vs&&vs.length){
      voiceLookedUp=true;
      cachedVoice=vs.find(v=>v.lang==='en-US'&&v.localService)||vs.find(v=>v.lang&&v.lang.startsWith('en'))||null;
    }
  }catch(e){}
  return cachedVoice;   // never block on voiceschanged
}

function say(text,opts){
  opts=opts||{};
  if(!speechOK) return;
  const p=(typeof activeProfile==='function')?activeProfile():null;
  if(p&&(p.voice===false||p.muted)) return;
  if(typeof muted!=='undefined'&&muted) return;
  if(speechSuppressed&&!opts.force) return;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.rate=opts.rate||1.0; u.pitch=opts.pitch||1.1; u.volume=1;
    const v=pickVoice(); if(v)u.voice=v;
    speechSynthesis.speak(u);
  }catch(e){}
}

const PRAISE_LINES=[
  'Great job, {n}!','Perfect fit!','Awesome work!','You nailed it, {n}!',
  'Wow, look at that!','Super building, {n}!','That fits just right!','Amazing, {n}!'
];
let praiseIdx=Math.floor(Math.random()*PRAISE_LINES.length), lastPraiseAt=0;
function sayPraise(name,slow){
  const now=Date.now();
  // Little Builder: chunkier pacing — don't talk over ourselves every drop
  if(now-lastPraiseAt<(slow?2600:1400)) return;
  lastPraiseAt=now;
  praiseIdx=(praiseIdx+1)%PRAISE_LINES.length;
  say(PRAISE_LINES[praiseIdx].replace('{n}',name));
}
function titleCase(s){ return s.toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase()); }
/* speak a part's name on pickup — vocabulary/early reading, lightly throttled */
let lastLabelAt=0;
function sayLabel(label){
  const now=Date.now();
  if(now-lastLabelAt<1200) return;
  lastLabelAt=now;
  say(label+'!',{rate:1.05});
}
