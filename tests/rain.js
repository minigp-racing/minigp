const fs=require('fs');
const core=fs.readFileSync(process.env.CORE||'../minigp/core.js','utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,KMH};')();
const ti=+process.env.TI||0,laps=+process.env.L||8;const est=A.simEstimate(ti,2,'sim');
for(const seed of (process.env.SEEDS||'11,23,37').split(',').map(Number)){
const R=A.makeSession({track:ti,laps,mult:2,mode:'race',fx:false,est,steerMode:'sim',weather:'var',weatherSeed:seed,grid:A.rosterFromTeams(A.DEFAULT_TEAMS,16,'dificil'),playerFuel:'full',playerCompound:'M',autopilot:true});
const log=[];let lastLap=0,maxW=0,slowT=0,sn=0,offT=0;const comp0=R.cars.map(c=>c.compound);
while(R.t<laps*200&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,1/60);maxW=Math.max(maxW,R.meanWet);
 for(const c of R.cars){if(c.pit||c.finished||c.dnf)continue;sn++;if(Math.hypot(c.vx,c.vy)*A.KMH<70&&R.t>20)slowT++;if(c.off)offT++;}
 const L=R.cars[0].lap;if(L!==lastLap){lastLap=L;const cnt={};R.cars.forEach(c=>{if(!c.dnf)cnt[c.compound]=(cnt[c.compound]||0)+1;});log.push('v'+L+' agua '+R.meanWet.toFixed(2)+' '+JSON.stringify(cnt));}}
const why={};R.cars.filter(c=>c.dnf).forEach(c=>why[c.dnfReason]=(why[c.dnfReason]||0)+1);console.log('semilla',seed,R.weather.scen,'| max agua',maxW.toFixed(2),'| %coches <70km/h',(100*slowT/sn).toFixed(1),'| %fuera',(100*offT/sn).toFixed(1),'| dnf',JSON.stringify(why));
console.log('   '+log.join('\n   '));}
