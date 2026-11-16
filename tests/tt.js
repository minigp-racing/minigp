const fs=require('fs');
const core=fs.readFileSync('../minigp/core.js','utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,simEstimate,rosterFromTeams,DEFAULT_TEAMS};')();
for(const ti of [0,4]){const est=A.simEstimate(ti,2,'sim');
const R=A.makeSession({track:ti,laps:5,mult:2,mode:'race',fx:false,est,steerMode:'sim',grid:A.rosterFromTeams(A.DEFAULT_TEAMS,16,'dificil'),playerFuel:'full',playerCompound:'M',autopilot:true});
const p=R.cars.find(c=>c.isPlayer);let n=0,hot=0,s=0,mx=0;while(R.t<300){A.stepRace(R,1/60);if(R.t>40){n++;s+=p.tt;mx=Math.max(mx,p.tt);if(p.tt>110)hot++;}}
console.log(ti,'medio: temp media',(s/n).toFixed(0),'max',mx.toFixed(0),'% sobre 110°',(100*hot/n).toFixed(0),'desgaste',p.wear.toFixed(2));}
