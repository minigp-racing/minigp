// El jugador entra a boxes conduciendo (v49): un "conductor" con teclado sigue el centro de la pista y, con BOX pedido,
// se mete por el carril del pit lane. Comprueba que entra, para en su box, sale y sigue; y que si no se mete, avisa y no para.
// Uso: node tests/pitdrive.js index.html  (TR=4,0,12,3)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,TRACKS,lpPit,dOf,angNorm,PIT_V,KMH};')();
for(const ti of (process.env.TR||'4,0,12,3').split(',').map(Number))for(const [enter,aids] of [[true,true],[true,false],[false,true]]){const est=A.simEstimate(ti,1,'sim');
  const R=A.makeSession({track:ti,laps:4,mult:1,mode:'race',steerMode:'sim',fx:true,est,grid:A.rosterFromTeams(A.DEFAULT_TEAMS,6,'normal'),playerFuel:'full',playerCompound:'M',autopilot:false,aids});
  const p=R.player,tr=R.tr,N=tr.N;R.input={};let ev=[],maxPit=0,entered=false,stopped=false,out=false,lapAfter=0;
  while(R.t<500&&p.lap<4&&!p.dnf){
    const d=A.dOf(tr,p.idx);if(p.lap===2&&!p.pitReq&&!stopped&&d<-300)p.pitReq=true;
    let tl=0;if(enter&&p.pitReq&&!stopped&&d>-400&&d<0)tl=tr.pitSide*(A.lpPit(d+8)+(p.pit?0:12));if(p.pit==='out')tl=tr.pitSide*A.lpPit(d+8);
    const j=(p.idx+8)%N,tx=tr.xs[j]+tr.nx[j]*tl,ty=tr.ys[j]+tr.ny[j]*tl,err=A.angNorm(Math.atan2(ty-p.y,tx-p.x)-p.a),v=Math.hypot(p.vx,p.vy);
    let vt=tr.vLimS[(p.idx+12)%N]*0.8;if(p.pit||(p.pitReq&&enter&&d>-250&&d<0))vt=Math.min(vt,240);
    R.input={left:err<-0.02,right:err>0.02,up:v<vt,down:v>vt+25};
    A.stepRace(R,1/120);for(const e of R.events)if(e.car===p&&/^pit/.test(e.type))ev.push(e.type);R.events.length=0;
    if(p.pit==='in')entered=true;if(p.pit==='service')stopped=true;if(stopped&&p.pit==null)out=true;if(p.pit)maxPit=Math.max(maxPit,Math.hypot(p.vx,p.vy)*A.KMH);}
  console.log(A.TRACKS[ti].short.padEnd(10),(enter?'se mete':'no entra')+(aids?' ayudas:':' sin ayudas:'),'entra',entered,'para',stopped,'sale',out,'vuelta',p.lap,'máx en pit',maxPit.toFixed(0)+' km/h','eventos',[...new Set(ev)].join(','),'sanción',p.pen,p.dnf?'ABANDONO':'');}
