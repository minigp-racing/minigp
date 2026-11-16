const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS};')();
const W=process.env.W||'dry',n=16,out=[];const rk={};A.DEFAULT_TEAMS.forEach(t=>t.drivers.forEach(d=>rk[d.name]=d.rating));
for(const ti of [0,1,2,4,12])for(let s=0;s<2;s++){const est=A.simEstimate(ti,+(process.env.M||2),'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,n,'normal');
 const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
 const R=A.makeSession({track:ti,laps:5,mult:+(process.env.M||2),mode:'race',steerMode:'sim',fx:false,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true,weather:W,weatherSeed:s*7777+ti});
 let ovt=0,prev=null,steps=0;
 while(R.t<1600&&!R.cars.every(c=>c.finished||c.dnf)){A.stepRace(R,1/120);if(++steps%60===0&&R.phase==='race'){const ord=R.standings.filter(c=>!c.dnf&&!c.pit).map(c=>c.id).join();if(prev){const a=prev.split(','),b=ord.split(',');for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])ovt+=0.5;}prev=ord;}}
 const fin=R.cars.filter(c=>c.finished).sort((a,b)=>a.finishTime-b.finishTime),w=fin[0]||{name:"NADIE t="+R.t.toFixed(0)+" lap"+R.standings[0].lap,finishTime:0};if(!fin.length)fin.push(w,w);
 const pole=q[0].e.name,poleFin=fin.findIndex(c=>c.name===pole)+1;
 out.push({t:A.TRACKS[ti].short||A.TRACKS[ti].name,win:w.name+'('+(rk[w.name]||'jug')+')',pole:pole+'→P'+poleFin,gap:(fin[fin.length-1].finishTime-w.finishTime).toFixed(0)+'s',p2:fin[1]?(fin[1].finishTime-w.finishTime).toFixed(1)+"s":"-",fin:fin.length,ovt:Math.round(ovt),stops:(R.cars.reduce((a,c)=>a+c.stops,0)/n).toFixed(1),dnf:R.cars.filter(c=>c.dnf).map(c=>c.dnfReason).join('/')||'-',sc:R.scCount||0});}
console.table(out);
