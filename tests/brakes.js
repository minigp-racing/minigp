// Temperatura y desgaste de frenos en carrera (todos los coches en piloto automático).
// Uso: node tests/brakes.js index.html   (TR=0,4,12,1,2)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
for(const ti of (process.env.TR||'0,4,12,1,2').split(',').map(Number)){
  const est=A.simEstimate(ti,2,'sim'),roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
  const R=A.makeSession({track:ti,laps:5,mult:2,mode:'race',steerMode:'sim',fx:false,est,grid:roster,playerFuel:'full',playerCompound:'M',autopilot:true});
  while(R.phase!=='race'&&R.t<60)A.stepRace(R,1/120);
  let mx=0,sum=0,n=0,hot=0,hotDirty=0,nDirty=0,cold=0;
  while(R.t<500&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,1/120);
    for(const c of R.cars){if(c.dnf||c.pit||c.finished)continue;mx=Math.max(mx,c.bT);sum+=c.bT;n++;if(c.bT>950)hot++;if(c.bT<250)cold++;if(c.dirty>0.35){nDirty++;if(c.bT>950)hotDirty++;}}}
  const bw=R.cars.map(c=>c.bW||0);
  console.log(A.TRACKS[ti].short.padEnd(12),'media',Math.round(sum/n)+'°','máx',Math.round(mx)+'°','· >950°:',(100*hot/n).toFixed(1)+'%','(en aire sucio',(100*hotDirty/Math.max(1,nDirty)).toFixed(1)+'%) · <250°:',(100*cold/n).toFixed(1)+'%','· desgaste medio',(bw.reduce((a,b)=>a+b,0)/bw.length*100).toFixed(0)+'% máx',(Math.max(...bw)*100).toFixed(0)+'%');
}
