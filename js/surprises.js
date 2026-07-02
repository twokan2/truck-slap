/* ============================================================
   TAP SURPRISES (F5) — finished vehicles react to pokes.
   Attach once per rendered SVG; every effect is <1.5s and
   interruptible (re-tapping cancels the running animation).
============================================================ */
const NSVG='http://www.w3.org/2000/svg';

function partCenter(g){
  try{ const b=g.getBBox(); return {x:b.x+b.width/2,y:b.y+b.height/2,b}; }
  catch(e){ return {x:0,y:0,b:{x:0,y:0,width:0,height:0}}; }
}
function animPart(g,frames,ms,origin){
  g.style.transformBox='fill-box';
  g.style.transformOrigin=origin||'center';
  (g.getAnimations?g.getAnimations():[]).forEach(a=>a.cancel());
  return g.animate(frames,{duration:ms,easing:'ease-in-out'});
}
function svgPuff(svgRoot,x,y,color){
  const g=document.createElementNS(NSVG,'g');
  g.innerHTML=Array.from({length:4},(_,i)=>
    `<circle cx="${x+(Math.random()*20-10)}" cy="${y}" r="${7+Math.random()*6}" fill="${color||'#cfd6e4'}" opacity=".7">
      <animate attributeName="cy" to="${y-60-Math.random()*30}" dur="0.9s" fill="freeze"/>
      <animate attributeName="opacity" to="0" dur="0.9s" fill="freeze"/>
      <animate attributeName="r" to="${16+Math.random()*8}" dur="0.9s" fill="freeze"/>
    </circle>`).join('');
  svgRoot.appendChild(g);
  setTimeout(()=>g.remove(),950);
}
function svgFlash(svgRoot,x,y,r){
  const c=document.createElementNS(NSVG,'circle');
  c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r||34);
  c.setAttribute('fill','#fffbe6');c.setAttribute('opacity','.95');
  svgRoot.appendChild(c);
  c.animate([{opacity:.95},{opacity:0}],{duration:420,iterations:2}).onfinish=()=>c.remove();
  setTimeout(()=>c.remove(),900);
}

function doSurprise(svgRoot,truck,g,pid){
  const c=partCenter(g);
  if(/wheel|spare/i.test(pid)){
    sndSqueak();
    animPart(g,[{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],550);
    return true;
  }
  if(/pipes|stacks/i.test(pid)){
    sndPutt();
    svgPuff(svgRoot,c.x,c.b.y,'#cfd6e4');
    return true;
  }
  if(truck.cat==='dino'&&/jaw|head/i.test(pid)){
    const jaw=svgRoot.querySelector('[data-part="jaw"],[data-part="rexjaw"]');
    sndChomp();
    if(jaw) animPart(jaw,[{transform:'rotate(0deg)'},{transform:'rotate(13deg)'},{transform:'rotate(0deg)'},{transform:'rotate(10deg)'},{transform:'rotate(0deg)'}],800,'left top');
    else animPart(g,[{transform:'rotate(0deg)'},{transform:'rotate(-4deg)'},{transform:'rotate(0deg)'}],500);
    return true;
  }
  if(/eye/i.test(pid)){
    sndBlink();
    animPart(g,[{transform:'scaleY(1)'},{transform:'scaleY(.08)'},{transform:'scaleY(1)'},{transform:'scaleY(.08)'},{transform:'scaleY(1)'}],700);
    return true;
  }
  if(/grille|light|beacon|guard/i.test(pid)){
    hornFor(truck.id)();
    svgFlash(svgRoot,c.x,c.y,Math.max(c.b.width,c.b.height)*.5+14);
    return true;
  }
  if(/cone/i.test(pid)){
    sndBoing();
    animPart(g,[{transform:'translateY(0)'},{transform:'translateY(-26px)'},{transform:'translateY(0)'},{transform:'translateY(-10px)'},{transform:'translateY(0)'}],750);
    return true;
  }
  if(/flame|fin$/i.test(pid)){
    tone(200,700,.3,'sawtooth',.1);
    animPart(g,[{opacity:1,transform:'scale(1)'},{opacity:.6,transform:'scale(1.08)'},{opacity:1,transform:'scale(1)'},{opacity:.7,transform:'scale(1.05)'},{opacity:1,transform:'scale(1)'}],700);
    return true;
  }
  if(/tail|arms|horns|spikes|plates/i.test(pid)){
    sndBoing();
    animPart(g,[{transform:'rotate(0deg)'},{transform:'rotate(6deg)'},{transform:'rotate(-5deg)'},{transform:'rotate(0deg)'}],600);
    return true;
  }
  return false;
}

function attachSurprises(svgRoot,truck){
  svgRoot.addEventListener('pointerdown',e=>{
    let el=e.target;
    while(el&&el!==svgRoot&&!(el.dataset&&el.dataset.part)) el=el.parentNode;
    if(el&&el!==svgRoot&&el.dataset&&el.dataset.part){
      if(doSurprise(svgRoot,truck,el,el.dataset.part)) e.stopPropagation();
    }
  });
}
