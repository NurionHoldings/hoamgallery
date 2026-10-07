import vm from 'node:vm';import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const events={},frames=new Map();let nextId=0,dialog=false;class Element{matches(){return false}}
const fine={matches:true,addEventListener(){}},reduce={matches:false,addEventListener(){}};
const context={Element,Math,innerHeight:800,scrollY:100,matchMedia:q=>q.includes('pointer')?fine:reduce,document:{documentElement:{scrollHeight:3000},body:{},querySelector:()=>dialog?{}:null,addEventListener(){}},getComputedStyle:()=>({overflowY:'visible'}),addEventListener:(n,f)=>events[n]=f,requestAnimationFrame:f=>{frames.set(++nextId,f);return nextId},cancelAnimationFrame:id=>frames.delete(id),scrollTo:o=>context.scrollY=o.top};
vm.runInNewContext(readFileSync('dist/inertia.js','utf8'),context);
const wheel=(delta=120,extra={})=>{let prevented=false;events.wheel({deltaX:0,deltaY:delta,deltaMode:0,target:null,preventDefault(){prevented=true},...extra});return prevented};
assert.equal(wheel(),true);for(let n=1;n<100&&frames.size;n++){const [id,fn]=frames.entries().next().value;frames.delete(id);fn(n*16)}assert(Math.abs(context.scrollY-220)<1);assert.equal(frames.size,0);
assert.equal(wheel(12),false);assert.equal(wheel(120,{ctrlKey:true}),false);reduce.matches=true;assert.equal(wheel(),false);reduce.matches=false;fine.matches=false;assert.equal(wheel(),false);fine.matches=true;dialog=true;assert.equal(wheel(),false);dialog=false;
wheel();assert(frames.size);events.keydown();assert.equal(frames.size,0);context.scrollY=2200;assert.equal(wheel(),false);console.log('PASS: short inertia settles; native trackpad/touch, zoom, reduced motion, dialogs, keyboard and bottom boundary preserved');
