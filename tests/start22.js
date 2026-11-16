const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
const n=+process.argv[3]||22;let T={hits:0,spin:0,wreck:0,dmg:0,runs:0};const per={};
for(const ti of (process.env.TR||'0,4,12,1,2').split(',').map(Number))for(let s=0;s<4;s++){const est=A.simEstimate(ti,2,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,n,'normal');
 const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
 const R=A.makeSession({track:ti,laps:5,mult:2,mode:'race',steerMode:'sim',fx:true,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true});
 while(R.phase!=='race'&&R.t<60)A.stepRace(R,1/120);const t0=R.t;
 while(R.t<t0+50){A.stepRace(R,1/120);for(const e of R.events){if(e.type==='hit'&&e.power>60)T.hits++;if(e.type==='spinout')T.spin++;if(e.type==='wreck')T.wreck++;if(e.type==='damage')T.dmg++;}R.events.length=0;}
 T.runs++;per[ti]=(per[ti]||0)+R.cars.filter(c=>c.dnf).length;}
console.log('por salida: golpes',(T.hits/T.runs).toFixed(1),'trompos',(T.spin/T.runs).toFixed(2),'destrozados',(T.wreck/T.runs).toFixed(2),'daños',(T.dmg/T.runs).toFixed(1),'abandonos por circuito',JSON.stringify(per));
