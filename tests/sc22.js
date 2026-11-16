const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS,wreck};')();
for(const ti of [0,4]){const est=A.simEstimate(ti,2,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,22,'normal');
 const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
 const R=A.makeSession({track:ti,laps:8,mult:2,mode:'race',steerMode:'sim',fx:true,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true});
 while(R.t<150)A.stepRace(R,1/120);const v=R.standings[8];A.wreck(R,v,500,0,0,0);let done=false;const t0=R.t;
 const spread=()=>{const run=R.cars.filter(c=>!c.pit&&!c.dnf&&!c.finished).sort((a,b)=>b.prog-a.prog);let mx=0;for(let k=1;k<run.length;k++)mx=Math.max(mx,(run[k-1].prog-run[k].prog)*R.tr.sp);return [Math.round((run[0].prog-run[run.length-1].prog)*R.tr.sp),Math.round(mx)];};
 console.log(A.TRACKS[ti].name,'SC sale:',!!R.sc,'dispersión inicial',spread());
 while(R.t<t0+400&&!done){A.stepRace(R,1/120);for(const e of R.events){if(e.type==='sc_in')console.log('  en pista',R.cars.filter(c=>!c.pit&&!c.dnf&&!c.finished).length,'en boxes',R.cars.filter(c=>c.pit).length,'  se retira a los',(R.t-t0).toFixed(0),'s; dispersión total/máx hueco',spread());if(e.type==='sc_end'){done=true;}}R.events.length=0;}}
