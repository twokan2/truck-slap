/* ============================================================
   PARTS & ART DATA — shared by build, paint, photo, drive, finale
   viewBox 800x520, ground y≈472
============================================================ */
const STK = 'stroke="#1a2233" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
const STK3 = 'stroke="#1a2233" stroke-width="3.5" stroke-linejoin="round"';
function wheel(cx,cy,r,rim='#cdd6e3',style='lug'){
  const lugR=r*0.07, lugD=r*0.33;
  let lugs='';
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2-Math.PI/2;
    lugs+=`<circle cx="${(cx+Math.cos(a)*lugD).toFixed(1)}" cy="${(cy+Math.sin(a)*lugD).toFixed(1)}" r="${lugR.toFixed(1)}" fill="#5b6573"/>`;}
  let hub = style==='hex'
    ? `<polygon points="${hexPts(cx,cy,r*0.5)}" fill="${rim}" data-tint="${rim}" ${STK}/><circle cx="${cx}" cy="${cy}" r="${r*0.16}" fill="#5b6573" ${STK}/>`
    : `<circle cx="${cx}" cy="${cy}" r="${r*0.55}" fill="${rim}" data-tint="${rim}" ${STK}/>${lugs}<circle cx="${cx}" cy="${cy}" r="${r*0.14}" fill="#8a93a3" ${STK}/>`;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#222a38" ${STK}/>
  <circle cx="${cx}" cy="${cy}" r="${r*0.82}" fill="none" stroke="#0d1320" stroke-width="${r*0.16}" stroke-dasharray="${r*0.28} ${r*0.22}"/>
  ${hub}`;
}
function hexPts(cx,cy,r){let p=[];for(let i=0;i<6;i++){const a=i/6*Math.PI*2-Math.PI/2;p.push(`${(cx+Math.cos(a)*r).toFixed(1)},${(cy+Math.sin(a)*r).toFixed(1)}`)}return p.join(' ')}
function dinoEye(cx,cy,r=15){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" ${STK}/><circle cx="${cx+r*.3}" cy="${cy+r*.15}" r="${r*.45}" fill="#1a2233"/><circle cx="${cx+r*.42}" cy="${cy-r*.1}" r="${r*.16}" fill="#fff"/>`}
function dinoLeg(x,top,w,h,color,toe){
  return `<path d="M${x} ${top} Q${x+w} ${top-6} ${x+w+8} ${top+h*0.45} Q${x+w+10} ${top+h*0.8} ${x+w-6} ${top+h-8} L${x+w-2} ${top+h} L${x+4} ${top+h} Q${x-8} ${top+h*0.7} ${x+2} ${top+h*0.4} Z" fill="${color}" ${STK}/>
  <polygon points="${x+2},${top+h} ${x+12},${top+h-14} ${x+22},${top+h}" fill="${toe}" ${STK3}/>
  <polygon points="${x+24},${top+h} ${x+34},${top+h-14} ${x+44},${top+h}" fill="${toe}" ${STK3}/>`;
}

/* ============================================================
   BUILD DATA — viewBox 800x520, ground y≈472
   cat: 'truck' | 'dino'   lockedIf: 'trucks5' | 'dinos4'
============================================================ */
const TRUCKS = [
/* ================= TRUCKS ================= */
{
  id:'trail', cat:'truck', name:'TRAIL BOSS 4×4', sub:'Off-road legend', rearWheel:[225,400],
  parts:[
    {id:'frame', label:'Frame', svg:`<rect x="140" y="372" width="548" height="24" rx="10" fill="#2b2f3a" ${STK}/><rect x="200" y="392" width="50" height="12" rx="5" fill="#3a4150" ${STK}/><rect x="540" y="392" width="50" height="12" rx="5" fill="#3a4150" ${STK}/>`},
    {id:'body', label:'Body', svg:`<path d="M153 252 L590 252 L662 270 L684 322 L684 372 L637 372 A72 72 0 0 0 493 372 L297 372 A72 72 0 0 0 153 372 Z" fill="#f97316" ${STK}/><line x1="165" y1="300" x2="668" y2="300" stroke="#c2410c" stroke-width="5" stroke-linecap="round"/>`},
    {id:'hood', label:'Hood', svg:`<rect x="538" y="230" width="148" height="26" rx="9" fill="#ea580c" ${STK}/><circle cx="566" cy="243" r="5" fill="#7c2d12"/><circle cx="660" cy="243" r="5" fill="#7c2d12"/>`},
    {id:'grille', label:'Grille', svg:`<rect x="676" y="268" width="28" height="104" rx="9" fill="#374151" ${STK}/><line x1="690" y1="278" x2="690" y2="362" stroke="#6b7280" stroke-width="4"/><circle cx="690" cy="292" r="11" fill="#fef3c7" ${STK}/><circle cx="690" cy="348" r="8" fill="#fde68a" ${STK}/>`},
    {id:'bumperF', label:'Bumper', svg:`<rect x="666" y="358" width="62" height="24" rx="11" fill="#111827" ${STK}/><circle cx="722" cy="370" r="7" fill="#dc2626" ${STK}/>`},
    {id:'door', label:'Door', svg:`<rect x="330" y="262" width="132" height="102" rx="13" fill="#fb923c" ${STK}/><rect x="341" y="271" width="110" height="44" rx="9" fill="#bae6fd" ${STK}/><rect x="350" y="328" width="36" height="9" rx="4" fill="#7c2d12"/>`},
    {id:'roof', label:'Soft Top', svg:`<path d="M298 252 L322 170 Q331 156 352 156 L520 156 Q546 156 554 174 L578 252 Z" fill="#3f3f46" ${STK}/><line x1="350" y1="170" x2="338" y2="248" stroke="#27272a" stroke-width="4"/><line x1="470" y1="166" x2="478" y2="248" stroke="#27272a" stroke-width="4"/>`},
    {id:'spare', label:'Spare Tire', svg:`<circle cx="124" cy="306" r="48" fill="#222a38" ${STK}/><circle cx="124" cy="306" r="26" fill="#cdd6e3" ${STK}/><circle cx="124" cy="306" r="9" fill="#5b6573"/>`},
    {id:'wheelR', label:'Rear Wheel', svg: wheel(225,400,72)},
    {id:'wheelF', label:'Front Wheel', svg: wheel(565,400,72)},
  ]
},
{
  id:'mega', cat:'truck', name:'MEGA CRUSHER', sub:'Monster truck', rearWheel:[235,362],
  parts:[
    {id:'susp', label:'Suspension', svg:`<rect x="222" y="262" width="26" height="104" rx="8" fill="#475569" ${STK}/><rect x="572" y="262" width="26" height="104" rx="8" fill="#475569" ${STK}/><line x1="190" y1="276" x2="280" y2="340" stroke="#1a2233" stroke-width="10" stroke-linecap="round"/><line x1="540" y1="276" x2="630" y2="340" stroke="#1a2233" stroke-width="10" stroke-linecap="round"/><rect x="200" y="252" width="420" height="20" rx="9" fill="#334155" ${STK}/>`},
    {id:'body', label:'Body', svg:`<path d="M158 196 L406 196 L438 122 L562 122 L596 196 L668 196 L676 264 L150 264 Z" fill="#7c3aed" ${STK}/>`},
    {id:'flames', label:'Flame Decal', svg:`<path d="M158 262 L196 222 L214 252 L252 214 L268 250 L312 218 L326 254 L372 224 L384 262 Z" fill="#fb923c" stroke="#c2410c" stroke-width="4" stroke-linejoin="round"/><path d="M392 262 L424 230 L440 256 L478 228 L492 262 Z" fill="#fbbf24" stroke="#c2410c" stroke-width="4" stroke-linejoin="round"/>`},
    {id:'window', label:'Windows', svg:`<path d="M446 132 L554 132 L580 192 L420 192 Z" fill="#a5f3fc" ${STK}/><line x1="500" y1="134" x2="500" y2="190" stroke="#1a2233" stroke-width="5"/>`},
    {id:'pipes', label:'Exhaust Pipes', svg:`<rect x="396" y="92" width="20" height="106" rx="9" fill="#cbd5e1" ${STK}/><rect x="424" y="78" width="20" height="120" rx="9" fill="#cbd5e1" ${STK}/><ellipse cx="406" cy="92" rx="12" ry="7" fill="#64748b" ${STK}/><ellipse cx="434" cy="78" rx="12" ry="7" fill="#64748b" ${STK}/>`},
    {id:'lightbar', label:'Light Bar', svg:`<rect x="452" y="100" width="118" height="18" rx="8" fill="#1f2937" ${STK}/><circle cx="474" cy="109" r="7" fill="#fde047"/><circle cx="502" cy="109" r="7" fill="#fde047"/><circle cx="530" cy="109" r="7" fill="#fde047"/><circle cx="552" cy="109" r="7" fill="#fde047"/>`},
    {id:'guard', label:'Grille Guard', svg:`<rect x="660" y="208" width="22" height="64" rx="9" fill="#111827" ${STK}/><circle cx="671" cy="224" r="8" fill="#fef3c7" ${STK}/><circle cx="671" cy="252" r="8" fill="#fef3c7" ${STK}/>`},
    {id:'wheelR', label:'Mega Wheel', svg: wheel(235,362,110,'#fbbf24')},
    {id:'wheelF', label:'Mega Wheel', svg: wheel(585,362,110,'#fbbf24')},
  ]
},
{
  id:'volt', cat:'truck', name:'CYBER VOLT', sub:'Electric pickup', rearWheel:[230,410], flip:true,
  parts:[
    {id:'body', label:'Steel Body', svg:`<path d="M112 330 L388 176 L706 252 L706 388 L112 388 Z" fill="#cbd5e1" ${STK}/><line x1="388" y1="180" x2="392" y2="384" stroke="#94a3b8" stroke-width="4"/><line x1="540" y1="214" x2="540" y2="384" stroke="#94a3b8" stroke-width="4"/>`},
    {id:'window', label:'Window Strip', svg:`<path d="M150 320 L384 192 L520 224 L520 268 L196 304 Z" fill="#0f172a" ${STK}/><path d="M170 312 L380 200" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>`},
    {id:'bedcover', label:'Bed Cover', svg:`<path d="M396 196 L548 230 L548 252 L396 222 Z" fill="#475569" ${STK}/>`},
    {id:'lightF', label:'Light Bar', svg:`<path d="M392 178 L706 254 L706 268 L392 192 Z" fill="#e0f2fe" stroke="#1a2233" stroke-width="4"/><path d="M398 184 L700 258" stroke="#7dd3fc" stroke-width="6" stroke-linecap="round"/>`},
    {id:'lightR', label:'Tail Light', svg:`<rect x="106" y="324" width="18" height="62" rx="8" fill="#ef4444" ${STK}/>`},
    {id:'skirt', label:'Armor Trim', svg:`<path d="M112 388 L706 388 L706 416 L640 416 A58 58 0 0 0 524 416 L288 416 A58 58 0 0 0 172 416 L112 416 Z" fill="#334155" ${STK}/>`},
    {id:'archF', label:'Fender F', svg:`<path d="M514 414 A66 66 0 0 1 646 414 L630 414 A50 50 0 0 0 530 414 Z" fill="#1e293b" ${STK}/>`},
    {id:'archR', label:'Fender R', svg:`<path d="M164 414 A66 66 0 0 1 296 414 L280 414 A50 50 0 0 0 180 414 Z" fill="#1e293b" ${STK}/>`},
    {id:'wheelR', label:'Aero Wheel', svg: wheel(230,410,62,'#94a3b8','hex')},
    {id:'wheelF', label:'Aero Wheel', svg: wheel(580,410,62,'#94a3b8','hex')},
  ]
},
{
  id:'rig', cat:'truck', name:'BIG RIG', sub:'Highway hauler', rearWheel:[210,414],
  parts:[
    {id:'frame', label:'Frame', svg:`<rect x="120" y="380" width="560" height="22" rx="9" fill="#2b2f3a" ${STK}/><circle cx="160" cy="391" r="16" fill="#475569" ${STK}/>`},
    {id:'sleeper', label:'Sleeper Cab', svg:`<rect x="246" y="170" width="160" height="212" rx="14" fill="#dc2626" ${STK}/><rect x="262" y="190" width="58" height="44" rx="8" fill="#bae6fd" ${STK}/>`},
    {id:'cab', label:'Cab', svg:`<path d="M406 382 L406 178 Q406 164 422 164 L488 164 L520 240 L520 382 Z" fill="#ef4444" ${STK}/><path d="M428 182 L482 182 L506 240 L428 240 Z" fill="#bae6fd" ${STK}/><rect x="436" y="290" width="40" height="9" rx="4" fill="#7f1d1d"/>`},
    {id:'hood', label:'Hood', svg:`<path d="M520 256 L660 268 L668 322 L668 382 L520 382 Z" fill="#dc2626" ${STK}/><path d="M530 268 L650 278" stroke="#7f1d1d" stroke-width="5" stroke-linecap="round" fill="none"/>`},
    {id:'grille', label:'Chrome Grille', svg:`<rect x="660" y="276" width="26" height="106" rx="8" fill="#cbd5e1" ${STK}/><line x1="673" y1="288" x2="673" y2="370" stroke="#64748b" stroke-width="4"/><rect x="652" y="368" width="76" height="24" rx="10" fill="#cbd5e1" ${STK}/><circle cx="676" cy="296" r="9" fill="#fef3c7" ${STK}/>`},
    {id:'stacks', label:'Smoke Stacks', svg:`<rect x="396" y="96" width="20" height="180" rx="9" fill="#cbd5e1" ${STK}/><ellipse cx="406" cy="96" rx="12" ry="7" fill="#64748b" ${STK}/><rect x="392" y="200" width="28" height="40" rx="8" fill="#94a3b8" ${STK}/>`},
    {id:'tank', label:'Fuel Tank', svg:`<rect x="300" y="396" width="120" height="44" rx="22" fill="#cbd5e1" ${STK}/><line x1="322" y1="402" x2="322" y2="434" stroke="#64748b" stroke-width="4"/><line x1="398" y1="402" x2="398" y2="434" stroke="#64748b" stroke-width="4"/>`},
    {id:'wheelF', label:'Front Wheel', svg: wheel(600,414,58)},
    {id:'wheelR1', label:'Drive Wheel', svg: wheel(210,414,58)},
    {id:'wheelR2', label:'Drive Wheel', svg: wheel(336,414,58)},
  ]
},
{
  id:'fire', cat:'truck', name:'FIRE RESCUE', sub:'Hero on wheels', rearWheel:[220,412],
  parts:[
    {id:'frame', label:'Frame', svg:`<rect x="120" y="378" width="570" height="22" rx="9" fill="#2b2f3a" ${STK}/>`},
    {id:'bodybox', label:'Rescue Box', svg:`<rect x="130" y="200" width="330" height="182" rx="12" fill="#dc2626" ${STK}/><rect x="152" y="220" width="80" height="140" rx="8" fill="#e2e8f0" ${STK}/><line x1="152" y1="244" x2="232" y2="244" stroke="#94a3b8" stroke-width="4"/><line x1="152" y1="268" x2="232" y2="268" stroke="#94a3b8" stroke-width="4"/><line x1="152" y1="292" x2="232" y2="292" stroke="#94a3b8" stroke-width="4"/><line x1="152" y1="316" x2="232" y2="316" stroke="#94a3b8" stroke-width="4"/><rect x="252" y="220" width="80" height="140" rx="8" fill="#e2e8f0" ${STK}/><line x1="252" y1="244" x2="332" y2="244" stroke="#94a3b8" stroke-width="4"/><line x1="252" y1="268" x2="332" y2="268" stroke="#94a3b8" stroke-width="4"/><line x1="252" y1="292" x2="332" y2="292" stroke="#94a3b8" stroke-width="4"/><line x1="252" y1="316" x2="332" y2="316" stroke="#94a3b8" stroke-width="4"/>`},
    {id:'cab', label:'Cab', svg:`<path d="M460 382 L460 196 Q460 182 476 182 L560 182 L606 262 L606 382 Z" fill="#dc2626" ${STK}/><path d="M482 200 L554 200 L586 260 L482 260 Z" fill="#bae6fd" ${STK}/><rect x="492" y="306" width="42" height="9" rx="4" fill="#7f1d1d"/>`},
    {id:'ladder', label:'Ladder', svg:`<rect x="140" y="168" width="330" height="14" rx="7" fill="#e5e7eb" ${STK}/><rect x="140" y="138" width="330" height="14" rx="7" fill="#e5e7eb" ${STK}/><line x1="170" y1="142" x2="170" y2="178" stroke="#1a2233" stroke-width="6"/><line x1="226" y1="142" x2="226" y2="178" stroke="#1a2233" stroke-width="6"/><line x1="282" y1="142" x2="282" y2="178" stroke="#1a2233" stroke-width="6"/><line x1="338" y1="142" x2="338" y2="178" stroke="#1a2233" stroke-width="6"/><line x1="394" y1="142" x2="394" y2="178" stroke="#1a2233" stroke-width="6"/><line x1="446" y1="142" x2="446" y2="178" stroke="#1a2233" stroke-width="6"/>`},
    {id:'lights', label:'Siren Lights', svg:`<rect x="486" y="160" width="84" height="20" rx="9" fill="#1f2937" ${STK}/><rect x="494" y="164" width="28" height="12" rx="5" fill="#ef4444"/><rect x="534" y="164" width="28" height="12" rx="5" fill="#3b82f6"/>`},
    {id:'grille', label:'Bumper & Grille', svg:`<rect x="598" y="270" width="26" height="100" rx="8" fill="#cbd5e1" ${STK}/><circle cx="612" cy="290" r="9" fill="#fef3c7" ${STK}/><rect x="588" y="362" width="86" height="26" rx="11" fill="#cbd5e1" ${STK}/>`},
    {id:'shield', label:'FD Shield', svg:`<path d="M372 250 L412 250 L412 290 Q392 312 372 290 Z" fill="#fbbf24" ${STK}/><text x="392" y="282" text-anchor="middle" font-family="Luckiest Guy" font-size="26" fill="#7c2d12">FD</text>`},
    {id:'hose', label:'Hose Reel', svg:`<circle cx="392" cy="340" r="26" fill="#e5e7eb" ${STK}/><circle cx="392" cy="340" r="14" fill="#9ca3af" ${STK}/>`},
    {id:'wheelR', label:'Rear Wheel', svg: wheel(220,412,60)},
    {id:'wheelF', label:'Front Wheel', svg: wheel(540,412,60)},
  ]
},
{
  id:'garbage', cat:'truck', name:'GARBAGE GRINDER', sub:'Trash titan', rearWheel:[210,414],
  parts:[
    {id:'frame', label:'Frame', svg:`<rect x="120" y="380" width="560" height="22" rx="9" fill="#2b2f3a" ${STK}/>`},
    {id:'hopper', label:'Hopper', svg:`<path d="M132 240 Q132 212 160 212 L420 212 L440 248 L440 384 L132 384 Z" fill="#84cc16" ${STK}/><path d="M150 384 L150 248 M210 384 L210 240 M270 384 L270 236 M330 384 L330 232 M390 384 L390 230" stroke="#4d7c0f" stroke-width="5"/>`},
    {id:'lid', label:'Top Lid', svg:`<path d="M140 214 Q140 184 176 184 L380 184 Q414 184 420 210 L132 238 Q130 222 140 214 Z" fill="#65a30d" ${STK}/><rect x="240" y="190" width="80" height="14" rx="7" fill="#3f6212"/>`},
    {id:'cab', label:'Cab', svg:`<path d="M450 384 L450 206 Q450 190 468 190 L556 190 L600 268 L600 384 Z" fill="#a3e635" ${STK}/><path d="M472 206 L550 206 L580 264 L472 264 Z" fill="#bae6fd" ${STK}/><rect x="482" y="306" width="42" height="9" rx="4" fill="#3f6212"/>`},
    {id:'arm', label:'Lift Arm', svg:`<path d="M600 250 L688 232 Q702 230 704 244 L706 262 L612 282 Z" fill="#fbbf24" ${STK}/><rect x="688" y="252" width="34" height="74" rx="9" fill="#f59e0b" ${STK}/><line x1="705" y1="262" x2="705" y2="316" stroke="#92400e" stroke-width="5"/>`},
    {id:'recycle', label:'Recycle Decal', svg:`<circle cx="286" cy="300" r="42" fill="#fff" ${STK}/><path d="M286 270 L302 296 L270 296 Z" fill="#16a34a"/><path d="M266 312 L282 286 L298 312 Z" fill="#16a34a" transform="rotate(180 282 300)"/><path d="M286 330 L270 306 L302 306 Z" fill="#16a34a"/>`},
    {id:'grille', label:'Bumper & Lights', svg:`<rect x="592" y="276" width="24" height="92" rx="8" fill="#374151" ${STK}/><circle cx="604" cy="294" r="9" fill="#fef3c7" ${STK}/><rect x="584" y="360" width="78" height="26" rx="11" fill="#374151" ${STK}/>`},
    {id:'wheelR', label:'Rear Wheel', svg: wheel(210,414,58)},
    {id:'wheelM', label:'Mid Wheel', svg: wheel(330,414,58)},
    {id:'wheelF', label:'Front Wheel', svg: wheel(540,414,58)},
  ]
},
{
  id:'icecream', cat:'truck', name:'SCOOP CRUISER', sub:'Ice cream truck', rearWheel:[225,412],
  parts:[
    {id:'frame', label:'Frame', svg:`<rect x="130" y="378" width="540" height="22" rx="9" fill="#2b2f3a" ${STK}/>`},
    {id:'body', label:'Van Body', svg:`<path d="M140 200 Q140 176 168 176 L520 176 L560 200 L620 212 L646 268 L646 380 L140 380 Z" fill="#fdf2f8" ${STK}/><path d="M140 330 L646 330 L646 356 L140 356 Z" fill="#f472b6" stroke="#1a2233" stroke-width="4"/>`},
    {id:'window', label:'Serving Window', svg:`<rect x="220" y="208" width="170" height="104" rx="12" fill="#a5f3fc" ${STK}/><line x1="305" y1="210" x2="305" y2="310" stroke="#1a2233" stroke-width="5"/>`},
    {id:'awning', label:'Awning', svg:`<path d="M204 206 L406 206 L394 178 Q392 168 380 168 L230 168 Q218 168 216 178 Z" fill="#fb7185" ${STK}/><path d="M226 206 L238 178 M268 206 L278 178 M310 206 L318 178 M352 206 L360 178" stroke="#fff" stroke-width="8"/>`},
    {id:'cone', label:'Giant Cone', svg:`<polygon points="488,170 528,170 508,118" fill="#f59e0b" ${STK}/><path d="M492 162 L524 142 M490 150 L520 132" stroke="#92400e" stroke-width="3.5"/><circle cx="508" cy="104" r="26" fill="#f9a8d4" ${STK}/><circle cx="492" cy="92" r="18" fill="#fdf2f8" ${STK}/><circle cx="522" cy="88" r="16" fill="#a78bfa" ${STK}/><circle cx="508" cy="76" r="7" fill="#ef4444" ${STK3}/>`},
    {id:'menu', label:'Menu Board', svg:`<rect x="430" y="218" width="100" height="92" rx="10" fill="#fff" ${STK}/><circle cx="455" cy="244" r="11" fill="#f9a8d4" ${STK3}/><polygon points="448,254 462,254 455,272" fill="#f59e0b" ${STK3}/><circle cx="500" cy="244" r="11" fill="#a78bfa" ${STK3}/><polygon points="493,254 507,254 500,272" fill="#f59e0b" ${STK3}/><line x1="445" y1="288" x2="515" y2="288" stroke="#94a3b8" stroke-width="5"/>`},
    {id:'cabwin', label:'Windshield', svg:`<path d="M566 212 L614 222 L634 268 L566 268 Z" fill="#bae6fd" ${STK}/>`},
    {id:'grille', label:'Bumper & Lights', svg:`<rect x="638" y="280" width="22" height="86" rx="8" fill="#f472b6" ${STK}/><circle cx="649" cy="298" r="8" fill="#fef3c7" ${STK}/><rect x="630" y="358" width="64" height="24" rx="10" fill="#cbd5e1" ${STK}/>`},
    {id:'wheelR', label:'Rear Wheel', svg: wheel(225,412,60,'#f9a8d4')},
    {id:'wheelF', label:'Front Wheel', svg: wheel(560,412,60,'#f9a8d4')},
  ]
},
{
  id:'tow', cat:'truck', name:'TOW MATE', sub:'Rescue & recovery', rearWheel:[230,410],
  parts:[
    {id:'frame', label:'Frame', svg:`<rect x="130" y="376" width="550" height="22" rx="9" fill="#2b2f3a" ${STK}/>`},
    {id:'bed', label:'Tow Bed', svg:`<path d="M140 308 L440 308 L440 378 L140 378 Z" fill="#3b82f6" ${STK}/><path d="M156 308 L156 378 M196 308 L196 378 M236 308 L236 378 M276 308 L276 378 M316 308 L316 378 M356 308 L356 378 M396 308 L396 378" stroke="#1d4ed8" stroke-width="5"/>`},
    {id:'boom', label:'Tow Boom', svg:`<path d="M170 320 L150 200 Q148 186 162 184 L184 182 Q196 182 198 196 L226 318 Z" fill="#fbbf24" ${STK}/><rect x="142" y="174" width="64" height="22" rx="10" fill="#f59e0b" ${STK}/>`},
    {id:'hook', label:'Hook & Chain', svg:`<line x1="158" y1="196" x2="120" y2="262" stroke="#475569" stroke-width="7" stroke-dasharray="2 9" stroke-linecap="round"/><path d="M120 262 Q100 268 102 288 Q104 306 124 306 Q140 306 142 290" fill="none" stroke="#64748b" stroke-width="11" stroke-linecap="round"/><circle cx="120" cy="260" r="9" fill="#94a3b8" ${STK3}/>`},
    {id:'cab', label:'Cab', svg:`<path d="M450 378 L450 200 Q450 184 468 184 L562 184 L612 264 L612 378 Z" fill="#2563eb" ${STK}/><path d="M472 200 L556 200 L588 260 L472 260 Z" fill="#bae6fd" ${STK}/><rect x="484" y="302" width="42" height="9" rx="4" fill="#1e3a8a"/>`},
    {id:'beacon', label:'Amber Beacon', svg:`<rect x="478" y="162" width="92" height="20" rx="9" fill="#1f2937" ${STK}/><rect x="488" y="166" width="30" height="12" rx="5" fill="#fbbf24"/><rect x="530" y="166" width="30" height="12" rx="5" fill="#fbbf24"/>`},
    {id:'grille', label:'Bumper & Grille', svg:`<rect x="606" y="272" width="24" height="94" rx="8" fill="#cbd5e1" ${STK}/><circle cx="618" cy="292" r="9" fill="#fef3c7" ${STK}/><rect x="596" y="356" width="80" height="26" rx="11" fill="#cbd5e1" ${STK}/>`},
    {id:'star', label:'Star Decal', svg:`<polygon points="520,300 530,322 554,324 536,340 542,364 520,350 498,364 504,340 486,324 510,322" fill="#fbbf24" ${STK3}/>`},
    {id:'wheelR', label:'Rear Wheel', svg: wheel(230,410,62)},
    {id:'wheelF', label:'Front Wheel', svg: wheel(545,410,62)},
  ]
},
/* secrets — trucks */
{
  id:'rocket', cat:'truck', name:'ROCKET RACER', sub:'Secret truck!', rearWheel:[226,408], lockedIf:'trucks5',
  parts:[
    {id:'frame', label:'Frame', svg:`<rect x="130" y="372" width="540" height="24" rx="10" fill="#2b2f3a" ${STK}/>`},
    {id:'body', label:'Body', svg:`<path d="M140 280 L430 280 L460 210 Q466 198 482 198 L560 198 L600 270 L676 282 L690 330 L690 376 L640 376 A66 66 0 0 0 508 376 L292 376 A66 66 0 0 0 160 376 L140 376 Z" fill="#f8fafc" ${STK}/><path d="M150 322 L684 322 L690 348 L150 348 Z" fill="#ef4444" stroke="#1a2233" stroke-width="4"/>`},
    {id:'canopy', label:'Canopy', svg:`<path d="M470 212 L552 212 L584 268 L448 268 Z" fill="#a5f3fc" ${STK}/><path d="M482 220 L540 220" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`},
    {id:'booster', label:'Rocket Booster', svg:`<rect x="170" y="190" width="230" height="74" rx="34" fill="#cbd5e1" ${STK}/><path d="M400 196 L460 227 L400 258 Z" fill="#ef4444" ${STK}/><rect x="196" y="206" width="170" height="12" rx="6" fill="#94a3b8"/><rect x="196" y="238" width="170" height="12" rx="6" fill="#94a3b8"/>`},
    {id:'fin', label:'Tail Fin', svg:`<path d="M168 196 L120 130 Q116 122 128 122 L184 122 L218 192 Z" fill="#ef4444" ${STK}/>`},
    {id:'flame', label:'Rocket Flame', svg:`<path d="M170 208 L96 200 L132 222 L84 228 L132 236 L98 256 L170 248 Z" fill="#fb923c" stroke="#c2410c" stroke-width="4" stroke-linejoin="round"/><path d="M170 218 L122 222 L142 228 L122 234 L170 240 Z" fill="#fde047" stroke="none"/>`},
    {id:'grille', label:'Nose Lights', svg:`<rect x="682" y="288" width="22" height="86" rx="9" fill="#1f2937" ${STK}/><circle cx="693" cy="306" r="8" fill="#fef3c7" ${STK}/><circle cx="693" cy="352" r="8" fill="#fde68a" ${STK}/>`},
    {id:'wheelR', label:'Speed Wheel', svg: wheel(226,408,66,'#ef4444')},
    {id:'wheelF', label:'Speed Wheel', svg: wheel(574,408,66,'#ef4444')},
  ]
},
{
  id:'gold', cat:'truck', name:'GOLD KING', sub:'Secret truck!', rearWheel:[235,362], lockedIf:'trucks5',
  parts:[
    {id:'susp', label:'Suspension', svg:`<rect x="222" y="262" width="26" height="104" rx="8" fill="#92670c" ${STK}/><rect x="572" y="262" width="26" height="104" rx="8" fill="#92670c" ${STK}/><line x1="190" y1="276" x2="280" y2="340" stroke="#1a2233" stroke-width="10" stroke-linecap="round"/><line x1="540" y1="276" x2="630" y2="340" stroke="#1a2233" stroke-width="10" stroke-linecap="round"/><rect x="200" y="252" width="420" height="20" rx="9" fill="#a16207" ${STK}/>`},
    {id:'body', label:'Gold Body', svg:`<path d="M158 196 L406 196 L438 122 L562 122 L596 196 L668 196 L676 264 L150 264 Z" fill="#fbbf24" ${STK}/><path d="M170 252 L660 252" stroke="#b45309" stroke-width="5" stroke-linecap="round"/>`},
    {id:'diamond', label:'Diamond Decal', svg:`<polygon points="270,210 310,210 322,228 290,256 258,228" fill="#a5f3fc" ${STK}/><path d="M258 228 L322 228 M270 210 L290 256 M310 210 L290 256" stroke="#1a2233" stroke-width="3" fill="none"/>`},
    {id:'crown', label:'Crown', svg:`<path d="M448 116 L448 84 L472 100 L500 70 L528 100 L552 84 L552 116 Z" fill="#ffd23f" ${STK}/><circle cx="500" cy="64" r="8" fill="#ef4444" ${STK}/>`},
    {id:'window', label:'Windows', svg:`<path d="M446 132 L554 132 L580 192 L420 192 Z" fill="#fef9c3" ${STK}/><line x1="500" y1="134" x2="500" y2="190" stroke="#1a2233" stroke-width="5"/>`},
    {id:'pipes', label:'Gold Pipes', svg:`<rect x="396" y="92" width="20" height="106" rx="9" fill="#ffd23f" ${STK}/><rect x="424" y="78" width="20" height="120" rx="9" fill="#ffd23f" ${STK}/><ellipse cx="406" cy="92" rx="12" ry="7" fill="#b45309" ${STK}/><ellipse cx="434" cy="78" rx="12" ry="7" fill="#b45309" ${STK}/>`},
    {id:'guard', label:'Gold Guard', svg:`<rect x="660" y="208" width="22" height="64" rx="9" fill="#92670c" ${STK}/><circle cx="671" cy="224" r="8" fill="#fef3c7" ${STK}/><circle cx="671" cy="252" r="8" fill="#fef3c7" ${STK}/>`},
    {id:'wheelR', label:'Gold Wheel', svg: wheel(235,362,110,'#ffd23f')},
    {id:'wheelF', label:'Gold Wheel', svg: wheel(585,362,110,'#ffd23f')},
  ]
},
/* ================= DINOS ================= */
{
  id:'trex', cat:'dino', name:'T-REX', sub:'King of crunch', rearWheel:[280,460],
  parts:[
    {id:'tail', label:'Tail', svg:`<path d="M62 292 Q150 264 252 286 L252 352 Q150 352 70 318 Q52 306 62 292 Z" fill="#4ade80" ${STK}/>`},
    {id:'bodyMain', label:'Body', svg:`<path d="M212 290 Q260 232 360 236 Q470 240 510 296 Q524 350 470 392 Q380 424 290 400 Q212 374 206 330 Q204 306 212 290 Z" fill="#4ade80" ${STK}/>`},
    {id:'belly', label:'Belly', svg:`<path d="M268 388 Q350 414 440 392 Q480 378 496 348 Q488 396 408 410 Q318 418 268 388 Z" fill="#d9f99d" stroke="#1a2233" stroke-width="4" stroke-linejoin="round"/>`},
    {id:'legB', label:'Back Leg', svg: dinoLeg(232,346,58,124,'#22c55e','#fef9c3')},
    {id:'legF', label:'Front Leg', svg: dinoLeg(396,352,58,118,'#22c55e','#fef9c3')},
    {id:'head', label:'Head', svg:`<path d="M468 268 Q462 184 530 158 Q610 132 684 160 Q722 176 716 200 L600 226 Q518 242 508 300 Z" fill="#4ade80" ${STK}/><circle cx="688" cy="186" r="6" fill="#166534"/>`},
    {id:'jaw', label:'Chompy Jaw', svg:`<path d="M518 252 Q580 246 692 216 Q718 212 714 234 Q702 262 640 276 Q568 288 526 272 Q512 264 518 252 Z" fill="#22c55e" ${STK}/>`},
    {id:'teeth', label:'Teeth', svg:`<polygon points="556,240 568,264 580,236" fill="#fff" ${STK3}/><polygon points="590,233 602,257 614,229" fill="#fff" ${STK3}/><polygon points="624,226 636,250 648,222" fill="#fff" ${STK3}/><polygon points="658,218 670,242 682,214" fill="#fff" ${STK3}/>`},
    {id:'eye', label:'Eye', svg: dinoEye(560,196,16)+`<path d="M534 174 L588 168" stroke="#166534" stroke-width="7" stroke-linecap="round" fill="none"/>`},
    {id:'arms', label:'Tiny Arms', svg:`<path d="M466 304 q36 4 40 30 l-18 10 q-8-24-28-28 Z" fill="#22c55e" ${STK}/><path d="M448 322 q30 6 32 28 l-16 8 q-6-20-22-24 Z" fill="#16a34a" ${STK}/>`},
    {id:'spikes', label:'Back Spikes', svg:`<polygon points="250,272 274,238 296,266" fill="#16a34a" ${STK}/><polygon points="306,256 330,224 352,254" fill="#16a34a" ${STK}/><polygon points="362,250 386,222 408,252" fill="#16a34a" ${STK}/>`},
  ]
},
{
  id:'trike', cat:'dino', name:'TRICERATOPS', sub:'Three-horn tank', rearWheel:[300,460],
  parts:[
    {id:'tail', label:'Tail', svg:`<path d="M84 326 Q170 296 246 318 L246 376 Q160 376 92 344 Q74 336 84 326 Z" fill="#fb923c" ${STK}/>`},
    {id:'bodyMain', label:'Body', svg:`<ellipse cx="368" cy="338" rx="158" ry="94" fill="#fb923c" ${STK}/>`},
    {id:'belly', label:'Belly', svg:`<path d="M260 386 Q360 428 470 384 Q452 416 368 422 Q288 420 260 386 Z" fill="#fed7aa" stroke="#1a2233" stroke-width="4" stroke-linejoin="round"/>`},
    {id:'spots', label:'Spots', svg:`<circle cx="320" cy="300" r="16" fill="#ea580c" ${STK3}/><circle cx="384" cy="276" r="13" fill="#ea580c" ${STK3}/><circle cx="356" cy="346" r="11" fill="#ea580c" ${STK3}/>`},
    {id:'legB', label:'Back Leg', svg:`<rect x="268" y="376" width="62" height="96" rx="20" fill="#f97316" ${STK}/><circle cx="284" cy="466" r="7" fill="#fef9c3" ${STK3}/><circle cx="306" cy="468" r="7" fill="#fef9c3" ${STK3}/>`},
    {id:'legF', label:'Front Leg', svg:`<rect x="426" y="376" width="62" height="96" rx="20" fill="#f97316" ${STK}/><circle cx="442" cy="466" r="7" fill="#fef9c3" ${STK3}/><circle cx="464" cy="468" r="7" fill="#fef9c3" ${STK3}/>`},
    {id:'frill', label:'Frill Shield', svg:`<path d="M508 308 Q488 196 560 154 Q616 128 660 162 Q712 206 694 290 Q610 342 516 314 Q508 312 508 308 Z" fill="#f97316" ${STK}/><path d="M530 290 Q520 210 574 180 Q620 158 652 186 Q686 220 672 276" fill="none" stroke="#c2410c" stroke-width="6" stroke-linecap="round"/>`},
    {id:'head', label:'Head & Beak', svg:`<path d="M608 234 Q686 226 728 262 Q746 282 724 298 Q678 316 632 306 Q604 296 606 262 Z" fill="#fb923c" ${STK}/><path d="M726 266 L760 282 L722 300 Z" fill="#fef3c7" ${STK}/><path d="M640 306 Q668 312 700 304" stroke="#9a3412" stroke-width="5" fill="none" stroke-linecap="round"/>`},
    {id:'horns', label:'Horns', svg:`<path d="M636 232 Q644 178 666 162 Q662 202 656 238 Z" fill="#fef3c7" ${STK}/><path d="M676 236 Q690 190 712 178 Q702 216 694 248 Z" fill="#fef3c7" ${STK}/><path d="M716 252 Q734 240 744 244 Q736 258 726 266 Z" fill="#fef3c7" ${STK}/>`},
    {id:'eye', label:'Eye', svg: dinoEye(652,252,14)},
  ]
},
{
  id:'stego', cat:'dino', name:'STEGOSAURUS', sub:'Plate parade', rearWheel:[290,460],
  parts:[
    {id:'tail', label:'Tail', svg:`<path d="M88 268 Q150 296 218 334 L202 384 Q124 348 78 296 Q70 280 88 268 Z" fill="#a78bfa" ${STK}/>`},
    {id:'spikesTail', label:'Tail Spikes', svg:`<polygon points="98,284 60,232 112,266" fill="#fef9c3" ${STK}/><polygon points="122,300 92,244 138,284" fill="#fef9c3" ${STK}/>`},
    {id:'bodyMain', label:'Body', svg:`<ellipse cx="360" cy="346" rx="172" ry="92" fill="#a78bfa" ${STK}/>`},
    {id:'belly', label:'Belly', svg:`<path d="M244 392 Q356 436 478 388 Q452 422 360 428 Q268 426 244 392 Z" fill="#ddd6fe" stroke="#1a2233" stroke-width="4" stroke-linejoin="round"/>`},
    {id:'platesBig', label:'Big Plates', svg:`<path d="M256 282 Q262 218 298 210 Q322 240 314 290 Z" fill="#f472b6" ${STK}/><path d="M330 268 Q340 196 382 190 Q406 226 392 282 Z" fill="#f472b6" ${STK}/><path d="M410 268 Q424 204 462 202 Q482 238 464 288 Z" fill="#f472b6" ${STK}/>`},
    {id:'platesSm', label:'Small Plates', svg:`<path d="M196 312 Q198 268 226 262 Q244 286 236 322 Z" fill="#fb7185" ${STK}/><path d="M482 290 Q494 248 522 250 Q534 280 516 314 Z" fill="#fb7185" ${STK}/>`},
    {id:'legB', label:'Back Leg', svg:`<rect x="262" y="384" width="58" height="88" rx="19" fill="#8b5cf6" ${STK}/><circle cx="278" cy="466" r="7" fill="#fef9c3" ${STK3}/><circle cx="300" cy="468" r="7" fill="#fef9c3" ${STK3}/>`},
    {id:'legF', label:'Front Leg', svg:`<rect x="414" y="384" width="58" height="88" rx="19" fill="#8b5cf6" ${STK}/><circle cx="430" cy="466" r="7" fill="#fef9c3" ${STK3}/><circle cx="452" cy="468" r="7" fill="#fef9c3" ${STK3}/>`},
    {id:'head', label:'Head', svg:`<path d="M502 356 Q566 338 614 360 Q634 372 618 388 Q578 406 530 398 Q504 390 502 372 Z" fill="#a78bfa" ${STK}/><path d="M540 396 Q566 402 592 394" stroke="#6d28d9" stroke-width="5" fill="none" stroke-linecap="round"/>`},
    {id:'eye', label:'Eye', svg: dinoEye(576,370,13)},
  ]
},
{
  id:'bronto', cat:'dino', name:'BRONTO', sub:'Long-neck legend', rearWheel:[290,460],
  parts:[
    {id:'tail', label:'Tail', svg:`<path d="M62 296 Q160 286 232 326 L218 380 Q130 360 66 318 Q52 306 62 296 Z" fill="#2dd4bf" ${STK}/>`},
    {id:'bodyMain', label:'Body', svg:`<ellipse cx="352" cy="354" rx="152" ry="86" fill="#2dd4bf" ${STK}/>`},
    {id:'belly', label:'Belly', svg:`<path d="M248 396 Q352 436 458 392 Q436 424 352 430 Q268 428 248 396 Z" fill="#ccfbf1" stroke="#1a2233" stroke-width="4" stroke-linejoin="round"/>`},
    {id:'neck', label:'Long Neck', svg:`<path d="M438 322 Q474 210 520 130 Q540 100 564 112 Q584 126 568 154 Q524 226 502 340 Z" fill="#2dd4bf" ${STK}/>`},
    {id:'head', label:'Head', svg:`<ellipse cx="556" cy="116" rx="44" ry="29" fill="#2dd4bf" ${STK}/><path d="M576 128 Q592 132 596 124" stroke="#0f766e" stroke-width="5" fill="none" stroke-linecap="round"/>`},
    {id:'eye', label:'Eye', svg: dinoEye(562,108,12)},
    {id:'ridge', label:'Back Bumps', svg:`<circle cx="266" cy="282" r="14" fill="#14b8a6" ${STK3}/><circle cx="316" cy="270" r="14" fill="#14b8a6" ${STK3}/><circle cx="368" cy="270" r="14" fill="#14b8a6" ${STK3}/><circle cx="418" cy="284" r="14" fill="#14b8a6" ${STK3}/>`},
    {id:'legB', label:'Back Leg', svg:`<rect x="256" y="388" width="58" height="84" rx="19" fill="#14b8a6" ${STK}/><circle cx="272" cy="466" r="7" fill="#fef9c3" ${STK3}/><circle cx="294" cy="468" r="7" fill="#fef9c3" ${STK3}/>`},
    {id:'legF', label:'Front Leg', svg:`<rect x="402" y="388" width="58" height="84" rx="19" fill="#14b8a6" ${STK}/><circle cx="418" cy="466" r="7" fill="#fef9c3" ${STK3}/><circle cx="440" cy="468" r="7" fill="#fef9c3" ${STK3}/>`},
  ]
},
/* secret — dino-truck hybrid */
{
  id:'rexrider', cat:'dino', name:'REX RIDER', sub:'Secret dino truck!', rearWheel:[235,362], lockedIf:'dinos4',
  parts:[
    {id:'susp', label:'Suspension', svg:`<rect x="222" y="262" width="26" height="104" rx="8" fill="#166534" ${STK}/><rect x="572" y="262" width="26" height="104" rx="8" fill="#166534" ${STK}/><line x1="190" y1="276" x2="280" y2="340" stroke="#1a2233" stroke-width="10" stroke-linecap="round"/><line x1="540" y1="276" x2="630" y2="340" stroke="#1a2233" stroke-width="10" stroke-linecap="round"/><rect x="200" y="252" width="420" height="20" rx="9" fill="#15803d" ${STK}/>`},
    {id:'body', label:'Scale Body', svg:`<path d="M158 196 L420 196 L450 130 L580 130 L612 196 L668 196 L676 264 L150 264 Z" fill="#4ade80" ${STK}/><path d="M180 240 q14 -16 28 0 q14 -16 28 0 q14 -16 28 0 q14 -16 28 0 q14 -16 28 0 q14 -16 28 0" fill="none" stroke="#16a34a" stroke-width="5" stroke-linecap="round"/>`},
    {id:'tailfin', label:'Tail', svg:`<path d="M162 200 Q104 176 70 188 Q98 206 130 224 Q150 232 166 226 Z" fill="#22c55e" ${STK}/>`},
    {id:'rexhead', label:'Rex Head', svg:`<path d="M598 168 Q596 110 646 94 Q700 78 748 100 Q774 112 768 130 L688 148 Q628 160 622 196 Z" fill="#4ade80" ${STK}/>`},
    {id:'rexjaw', label:'Jaw & Teeth', svg:`<path d="M630 158 Q680 152 756 132 Q776 130 772 146 Q762 168 716 178 Q664 186 636 174 Q624 168 630 158 Z" fill="#22c55e" ${STK}/><polygon points="660,150 668,166 678,146" fill="#fff" ${STK3}/><polygon points="690,143 698,159 708,139" fill="#fff" ${STK3}/><polygon points="720,135 728,151 738,131" fill="#fff" ${STK3}/>`},
    {id:'rexeye', label:'Eye', svg: dinoEye(664,118,13)+`<path d="M644 100 L686 94" stroke="#166534" stroke-width="6" stroke-linecap="round" fill="none"/>`},
    {id:'window', label:'Windows', svg:`<path d="M458 140 L572 140 L596 190 L432 190 Z" fill="#a5f3fc" ${STK}/><line x1="516" y1="142" x2="516" y2="188" stroke="#1a2233" stroke-width="5"/>`},
    {id:'pipes', label:'Bone Pipes', svg:`<rect x="396" y="100" width="20" height="100" rx="9" fill="#fef9c3" ${STK}/><ellipse cx="406" cy="100" rx="14" ry="9" fill="#e7e5e4" ${STK}/><rect x="424" y="86" width="20" height="114" rx="9" fill="#fef9c3" ${STK}/><ellipse cx="434" cy="86" rx="14" ry="9" fill="#e7e5e4" ${STK}/>`},
    {id:'wheelR', label:'Dino Wheel', svg: wheel(235,362,110,'#4ade80')},
    {id:'wheelF', label:'Dino Wheel', svg: wheel(585,362,110,'#4ade80')},
  ]
}
];

/* ============================================================
   PAINT: tinting + decals
============================================================ */
const PAINT_COLORS=['#ef4444','#f97316','#fbbf24','#84cc16','#22c55e','#2dd4bf','#38bdf8','#3b82f6','#8b5cf6','#ec4899','#f8fafc','#334155'];
const DECALS={
  flame:{label:'Flames', svg:`<path d="M-38 18 L-22 -8 L-14 6 L2 -16 L10 4 L26 -10 L34 12 L38 18 Z" fill="#fb923c" stroke="#c2410c" stroke-width="3" stroke-linejoin="round"/><path d="M-24 16 L-10 -2 L0 10 L12 -4 L20 14 Z" fill="#fde047" stroke="none"/>`},
  star:{label:'Star', svg:`<polygon points="0,-26 8,-8 27,-6 13,7 17,26 0,15 -17,26 -13,7 -27,-6 -8,-8" fill="#ffd23f" stroke="#1a2233" stroke-width="3.5" stroke-linejoin="round"/>`},
  bolt:{label:'Bolt', svg:`<polygon points="6,-30 -16,4 -3,4 -8,30 18,-6 4,-6" fill="#fde047" stroke="#1a2233" stroke-width="3.5" stroke-linejoin="round"/>`},
  heart:{label:'Heart', svg:`<path d="M0 22 C-24 4 -26 -14 -12 -18 C-4 -20 0 -12 0 -8 C0 -12 4 -20 12 -18 C26 -14 24 4 0 22 Z" fill="#fb7185" stroke="#1a2233" stroke-width="3.5" stroke-linejoin="round"/>`},
  eyes:{label:'Googly Eyes', svg:`<circle cx="-16" cy="0" r="14" fill="#fff" stroke="#1a2233" stroke-width="3.5"/><circle cx="-12" cy="3" r="6" fill="#1a2233"/><circle cx="16" cy="0" r="14" fill="#fff" stroke="#1a2233" stroke-width="3.5"/><circle cx="20" cy="2" r="6" fill="#1a2233"/>`},
  stripe:{label:'Racing Stripe', svg:`<rect x="-46" y="-10" width="92" height="8" rx="4" fill="#f8fafc" stroke="#1a2233" stroke-width="3"/><rect x="-46" y="2" width="92" height="8" rx="4" fill="#ef4444" stroke="#1a2233" stroke-width="3"/>`},
};
const INK='#1a2233';
function baseTint(svg){
  const m=svg.match(/data-tint="(#[0-9a-fA-F]{3,8})"/);
  if(m) return m[1];
  const re=/fill="(#[0-9a-fA-F]{6})"/g; let f;
  while((f=re.exec(svg))){ if(f[1]!==INK) return f[1]; }
  return null;
}
function tintSVG(svg,color){
  if(!color) return svg;
  const base=baseTint(svg);
  if(!base) return svg;
  return svg.split(`fill="${base}"`).join(`fill="${color}"`);
}
/* paintMap: {partId:color}; decals: [{d,x,y,s,r}] */
function renderVehicleSVG(truck,paintMap,decals){
  paintMap=paintMap||{}; decals=decals||[];
  const parts=truck.parts.map(p=>`<g data-part="${p.id}">${tintSVG(p.svg,paintMap[p.id])}</g>`).join('');
  const dec=decals.map((d,i)=>DECALS[d.d]?`<g class="decal" data-decal="${i}" transform="translate(${d.x} ${d.y}) scale(${d.s||1}) rotate(${d.r||0})">${DECALS[d.d].svg}</g>`:'').join('');
  return parts+dec;
}
function isDinoVehicle(truck){ return !truck.parts.some(p=>/wheel/i.test(p.id)); }
/* Little Builder: the ~7 biggest parts (plus anything iconic) are draggable, rest auto-place */
function majorPartIds(truck,bboxes){
  const iconic=/body|cab|head|wheel|hopper|bed$/i;
  const scored=truck.parts.map(p=>({id:p.id,area:(bboxes[p.id]?bboxes[p.id].w*bboxes[p.id].h:0),iconic:iconic.test(p.id)}));
  const byArea=[...scored].sort((a,b)=>b.area-a.area);
  const set=new Set(byArea.slice(0,7).map(s=>s.id));
  scored.forEach(s=>{ if(s.iconic) set.add(s.id); });
  return set;
}

/* ============================================================
   SCENES — finale / photo / drive backdrops (1000x560, ground y=426)
============================================================ */
function victimCar(){
  return `<g id="victim" transform="translate(700,0)">
    <g id="victimBody">
      <path d="M10 388 Q14 360 44 356 L66 326 Q72 316 86 316 L138 316 Q152 316 158 326 L178 356 Q206 360 210 388 L210 404 L10 404 Z" fill="#2dd4bf" ${STK}/>
      <path d="M76 326 L134 326 L150 354 L66 354 Z" fill="#bae6fd" stroke="#1a2233" stroke-width="4"/>
      <circle cx="56" cy="404" r="22" fill="#222a38" ${STK}/><circle cx="56" cy="404" r="10" fill="#cdd6e3"/>
      <circle cx="164" cy="404" r="22" fill="#222a38" ${STK}/><circle cx="164" cy="404" r="10" fill="#cdd6e3"/>
    </g>
  </g>`;
}
function truckScene(){
  const stars=Array.from({length:40},()=>`<circle cx="${Math.random()*1000}" cy="${Math.random()*300}" r="${1+Math.random()*1.6}" fill="#fff" opacity="${.3+Math.random()*.7}"/>`).join('');
  return `
    <defs><linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c1230"/><stop offset=".62" stop-color="#1b2a5e"/><stop offset="1" stop-color="#2c3f7a"/>
    </linearGradient></defs>
    <rect width="1000" height="560" fill="url(#bgG)"/>
    ${stars}
    <path d="M0 330 L0 250 L60 250 L60 290 L130 290 L130 210 L200 210 L200 300 L280 300 L280 240 L350 240 L350 310 L430 310 L430 260 L520 260 L520 300 L600 300 L600 230 L680 230 L680 310 L770 310 L770 270 L860 270 L860 320 L1000 320 L1000 330 Z" fill="#161f45"/>
    <rect y="330" width="1000" height="100" fill="#3b4a85" opacity=".5"/>
    <rect y="426" width="1000" height="134" fill="#252b3e"/>
    <rect y="426" width="1000" height="8" fill="#11151f"/>
    <g>${Array.from({length:10},(_,i)=>`<rect x="${i*110}" y="492" width="56" height="8" rx="4" fill="#f4d35e" opacity=".85"/>`).join('')}</g>`;
}
function dinoScene(){
  const stars=Array.from({length:30},()=>`<circle cx="${Math.random()*1000}" cy="${Math.random()*240}" r="${1+Math.random()*1.5}" fill="#fff" opacity="${.3+Math.random()*.6}"/>`).join('');
  return `
    <defs><linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1c1038"/><stop offset=".55" stop-color="#5b2a52"/><stop offset="1" stop-color="#b14b32"/>
    </linearGradient></defs>
    <rect width="1000" height="560" fill="url(#bgG)"/>
    ${stars}
    <circle cx="820" cy="180" r="56" fill="#ffe9a8" opacity=".9"/>
    <path d="M40 426 L210 180 L290 290 L350 220 L470 426 Z" fill="#2a1530"/>
    <path d="M196 200 Q210 168 224 200 Q236 178 218 158 Q200 174 196 200 Z" fill="#ff6b35" opacity=".95"/>
    <circle cx="214" cy="150" r="9" fill="#ffae00" opacity=".8"/><circle cx="232" cy="128" r="6" fill="#ffd23f" opacity=".7"/>
    <path d="M560 426 Q566 320 600 300 Q590 360 596 426 Z" fill="#1d2e1a"/>
    <path d="M600 304 Q560 280 540 292 Q572 296 598 312 Z M600 304 Q640 276 662 290 Q628 294 602 312 Z M600 304 Q596 262 612 248 Q606 282 604 310 Z" fill="#2f5d2a"/>
    <path d="M880 426 Q884 340 910 324 Q902 372 906 426 Z" fill="#1d2e1a"/>
    <path d="M910 328 Q878 308 862 318 Q888 322 908 334 Z M910 328 Q942 304 960 316 Q932 320 912 334 Z" fill="#2f5d2a"/>
    <rect y="426" width="1000" height="134" fill="#4a2e1d"/>
    <rect y="426" width="1000" height="8" fill="#2a1810"/>
    <ellipse cx="180" cy="470" rx="40" ry="9" fill="#3a2315"/><ellipse cx="480" cy="500" rx="56" ry="11" fill="#3a2315"/>`;
}
function garageScene(){
  const tools=`<rect x="60" y="150" width="220" height="150" rx="8" fill="#33415c" stroke="#1f2937" stroke-width="5"/>
    <rect x="80" y="170" width="80" height="10" rx="5" fill="#94a3b8"/><rect x="80" y="200" width="120" height="10" rx="5" fill="#fbbf24"/>
    <rect x="80" y="230" width="60" height="10" rx="5" fill="#ef4444"/><rect x="170" y="230" width="80" height="10" rx="5" fill="#94a3b8"/>
    <circle cx="240" cy="190" r="16" fill="#f97316" stroke="#1f2937" stroke-width="4"/>`;
  return `
    <defs><linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#26324e"/><stop offset="1" stop-color="#3a4a6e"/>
    </linearGradient></defs>
    <rect width="1000" height="560" fill="url(#bgG)"/>
    <rect x="0" y="0" width="1000" height="70" fill="#1d2740"/>
    ${Array.from({length:5},(_,i)=>`<rect x="${90+i*190}" y="60" width="60" height="18" rx="8" fill="#ffe9a8" opacity=".9"/><polygon points="${120+i*190},78 ${60+i*190},210 ${180+i*190},210" fill="#ffe9a8" opacity=".10"/>`).join('')}
    ${tools}
    <rect x="700" y="180" width="190" height="246" rx="10" fill="#475569" stroke="#1f2937" stroke-width="5"/>
    <rect x="700" y="180" width="190" height="30" rx="10" fill="#ef4444"/><rect x="700" y="240" width="190" height="14" fill="#1f2937"/>
    <rect x="700" y="310" width="190" height="14" fill="#1f2937"/><rect x="770" y="200" width="50" height="8" rx="4" fill="#0f172a"/>
    <rect y="426" width="1000" height="134" fill="#2f3a52"/>
    <rect y="426" width="1000" height="8" fill="#171e30"/>
    ${Array.from({length:6},(_,i)=>`<rect x="${i*180}" y="480" width="90" height="10" rx="5" fill="#ffd23f" opacity=".28" transform="skewX(-30)"/>`).join('')}`;
}
const PHOTO_BACKDROPS={
  garage:{label:'🔧 Garage', fn:garageScene},
  city:{label:'🌃 City Night', fn:truckScene},
  volcano:{label:'🌋 Volcano', fn:dinoScene},
};
