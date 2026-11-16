const fs=require('fs');
const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
const laps=+process.argv[3]||5, mult=+process.argv[4]||2, n=+process.argv[5]||16, mode=process.argv[6]||'sim';
const ONLY=process.env.TR?process.env.TR.split(",").map(Number):null;
for(let ti=0;ti<A.TRACKS.length;ti++){if(ONLY&&!ONLY.includes(ti))continue;
  const est=A.simEstimate(ti,mult,mode);
  const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,n,'normal');
  const t0=Date.now();
  const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,mode)}));const qms=Date.now()-t0;
  q.sort((a,b)=>a.t-b.t);
  const TS={n:0,s:0,h:0,sv:0,at:0,mx:0};const R=A.makeSession({track:ti,laps,mult,mode:'race',steerMode:mode,fx:false,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true});
  R.phase='race';let off=0,fr=0,rec=0;const dt=1/120;
  while(R.t<laps*175&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,dt);fr++;for(const c of R.cars){if(c.off)off++;if(c.recover>0)rec++;if(!c.pit&&!c.dnf&&!c.finished){TS.n++;TS.s+=c.temp;if(c.temp>118)TS.h++;if(c.emode===0)TS.sv++;if(c.emode===2)TS.at++;TS.mx=Math.max(TS.mx,c.temp);}}}
  console.log('  T media',(TS.s/TS.n).toFixed(1),'max',TS.mx.toFixed(0),'%>118',(100*TS.h/TS.n).toFixed(1),'%ahorro',(100*TS.sv/TS.n).toFixed(1),'%ataque',(100*TS.at/TS.n).toFixed(1),'eng',R.cars.map(c=>(c.eng==null?1:c.eng).toFixed(2)).join(' '),'dnf:',R.cars.filter(c=>c.dnf).map(c=>c.dnfReason).join(','));
  const stops=R.cars.reduce((a,c)=>a+c.stops,0);
  console.log(`${A.TRACKS[ti].name.padEnd(18)} quali ${qms}ms ${q[0].t.toFixed(2)}..${q[q.length-1].t.toFixed(2)} | t=${R.t.toFixed(0)} fin=${R.cars.filter(c=>c.finished).length}/${R.cars.length} dnf=${R.cars.filter(c=>c.dnf).length} off=${(100*off/fr/R.cars.length).toFixed(2)}% recov=${rec} stops=${stops} win=${R.standings[0].name} hits=${R.hits||0}`);
}
