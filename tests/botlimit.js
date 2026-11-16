// Límite de los bots: un bot solo (nivel 1) con distintas frenadas (BOTDEC) y pasos por curva (agarre usado en curva).
// Mide la vuelta, el tiempo fuera de pista y los trompos. Sirve para ver cuánto margen tienen los bots antes de salirse.
// Uso: node tests/botlimit.js index.html   (TR=0,4,12 · DEC=0.74,0.82,0.9 · CRN=0.82,0.88)
const fs=require('fs');
const src=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const tracks=(process.env.TR||'0,4,12').split(',').map(Number);
const decs=(process.env.DEC||'0.74,0.82,0.9').split(',').map(Number),crns=(process.env.CRN||'0.82,0.88').split(',').map(Number);
const SK=+(process.env.SK||1);
for(const dec of decs)for(const crn of crns){
  let core=src.replace(/const BOTDEC=[0-9.]+,BOTCRN=[0-9.]+/,'const BOTDEC='+dec+',BOTCRN='+crn).replace(/RL_MAX=[0-9.]+/,'RL_MAX='+(process.env.RLM||40));if(!/const BOTDEC=[0-9.]+,BOTCRN=/.test(src))throw new Error('no encuentro BOTDEC/BOTCRN');
  const A=new Function(core+';return {makeSession,stepRace,TRACKS};')();
  const out=[];
  for(const ti of tracks){
    const R=A.makeSession({track:ti,laps:6,mult:0,mode:'quali',fx:true,est:{fuel:8,wear:0.05},steerMode:'sim',autopilot:true,grid:[{name:'b',color:'#f00',isPlayer:false,skill:SK,team:0}]});
    const c=R.cars[0];c.mistakeRate=0;let lap0=c.lap,tl=[],tLap=null,offT=0,n=0,spins=0;
    while(R.t<600&&tl.length<4){A.stepRace(R,1/120);
      for(const e of R.events)if(e.type==='spin'||e.type==='wreck')spins++;R.events.length=0;
      if(c.lap>lap0){lap0=c.lap;if(tLap!=null)tl.push(R.t-tLap);tLap=R.t;}
      if(tLap!=null){n++;if(c.off)offT+=1/120;}}
    const best=Math.min(...tl);out.push(A.TRACKS[ti].short+' '+best.toFixed(2)+'s fuera '+(100*offT/Math.max(1,n/120)).toFixed(1)+'% trompos '+spins);
  }
  console.log('frenada',dec,'curva',crn,'|',out.join(' | '));
}
