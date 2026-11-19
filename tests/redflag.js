// fuerza un accidente brutal a mitad de carrera y comprueba que la carrera sigue bien
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,wreck,TRACKS};')();
for(const [ti,atLap] of [[0,1],[4,3]]){const est=A.simEstimate(ti,1,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
 const R=A.makeSession({track:ti,laps:6,mult:1,mode:'race',steerMode:'sim',fx:true,est,grid:roster,playerFuel:'full',playerCompound:'M',autopilot:true,weather:'dry'});
 let done=false,ev=[];let before=null;
 while(R.t<1500&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,1/120);for(const e of R.events)if(/red|wreck/.test(e.type))ev.push(e.type+'@'+R.t.toFixed(1)+(e.full!=null?' full='+e.full:''));R.events.length=0;
  if(!done&&R.phase==='race'&&R.standings[0].lap===atLap&&R.standings[0].idx>R.tr.N*0.5){done=true;const c=R.standings[5];before=R.standings.filter(x=>!x.dnf).map(x=>x.name).slice(0,6).join(',');A.wreck(R,c,700,8,0.3,0.4);}
  if(R.redRestart&&!R._seen){R._seen=1;console.log('  parrilla:',R.standings.filter(x=>!x.dnf).map(x=>x.name+'('+x.lap+')').slice(0,6).join(','));}}
 const fin=R.cars.filter(c=>c.finished).sort((a,b)=>a.finishTime-b.finishTime);
 console.log(A.TRACKS[ti].short,'roja en vuelta',atLap,'| antes:',before,'| eventos',ev.join(' '),'| t',R.t.toFixed(0),'fin',fin.length,'ganador',fin[0]&&fin[0].name,'vueltas del ganador',fin[0]&&fin[0].lapTimes.length,'mejor',fin[0]&&Math.min(...fin.map(c=>c.bestLap||999)).toFixed(2));}
