const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali,TRACKS,wreck,scProg};')();
for(const ti of [0,4]){const est=A.simEstimate(ti,2,'sim');const roster=A.rosterFromTeams(A.DEFAULT_TEAMS,16,'normal');
 const q=roster.map(e=>({e,t:A.simQuali(ti,e,est,'sim')})).sort((a,b)=>a.t-b.t);
 const R=A.makeSession({track:ti,laps:10,mult:2,mode:'race',steerMode:'sim',fx:true,est,grid:q.map(x=>x.e),playerFuel:'full',playerCompound:'M',autopilot:true});
 const p=R.player;while(R.t<150)A.stepRace(R,1/120);A.wreck(R,R.standings[12]===p?R.standings[13]:R.standings[12],500,0,0,0);
 const t1=R.t;while(R.t<t1+22)A.stepRace(R,1/120);console.log("sc",R.sc&&R.sc.phase,R.noSC);R.events.length=0;
 const v=R.standings.filter(c=>c!==p)[5];if(!R.sc){console.log('sin SC');continue;}
 const put=k=>{const tr=R.tr,N=tr.N,j=(v.idx+k+N)%N;p.x=tr.xs[j]+tr.nx[j]*v.lat;p.y=tr.ys[j]+tr.ny[j]*v.lat;p.a=tr.ang[j];p.vx=v.vx;p.vy=v.vy;p.idx=j;p.lap=v.lap+(k>0&&j<v.idx?1:k<0&&j>v.idx?-1:0);p.prog=p.lap*N+p.idx;};
 put(-14);p.bot=false;R.input={up:1,down:0,left:0,right:0};for(let i=0;i<60;i++)A.stepRace(R,1/120);
 // el jugador se mete por delante del de delante
 put(5);
 p.bot=false;R.input={up:0,down:0,left:0,right:0};
 const ev=[];let hits=0,wr=0;const t2=R.t;
 while(R.t<t2+20){ // el jugador levanta y va frenando suave
   R.input={up:R.t-t2>6?1:0,down:R.t-t2<3?0:0,left:0,right:0};p.steer=0;A.stepRace(R,1/120);
   for(const e of R.events){if(['y_warn','y_ok','y_pen','sc_pen'].includes(e.type))ev.push(e.type+'@'+(R.t-t2).toFixed(1));if(e.type==='hit')hits++;if(e.type==='wreck')wr++;}R.events.length=0;}
 console.log(A.TRACKS[ti].name,'víctima',v.name,'eventos',ev.join(' '),'| golpes',hits,'destrozados',wr,'| pos final jugador vs víctima',R.standings.indexOf(p),R.standings.indexOf(v));}
