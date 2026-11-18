// Conductor "humano" con teclado: toques izquierda/derecha (todo o nada), reacción de ~0,12 s y gas/freno a fondo.
// Mide lo manejable que es el coche del jugador: tiempo de vuelta, salidas de pista y cuánto se cruza.
// Uso: node tests/drive.js index.html   (TR=0,4,12 circuitos · AIDS=0 sin ayudas · LAG=0.12 reacción)
const fs=require('fs');
const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,KMH,delMax,angNorm,LWB,VMAX};')();
const tracks=(process.env.TR||'0,4,12,1,2').split(',').map(Number),aids=process.env.AIDS!=='0',LAG=+(process.env.LAG||0.08),SPD=+(process.env.SPD||0.97),DT=1/120;
const BT={mx:0,n:0,hot:0};process.on('exit',()=>{if(BT.n)console.log('frenos: máx',Math.round(BT.mx)+'°','· tiempo >950°',(100*BT.hot/BT.n).toFixed(1)+'%','· graining máx',(BT.gr||0).toFixed(2),'· tiempo con graining >0,3',(100*(BT.g3||0)/BT.n).toFixed(1)+'%');});
let tot={t:0,off:0,exc:0,beta:0,b20:0,n:0};
for(const ti of tracks){
  const R=A.makeSession({track:ti,laps:5,mult:0,mode:'quali',fx:false,aids,est:{fuel:8,wear:0.05},steerMode:'sim',grid:[{name:'p',color:'#f00',isPlayer:true,skill:1,team:0}]});
  R.steerCfg={gain:7,rate:6};const c=R.cars[0],tr=R.tr,N=tr.N;c.bot=false;
  const q=[];let lap0=c.lap,tl=[],tLap=null,offT=0,exc=0,wasOff=false,bs=0,b20=0,n=0;
  while(R.t<400&&tl.length<2){
    const fx=Math.cos(c.a),fy=Math.sin(c.a),vf=c.vx*fx+c.vy*fy,vl=-c.vx*fy+c.vy*fx;
    const la=Math.round(8+Math.abs(vf)*0.032),ti2=(c.idx+la)%N;
    const rl=tr.rl?tr.rl[ti2]:0,px=tr.xs[ti2]+tr.nx[ti2]*rl-c.x,py=tr.ys[ti2]+tr.ny[ti2]*rl-c.y, /* v49: sigue la trazada (la velocidad objetivo sale de ella) */diff=A.angNorm(Math.atan2(py,px)-c.a),ld=Math.max(40,Math.hypot(px,py));
    const want=Math.atan2(2*A.LWB*Math.sin(diff),ld)/A.delMax(c,Math.abs(vf),R);
    let tgt=1e9;for(let k=2;k<60;k+=3)tgt=Math.min(tgt,tr.vLimS[(c.idx+k)%N]*SPD+k*tr.sp*1.2);
    q.push({t:R.t,right:want>c.steer+0.1?1:0,left:want<c.steer-0.1?1:0,up:vf<tgt?1:0,down:vf>tgt+12?1:0});
    while(q.length>1&&q[1].t<=R.t-LAG)q.shift();
    const inp=q[0];R.input={up:inp.up,down:inp.down,left:inp.left,right:inp.right};
    A.stepRace(R,DT);
    if(c.lap>lap0){lap0=c.lap;if(tLap!=null)tl.push(R.t-tLap);tLap=R.t;}
    if(tLap!=null&&c.bT!=null){BT.mx=Math.max(BT.mx,c.bT);BT.gr=Math.max(BT.gr||0,c.grain||0);if((c.grain||0)>0.3)BT.g3=(BT.g3||0)+1;BT.n++;if(c.bT>950)BT.hot++;}
    if(tLap!=null){n++;const off=c.off;if(off)offT+=DT;if(off&&!wasOff)exc++;wasOff=off;
      const beta=Math.abs(Math.atan2(vl,Math.max(30,Math.abs(vf))));bs+=beta;if(beta>0.2*0+0.12&&Math.hypot(c.vx,c.vy)>150)b20++;}
  }
  const lt=tl.length?tl[tl.length-1]:NaN;
  console.log(String(ti).padStart(2),'vuelta',lt.toFixed(2),'s | fuera',(100*offT/Math.max(1,n*DT)).toFixed(1)+'%','salidas',exc,'| cruce medio',(bs/Math.max(1,n)*57.3).toFixed(1)+'°','· tiempo cruzado >7°',(100*b20/Math.max(1,n)).toFixed(1)+'%');
  tot.t+=lt;tot.off+=100*offT/Math.max(1,n*DT);tot.exc+=exc;tot.beta+=bs/Math.max(1,n)*57.3;tot.b20+=100*b20/Math.max(1,n);tot.n++;
}
console.log('TOTAL vueltas',tot.t.toFixed(1),'s | fuera',(tot.off/tot.n).toFixed(1)+'%','salidas',tot.exc,'| cruce',(tot.beta/tot.n).toFixed(1)+'°','cruzado',(tot.b20/tot.n).toFixed(1)+'%');
