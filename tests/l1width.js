// Salida: ¿ocupan los bots todo el ancho al llegar a la primera curva? Posición lateral de cada coche 40 puntos antes de la curva 1
// en la vuelta 1: dispersión (px) y % de coches por el exterior (|lat|>25). Pista: semiancho W=60 px.
// Uso: node tests/l1width.js index.html  (TR=0,4,12,1,2 · RUNS=3)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
let all=[],outer=0;
for(const ti of (process.env.TR||'0,4,12,1,2').split(',').map(Number))for(let s=0;s<+(process.env.RUNS||3);s++){
  const est=A.simEstimate(ti,2,'sim'),roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
  const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
  const R=A.makeSession({track:ti,laps:5,mult:2,mode:'race',steerMode:'sim',fx:false,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true});
  const tr=R.tr,N=tr.N;let c1=0;while(c1<N&&!tr.corner[c1])c1++;const ref=Math.max(5,c1-40),got={};
  while(R.t<90&&Object.keys(got).length<R.cars.length){A.stepRace(R,1/120);
    for(const c of R.cars)if(got[c.id]==null&&R.phase==='race'&&c.idx>=ref&&c.idx<ref+20){got[c.id]=c.lat;all.push(c.lat);if(Math.abs(c.lat)>25)outer++;}}}
const m=all.reduce((a,b)=>a+b,0)/all.length,sd=Math.sqrt(all.reduce((a,b)=>a+(b-m)*(b-m),0)/all.length);
console.log('antes de la curva 1: dispersión lateral',sd.toFixed(1),'px · por el exterior',(100*outer/all.length).toFixed(0)+'%','·',all.length,'coches');
