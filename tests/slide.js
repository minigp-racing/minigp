// Accidentes: cuánto desliza el chasis destrozado con la inercia que llevaba y cuántos restos quedan.
// Uso: node tests/slide.js index.html
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,TRACKS,wreck,KMH};')();
const res=[];
for(const ti of [0,4,12])for(let s=0;s<4;s++){const est=A.simEstimate(ti,1,'sim');
  const R=A.makeSession({track:ti,laps:5,mult:1,mode:'race',steerMode:'sim',fx:true,est,grid:A.rosterFromTeams(A.DEFAULT_TEAMS,8,'normal'),playerFuel:'full',playerCompound:'M',autopilot:true});
  while(R.phase!=='race'&&R.t<60)A.stepRace(R,1/120);const t0=R.t;let c=null;
  while(R.t<t0+200){A.stepRace(R,1/120);const x=R.cars.find(o=>!o.dnf&&Math.hypot(o.vx,o.vy)*A.KMH>230+s*15);if(x&&R.t>t0+20+s*7){c=x;break;}}
  if(!c)continue;const v0=Math.hypot(c.vx,c.vy)*A.KMH,x0=c.x,y0=c.y;A.wreck(R,c,380,6,-Math.sin(c.a),Math.cos(c.a));let tStop=null;
  while(R.t<t0+400){A.stepRace(R,1/120);R.events.length=0;if(Math.hypot(c.vx,c.vy)<5){tStop=R.t;break;}}
  res.push({v0,d:Math.hypot(c.x-x0,c.y-y0)/6.5,deb:R.debris.length});}
const m=k=>res.reduce((a,b)=>a+b[k],0)/res.length;
console.log('choques',res.length,'· velocidad media',m('v0').toFixed(0),'km/h · deslizamiento medio',m('d').toFixed(0),'m (máx',Math.max(...res.map(r=>r.d)).toFixed(0),') · restos',m('deb').toFixed(0));
