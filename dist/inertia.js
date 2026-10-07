// A short easing tail for desktop mouse wheels; touch and trackpads stay native.
(()=>{
 const fine=matchMedia('(pointer: fine)'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,target=0,last=0;
 const limit=()=>Math.max(0,document.documentElement.scrollHeight-innerHeight);
 const stop=()=>{if(frame)cancelAnimationFrame(frame);frame=0;last=0;target=scrollY};
 function tick(time){const elapsed=last?Math.min(time-last,40):16;last=time;target=Math.max(0,Math.min(limit(),target));const remaining=target-scrollY;if(Math.abs(remaining)<.75){scrollTo({top:target,behavior:'instant'});frame=0;last=0;return}scrollTo({top:scrollY+remaining*(1-Math.exp(-elapsed/85)),behavior:'instant'});frame=requestAnimationFrame(tick)}
 function nested(node){for(let el=node instanceof Element?node:null;el&&el!==document.body;el=el.parentElement){if(el.matches('dialog,input,textarea,select,[contenteditable="true"],video'))return true;const css=getComputedStyle(el);if(/auto|scroll/.test(css.overflowY)&&el.scrollHeight>el.clientHeight+1)return true}return false}
 addEventListener('wheel',e=>{
  if(!fine.matches||reduce.matches||e.ctrlKey||e.metaKey||e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||nested(e.target)||document.querySelector('dialog[open]')){stop();return}
  // Small pixel deltas already contain a trackpad's native inertial tail.
  if(e.deltaMode===0&&Math.abs(e.deltaY)<40){stop();return}
  const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
  if(!frame)target=scrollY;
  const next=Math.max(0,Math.min(limit(),target+delta));if(next===target){stop();return}
  e.preventDefault();target=next;if(!frame)frame=requestAnimationFrame(tick);
 },{passive:false});
 addEventListener('keydown',stop,{passive:true});addEventListener('pointerdown',stop,{passive:true});addEventListener('touchstart',stop,{passive:true});addEventListener('resize',stop,{passive:true});addEventListener('hashchange',stop,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});reduce.addEventListener('change',stop);fine.addEventListener('change',stop);
})();
