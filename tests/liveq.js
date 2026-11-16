// Clasificación en directo: una sesión completa con todos los coches (el jugador en piloto automático).
// Uso: node tests/liveq.js index.html   (TR=4,0 · QT=300 segundos · W=dry|var|rain)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
const QT=+(process.env.QT||300),W=process.env.W||'dry';
for(const ti of (process.env.TR||'4,0').split(',').map(Number)){
  const est=A.simEstimate(ti,1,'sim'),roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
  const R=A.makeSession({track:ti,laps:99,mult:0,mode:'quali',liveQ:true,qTime:QT,fx:true,est,steerMode:'sim',weather:W,weatherSeed:77+ti,grid:roster,autopilot:true,qualiCompound:'S'});
  const out={};let flagT=null,crash=0;
  while(!R.liveQ.end&&R.t<QT+600){A.stepRace(R,1/120);
    for(const c of R.cars){if(c.pit!=='service'&&out[c.name]==null)out[c.name]=R.liveQ.t;}
    for(const e of R.events){if(e.type==='qflag')flagT=R.t;if(e.type==='wreck')crash++;}R.events.length=0;}
  const list=R.cars.map(c=>({n:c.name,best:c.bestLap,laps:c.qLaps,sale:out[c.name],sk:c.skill})).sort((a,b)=>(a.best||1e9)-(b.best||1e9));
  console.log(`== ${A.TRACKS[ti].short} · sesión ${QT}s · vuelta de referencia ${est.lap.toFixed(1)}s · terminó a los ${R.liveQ.t.toFixed(0)}s · sin tiempo: ${list.filter(x=>!x.best).length} · accidentes ${crash}`);
  for(const x of list)console.log('  '+x.n.padEnd(14),x.best?x.best.toFixed(3):'sin tiempo','· vueltas válidas',x.laps,'· sale a los',x.sale==null?'-':x.sale.toFixed(0)+'s','· nivel',x.sk.toFixed(3));
}
