// Pit lane (v49): cada bot para en su box y sale; tiempo perdido en la parada (vuelta con parada − vuelta normal) y atascos.
// Uso: node tests/pitlane.js index.html  (TR=4,0,12,3 · N=22)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,TRACKS,boxD,dOf};')();
for(const ti of (process.env.TR||'4,0,12,3').split(',').map(Number)){const est=A.simEstimate(ti,1,'sim');
  const R=A.makeSession({track:ti,laps:6,mult:1,mode:'race',steerMode:'sim',fx:true,est,grid:A.rosterFromTeams(A.DEFAULT_TEAMS,+(process.env.N||22),'normal'),playerFuel:'full',playerCompound:'M',autopilot:true});
  for(const c of R.cars)c.forcePit=2+(c.slot%3); // todos paran en las vueltas 2-4
  let stops=0,marsh=0,miss=[];const lapT={};
  while(R.t<1200&&!R.cars.every(c=>c.finished||c.dnf)){for(const c of R.cars)if(c.forcePit===c.lap&&!c.pit&&!c.pitReq&&!c.dnf){c.pitReq=true;c.nextCompound='H';c.forcePit=null;}
    A.stepRace(R,1/120);for(const e of R.events){if(e.type==='pitstop'){stops++;const c=e.car;(c._pl=c._pl||[]).push(c.lapTimes.length),j=Math.round(A.boxD(c.slot)),d=A.dOf(R.tr,c.idx);if(Math.abs(d-j)>3)miss.push(c.slot+':'+(d-j));}if(e.type==='marshal'&&e.car.pit)marsh++;}R.events.length=0;}
  const loss=[];for(const c of R.cars){if(c.dnf||!c._pl||c._pl.length!==1)continue;const lt=c.lapTimes,k=c._pl[0];if(k<1||k+1>=lt.length)continue;const clean=lt.filter((x,i)=>i>0&&i!==k&&i!==k+1).sort((a,b)=>a-b),med=clean[Math.floor(clean.length/2)];loss.push(lt[k]+lt[k+1]-2*med);}
  loss.sort((a,b)=>a-b);
  console.log(A.TRACKS[ti].short.padEnd(10),'pitL',R.tr.pitL,'paradas',stops,'/',R.cars.length,'· pérdida mediana',loss.length?loss[Math.floor(loss.length/2)].toFixed(1)+' s':'-','· fuera de su box',miss.length?miss.join(' '):'0','· recolocados',marsh);}
