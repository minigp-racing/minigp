// Salidas de pista de los bots en carrera (16 coches, depósito lleno): cuántas, cuántas con rival cerca y la vuelta media.
// Uso: node tests/offs.js index.html  (TR=4,0,12 · T=400 segundos)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,TRACKS};')();
const T=+(process.env.T||400);
for(const ti of (process.env.TR||'4,0,12').split(',').map(Number)){const est=A.simEstimate(ti,1,'sim');
  const R=A.makeSession({track:ti,laps:30,mult:1,mode:'race',steerMode:'sim',fx:true,est,grid:A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal'),playerFuel:'full',playerCompound:'M',autopilot:true});
  const was={};let n=0,near=0,hits=0;while(R.t<T){A.stepRace(R,1/120);for(const e of R.events)if(e.type==='hit')hits++;R.events.length=0;
    for(const c of R.cars){if(c.off&&!was[c.id]&&!c.dnf&&!c.pit){n++;if(R.cars.some(o=>o!==c&&!o.pit&&Math.abs(o.prog-c.prog)<5&&Math.abs(o.lat-c.lat)<40))near++;}was[c.id]=c.off;}}
  const laps=R.cars.filter(c=>!c.dnf).map(c=>c.lapTimes.slice(1)).flat();const med=laps.sort((a,b)=>a-b)[Math.floor(laps.length/2)];
  console.log(A.TRACKS[ti].short.padEnd(10),'salidas',n,'(con rival cerca',near+')','· golpes',hits,'· vuelta mediana',med?med.toFixed(2):'-','· abandonos',R.cars.filter(c=>c.dnf).length);}
