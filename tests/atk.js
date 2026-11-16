const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const core2=core.replace('if(c.bot||!c.isPlayer){c.emode=','if((c.bot&&!c.forceAtk)||!c.isPlayer){c.emode=').replace('c.isPlayer&&!c.bot&&c.emode===2','c.isPlayer&&(!c.bot||c.forceAtk)&&c.emode===2');
const A=new Function(core2+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
for(const ti of [0,4]){for(const w of ['dry','rain']){let res=[];for(let s=0;s<3;s++){const est=A.simEstimate(ti,2,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
 const R=A.makeSession({track:ti,laps:5,mult:2,mode:'race',steerMode:'sim',fx:true,est,grid:roster,playerFuel:'full',playerCompound:w==='rain'?'W':'M',autopilot:true,weather:w,damage:true});
 const p=R.player;p.forceAtk=true;let mx=0,iss=null;R.damage=true;
 while(R.t<700&&!p.finished&&!p.dnf){p.emode=2;A.stepRace(R,1/120);p.emode=2;mx=Math.max(mx,p.temp);if(p.issue&&!iss)iss=p.issue+'@'+R.t.toFixed(0);R.events.length=0;}
 res.push(`T máx ${mx.toFixed(0)} motor ${(p.eng*100).toFixed(0)}% ${iss||''} ${p.dnf?'ROTO':''}`);}
 console.log(A.TRACKS[ti].name,w,res.join(' | '));}}
