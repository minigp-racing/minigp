// Doblados con safety car: se fuerza a dos coches a ir una vuelta por detrás, se provoca un accidente y se mira
// si pasan al safety car, recuperan la vuelta y cuándo se retira el coche de seguridad.
// Uso: node tests/unlap.js index.html
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS,wreck};')();
for(const ti of [0,4]){const est=A.simEstimate(ti,2,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
  const R=A.makeSession({track:ti,laps:12,mult:1,mode:'race',steerMode:'sim',fx:true,est,grid:roster,playerFuel:'full',playerCompound:'M',autopilot:true});
  while(R.t<200)A.stepRace(R,1/120);
  const N=R.tr.N,st=R.standings,lapped=[st[st.length-1],st[st.length-2]];for(const c of lapped){c.lap-=1;c.prog-=N;}
  A.wreck(R,st[6],500,0,0,0);const t0=R.t;let ev=[];
  while(R.t<t0+300){A.stepRace(R,1/120);for(const e of R.events)if(['unlap_all','sc_in','sc_pit','sc_end','sc'].includes(e.type))ev.push(e.type+'@'+(R.t-t0).toFixed(0));R.events.length=0;if(R.sc==null&&R.t-t0>20)break;}
  const lead=R.standings[0];
  console.log(A.TRACKS[ti].short,"SC duró",ev.find(x=>x.startsWith("sc_in")),'eventos',ev.join(' '),'| doblados ahora:',lapped.map(c=>c.name+' '+((lead.prog-c.prog)/N).toFixed(2)+' v · unlap '+!!c.unlap).join(' · '),'| choques en cola', R.cars.filter(c=>c.dnf).length);
}
