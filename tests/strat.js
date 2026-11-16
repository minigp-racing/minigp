// Estrategia de los bots: cada parada con su vuelta, motivo y gomas; resumen de paradas tempranas (vueltas 1-2).
// Uso: node tests/strat.js index.html   (W=dry|var · TR=0,4,12,1 · LAPS=5 · RUNS=2)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,COMPOUNDS,TRACKS};')();
const W=process.env.W||'dry',laps=+(process.env.LAPS||5),runs=+(process.env.RUNS||2),mult=+(process.env.MULT||1);
let tot=0,early=0,cars=0,why={},startComp={},ex=[];
for(const ti of (process.env.TR||'0,4,12,1').split(',').map(Number))for(let s=0;s<runs;s++){
  const est=A.simEstimate(ti,mult,'sim'),roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
  const R=A.makeSession({track:ti,laps,mult,mode:'race',steerMode:'sim',fx:true,est,grid:roster,playerFuel:'full',playerCompound:'M',autopilot:true,weather:W,weatherSeed:1000+ti*10+s});
  for(const c of R.cars){if(c.isPlayer)continue;startComp[c.compound]=(startComp[c.compound]||0)+1;c._f0=c.fuel;}cars+=R.cars.length-1;
  while(R.phase!=='race'&&R.t<60)A.stepRace(R,1/120);
  const prev=new Map();
  while(R.t<laps*(est.lap||100)*1.6+120&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,1/120);
    for(const e of R.events){if(e.type==='pitstop'&&e.car&&!e.car.isPlayer){const c=e.car;tot++;
      const r=A.COMPOUNDS[c.compound].wet!==A.COMPOUNDS[c.nextCompound].wet||(c.compound!==c.nextCompound&&A.COMPOUNDS[c.compound].wet)?'lluvia':c.fuelCall?'gasolina':(c.punct||c.dWing>0.15||c.dSusp>0.25||c.wheelOff!=null)?'daños':'neumáticos';
      why[r]=(why[r]||0)+1;if(c.lap<=2){early++;if(ex.length<14)ex.push(`${A.TRACKS[ti].short} V${c.lap} ${c.name}: ${r} · ${c.compound}→${c.nextCompound} · desgaste ${(c.wear*100).toFixed(0)}% · gasolina ${c.fuel.toFixed(1)} L (salió con ${c._f0.toFixed(1)}) · ${(c.fuelAdd||0).toFixed(1)} L`);}}}
    R.events.length=0;}
}
console.log(`Tiempo ${W} · ${laps} vueltas · consumo x${mult} · ${cars} coches-carrera`);
console.log('salen con:',JSON.stringify(startComp));
console.log('paradas por coche',(tot/cars).toFixed(2),'· motivos',JSON.stringify(why),'· paradas en vueltas 1-2:',early);
for(const l of ex)console.log('  '+l);
