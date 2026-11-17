// Bots en condiciones difíciles: vuelta de un bot solo (nivel 1) en seco, en lluvia con gomas de lluvia/intermedias y con blandos.
// Mide la vuelta, el tiempo fuera de pista, los trompos y la vuelta "ideal" del jugador-autopiloto como referencia.
// Uso: node tests/wetbot.js index.html  (TR=4,0)
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,TRACKS};')();
for(const ti of (process.env.TR||'4,0').split(',').map(Number)){const out=[];
  for(const [W,comp] of [['dry','S'],['rain','W'],['rain','I'],['rain','S']]){
    const R=A.makeSession({track:ti,laps:6,mult:0,mode:'quali',fx:true,est:{fuel:8,wear:0.05,lap:90},steerMode:'sim',autopilot:true,weather:W,weatherSeed:5,qualiCompound:comp,grid:[{name:'b',color:'#f00',isPlayer:false,skill:1,team:0}]});
    const c=R.cars[0];c.compound=comp;let lap0=c.lap,tl=[],tLap=null,offT=0,n=0,spins=0;
    while(R.t<900&&tl.length<3){A.stepRace(R,1/120);for(const e of R.events)if(e.type==='spin'||e.type==='spinout'||e.type==='wreck')spins++;R.events.length=0;
      if(c.lap>lap0){lap0=c.lap;if(tLap!=null)tl.push(R.t-tLap);tLap=R.t;}if(tLap!=null){n++;if(c.off)offT+=1/120;}}
    out.push(W+'/'+comp+' '+(tl.length?Math.min(...tl).toFixed(1):'-')+'s fuera '+(100*offT/Math.max(1,n/120)).toFixed(1)+'% trompos '+spins+(c.dnf?' ABANDONO':''));}
  console.log(A.TRACKS[ti].short,'|',out.join(' | '));}
