const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
const n=+process.argv[3]||22;let tot=0,runs=0,l1=0;
for(const ti of [0,4,12,1])for(let s=0;s<3;s++){const est=A.simEstimate(ti,2,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,n,'normal');
 const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
 const R=A.makeSession({track:ti,laps:5,mult:2,mode:'race',steerMode:'sim',fx:false,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true});R.phase='race';
 while(R.t<900&&!R.cars.every(c=>c.finished||c.dnf))A.stepRace(R,1/120);
 const acc=R.cars.filter(c=>c.dnfReason==='Accidente');tot+=acc.length;runs++;l1+=acc.filter(c=>c.wreckT<60).length;}
console.log('accidentes/carrera',(tot/runs).toFixed(2),'en vuelta 1',(l1/runs).toFixed(2));
