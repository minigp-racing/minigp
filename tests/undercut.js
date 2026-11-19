// A/B del undercut: la mitad de los bots puede hacer undercut/cobertura y la otra no, en la misma carrera. Cuenta también banderas rojas.
const fs=require('fs');let core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
core=core.replace("if(!req&&UNDERCUT&&R.mode==='race'","if(!req&&UNDERCUT&&!c.noUC&&R.mode==='race'");
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
const TR=(process.env.TR||'0,1,2,4,12').split(',').map(Number),SEEDS=+(process.env.SEEDS||2),LAPS=+(process.env.LAPS||10),W=process.env.W||'dry';
let pY=0,nY=0,pN=0,nN=0,uc=0,ok=0,cov=0,red=0,races=0,wr=0;
for(const ti of TR)for(let s=0;s<SEEDS;s++){const est=A.simEstimate(ti,2,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
  const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
  const R=A.makeSession({track:ti,laps:LAPS,mult:2,mode:'race',steerMode:'sim',fx:true,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true,weather:W,weatherSeed:s*31+ti});
  R.cars.forEach((c,i)=>{if(c.bot)c.noUC=((i+s+ti)%2)===0;});const pend=[];
  while(R.t<3000&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,1/120);
    for(const e of R.events){if(e.type==='undercut'){uc++;pend.push({c:e.car,t:e.target,st:e.target.stops});}if(e.type==='cover')cov++;if(e.type==='wreck')wr++;}R.events.length=0;
    for(const p of pend)if(!p.done&&p.t.stops>p.st&&!p.t.pit&&!p.c.pit){p.done=true;const st=R.standings;if(st.indexOf(p.c)<st.indexOf(p.t))ok++;}}
  if(R.redDone)red++;races++;
  const fin=R.cars.filter(c=>c.bot).sort((a,b)=>(a.dnf?1e9:a.finished?a.finishTime:1e8-a.lap*1e4)-(b.dnf?1e9:b.finished?b.finishTime:1e8-b.lap*1e4));
  fin.forEach((c,p)=>{if(c.noUC){pN+=p;nN++;}else{pY+=p;nY++;}});
  console.log(A.TRACKS[ti].short,'s'+s,'undercuts acumulados',uc,'ok',ok,'coberturas',cov,'roja',!!R.redDone);}
console.log('CON undercut pos media',(pY/nY+1).toFixed(2),'| SIN',(pN/nN+1).toFixed(2),'| undercuts',uc,'salen bien',ok,'coberturas',cov,'| carreras',races,'banderas rojas',red,'destrozos',wr);
