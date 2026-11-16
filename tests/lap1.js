// Ritmo de los bots en la primera vuelta: metros recorridos de media en los primeros 40 s y separación entre el 1.º y el último.
// Uso: node tests/lap1.js index.html [coches]
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali};')();
const n=+process.argv[3]||16;let dist=0,spread=0,runs=0;
for(const ti of (process.env.TR||'0,4,12,1,2').split(',').map(Number))for(let s=0;s<3;s++){
  const est=A.simEstimate(ti,2,'sim'),roster=A.rosterFromTeams(A.DEFAULT_TEAMS,n,'normal');
  const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
  const R=A.makeSession({track:ti,laps:5,mult:2,mode:'race',steerMode:'sim',fx:false,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true});
  while(R.phase!=='race'&&R.t<60)A.stepRace(R,1/120);const t0=R.t,p0=R.cars.map(c=>c.prog);
  while(R.t<t0+40)A.stepRace(R,1/120);
  const d=R.cars.map((c,i)=>(c.prog-p0[i])*R.tr.sp/6.5);dist+=d.reduce((a,b)=>a+b,0)/d.length;spread+=Math.max(...d)-Math.min(...d);runs++;}
console.log('primeros 40 s: media',(dist/runs).toFixed(0),'m · diferencia 1.º-último',(spread/runs).toFixed(0),'m');
