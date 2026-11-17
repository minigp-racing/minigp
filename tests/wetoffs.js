// Salidas de pista de los bots en carrera con lluvia: dónde (tramo de la pista), con qué goma y cuánta agua.
// Uso: node tests/wetoffs.js index.html  (TR=1 · W=rain · T=400 · SEEDS=1,2,3)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,TRACKS};')();
const T=+(process.env.T||400),W=process.env.W||'rain';
for(const ti of (process.env.TR||'1').split(',').map(Number)){const est=A.simEstimate(ti,1,'sim');let tot=0,tl=0,lapsAll=[];const where={},comp={};
  for(const seed of (process.env.SEEDS||'1,2,3').split(',').map(Number)){
    const R=A.makeSession({track:ti,laps:30,mult:1,mode:'race',steerMode:'sim',fx:true,est,grid:A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal'),playerFuel:'full',playerCompound:'W',autopilot:true,weather:W,weatherSeed:seed});
    const N=R.tr.N,was={};let l1=0;
    while(R.t<T){A.stepRace(R,1/120);R.events.length=0;
      for(const c of R.cars){if(c.off&&!was[c.id]&&!c.dnf&&!c.pit){tot++;if(c.lap<=1)l1++;const b=Math.floor(c.idx/N*40);where[b]=(where[b]||0)+1;comp[c.compound]=(comp[c.compound]||0)+1;}was[c.id]=c.off;}}
    tl+=l1;lapsAll.push(...R.cars.filter(c=>!c.dnf).map(c=>c.lapTimes.slice(1)).flat());}
  const med=lapsAll.sort((a,b)=>a-b)[Math.floor(lapsAll.length/2)];
  console.log(A.TRACKS[ti].short,W,'salidas',tot,'(vuelta 1:',tl+') goma',JSON.stringify(comp),'vuelta mediana',med?med.toFixed(1):'-');
  console.log('  por tramo (40 tramos, 0=salida):',Object.entries(where).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>k+':'+v).join(' '));}
