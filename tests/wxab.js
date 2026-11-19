// Prueba A/B de la estrategia en tiempo variable (v53): la mitad de los bots con la de v52 y la otra mitad con la nueva, en la misma carrera.
// Uso: git show 302f89f:src/core.js > old_core.js; TR=0,1 SEEDS=4 LAPS=8 node tests/wxab.js index.html old_core.js
// A/B: en la misma carrera, la mitad de los bots con la estrategia de lluvia antigua (v52) y la otra mitad con la nueva
const fs=require('fs');let html=fs.readFileSync(process.argv[2],'utf8');let core=html.split('// CORE START')[1].split('// CORE END')[0];
const old=fs.readFileSync(process.argv[3],'utf8');
const grab=(src,a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i);return src.slice(i,j);};
const oldCF=grab(old,'function compoundFor(R,c,k)','function forecastWet').replace('function compoundFor(','function compoundForOld(');
const oldRain=grab(old,"  if(R.weather&&R.weather.type!=='dry'&&left0>=1","  const left=left0,lf=");
core=core.replace('function compoundFor(R,c,k){','function compoundFor(R,c,k){if(c.wxOld)return compoundForOld(R,c,k);')+'\n'+oldCF;
core=core.replace("  if(R.weather&&R.weather.type!=='dry'&&left0>=2&&!(c.lap<=1&&R.t<60)){wxStrategy","  if(c.wxOld){"+oldRain.replace(/^  /,'')+"}else if(R.weather&&R.weather.type!=='dry'&&left0>=2&&!(c.lap<=1&&R.t<60)){wxStrategy");
core=core.replace("function wxStrategy(R,c){","function wxStrategy(R,c){if(c.wxOld)return;");
core=core.replace("c.nextCompound=compoundFor(R,c,chooseCompound(left-1,R.est,Math.random())):wf>0.62","c.nextCompound=c.wxOld?(wf>0.62?'W':wf>0.2?'I':chooseCompound(left-1,R.est,Math.random())):compoundFor(R,c,chooseCompound(left-1,R.est,Math.random())):wf>0.62");
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
const TR=(process.env.TR||'0,1,2,4,12').split(',').map(Number),SEEDS=+(process.env.SEEDS||3),LAPS=+(process.env.LAPS||8),W=process.env.W||'var';
let posN=0,posO=0,nN=0,nO=0,stN=0,stO=0,dnfN=0,dnfO=0;
for(const ti of TR)for(let s=0;s<SEEDS;s++){const est=A.simEstimate(ti,1,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
  const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
  const R=A.makeSession({track:ti,laps:LAPS,mult:1,mode:'race',steerMode:'sim',fx:false,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true,weather:W,weatherSeed:s*7777+ti*13+1});
  // compañeros de equipo en grupos distintos y se alterna por carrera
  R.cars.forEach((c,i)=>{if(c.bot)c.wxOld=((i+s+ti)%2)===0;});
  let steps=0;while(R.t<2600&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,1/120);steps++;}
  const fin=R.cars.filter(c=>c.bot).sort((a,b)=>(a.dnf?1e9:a.finished?a.finishTime:1e8-a.lap*1e4)-(b.dnf?1e9:b.finished?b.finishTime:1e8-b.lap*1e4));
  let line=A.TRACKS[ti].short+' s'+s+': ';
  fin.forEach((c,p)=>{if(c.wxOld){posO+=p;nO++;stO+=c.stops||0;dnfO+=c.dnf?1:0;}else{posN+=p;nN++;stN+=c.stops||0;dnfN+=c.dnf?1:0;}});
  line+=fin.slice(0,6).map(c=>(c.wxOld?'v':'N')+(c.stops||0)).join(' ');console.log(line,' meanWet',(R.meanWet||0).toFixed(2));
}
console.log('NUEVA pos media',(posN/nN+1).toFixed(2),'paradas',(stN/nN).toFixed(2),'abandonos',dnfN,' | ANTIGUA pos media',(posO/nO+1).toFixed(2),'paradas',(stO/nO).toFixed(2),'abandonos',dnfO);
