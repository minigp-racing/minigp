// Estilos de los bots: posición media, victorias (sin contar al jugador), errores y adelantamientos por piloto.
// Uso: node tests/styles.js index.html   (TR=0,4,12,1 · RUNS=2 por circuito)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali};')();
const S={},runs=+(process.env.RUNS||2);let races=0;
for(const ti of (process.env.TR||'0,4,12,1').split(',').map(Number))for(let s=0;s<runs;s++){
  const est=A.simEstimate(ti,2,'sim'),roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
  const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
  const R=A.makeSession({track:ti,laps:5,mult:2,mode:'race',steerMode:'sim',fx:true,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true});
  q.forEach((x,k)=>{const n=x.e.name;S[n]=S[n]||{st:x.e.tr.style||'-',pos:0,grid:0,win:0,err:0,n:0,dnf:0};S[n].grid+=k+1;});
  while(R.phase!=='race'&&R.t<60)A.stepRace(R,1/120);
  while(R.t<600&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,1/120);for(const e of R.events)if(e.type==='incident'&&e.car&&S[e.car.name])S[e.car.name].err++;R.events.length=0;}
  const order=R.cars.filter(c=>!c.dnf).sort((a,b)=>(a.finishTime||1e9)-(b.finishTime||1e9)||b.prog-a.prog).concat(R.cars.filter(c=>c.dnf));
  const bots=order.filter(c=>!c.isPlayer);
  order.forEach((c,k)=>{const x=S[c.name];x.pos+=k+1;x.n++;if(c.dnf)x.dnf++;});
  if(bots[0])S[bots[0].name].win++;races++;
}
const rows=Object.entries(S).map(([n,x])=>({piloto:n,estilo:x.st,salida:(x.grid/x.n).toFixed(1),llegada:(x.pos/x.n).toFixed(1),'gana (bots)':x.win,errores:(x.err/x.n).toFixed(1),abandonos:x.dnf})).sort((a,b)=>a.llegada-b.llegada);
console.log(races+' carreras');console.table(rows);
