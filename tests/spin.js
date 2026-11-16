// Patinaje con el acelerador a fondo (como se juega con teclado): desde parado y saliendo de una curva lenta.
// Uso: node tests/spin.js index.html
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,KMH};')();
const mk=aids=>{const R=A.makeSession({track:0,laps:5,mult:0,mode:'quali',fx:true,aids,est:{fuel:8,wear:0.05},steerMode:'sim',grid:[{name:'p',color:'#f00',isPlayer:true,skill:1,team:0}]});R.steerCfg={gain:7,rate:6};return R;};
for(const aids of [true,false]){
  // 1) desde parado, a fondo y recto
  {const R=mk(aids),c=R.cars[0];c.bot=false;R.input={up:1,down:0,left:0,right:0};let t100=null,sp=0,mx=0;const t0=R.t;
   for(let i=0;i<120*6;i++){A.stepRace(R,1/120);const k=Math.hypot(c.vx,c.vy)*A.KMH;if(t100==null&&k>=100)t100=R.t-t0;if((c.spinW||0)>0.25)sp+=1/120;mx=Math.max(mx,c.spinW||0);}
   console.log((aids?'con ayudas':'sin ayudas').padEnd(11),'· parado a fondo: 0-100',t100.toFixed(2),'s · patinando',sp.toFixed(2),'s · máx',mx.toFixed(2));}
  // 2) a 80 km/h girando a fondo y pisando a fondo: ¿se va la trasera?
  {const R=mk(aids),c=R.cars[0];c.bot=true;R.input={up:1,down:0,left:0,right:0};
   while(!(Math.hypot(c.vx,c.vy)*A.KMH>80&&!R.tr.corner[c.idx]&&Math.abs(c.lat)<20)&&R.t<120)A.stepRace(R,1/120);
   c.bot=false;R.input={up:1,down:0,left:0,right:1};let mb=0,sp=0,mr=0;const t0=R.t;
   while(R.t<t0+1.2){A.stepRace(R,1/120);const fx=Math.cos(c.a),fy=Math.sin(c.a),vf=c.vx*fx+c.vy*fy,vl=-c.vx*fy+c.vy*fx;mb=Math.max(mb,Math.abs(Math.atan2(vl,Math.max(20,Math.abs(vf))))*57.3);if((c.spinW||0)>0.25)sp+=1/120;mr=Math.max(mr,Math.abs(c.r));}
   console.log(''.padEnd(11),'· curva lenta a fondo: cruce máx',mb.toFixed(1)+'°','· patinando',sp.toFixed(2),'s · giro máx',mr.toFixed(2),'rad/s');}
}
