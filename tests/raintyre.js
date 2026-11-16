const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,TRACKS,COMPOUNDS};')();
let bad=0,tot=0,badDry=0;
for(const ti of [0,4,1])for(const seed of [11,23,57,91]){const est=A.simEstimate(ti,2,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
 const R=A.makeSession({track:ti,laps:8,mult:2,mode:'race',steerMode:'sim',fx:false,est,grid:roster,playerFuel:'full',playerCompound:'I',autopilot:true,weather:'var',weatherSeed:seed*7919});
 const prev=new Map();
 while(R.t<1000&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,1/120);
  for(const c of R.cars){const was=prev.get(c);if(was!=='service'&&c.pit==='service'){tot++;const w=R.meanWet||0,k=c.nextCompound;if(w>0.45&&!A.COMPOUNDS[k].wet)bad++;if(w<0.05&&k==='W')badDry++;}prev.set(c,c.pit);}}}
console.log('paradas',tot,'lisos con >45% de agua',bad,'lluvia extrema en seco',badDry);
