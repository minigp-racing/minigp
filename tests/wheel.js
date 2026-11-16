// Daños v44: rueda arrancada, alerón trasero que se cae y roce con el muro.
// Uso: node tests/wheel.js index.html
const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,hurt,KMH,serviceTime};')();
const mk=()=>{const R=A.makeSession({track:0,laps:5,mult:0,mode:'quali',fx:true,aids:true,est:{fuel:8,wear:0.05},steerMode:'sim',grid:[{name:'p',color:'#f00',isPlayer:true,skill:1,team:0}]});R.steerCfg={gain:7,rate:6};return R;};
// 1) golpe lateral fuerte con la suspensión ya tocada → sin rueda; velocidad máxima limitada; nada de NaN
let lost=0,tries=200;for(let k=0;k<tries;k++){const R=mk(),c=R.cars[0];c.dSusp=0.9;A.hurt(R,c,300,8,6,0,1);if(c.wheelOff!=null)lost++;}
console.log('rueda perdida con susp. 90 % y golpe de 300:',(100*lost/tries).toFixed(0)+'% de las veces');
{const R=mk(),c=R.cars[0];c.bot=true;for(let i=0;i<120*15;i++)A.stepRace(R,1/120);
 c.wheelOff=1;c.punct=true;c.dSusp=1;c.suspSide=1;let vmax=0,bad=false;for(let i=0;i<120*20;i++){A.stepRace(R,1/120);const v=Math.hypot(c.vx,c.vy);if(!isFinite(v)||!isFinite(c.x))bad=true;vmax=Math.max(vmax,v);}
 console.log('sin rueda ('+['del. izq.','del. dcha.','tras. izq.','tras. dcha.'][c.wheelOff]+'): vel. máx',Math.round(vmax*A.KMH),'km/h · NaN:',bad,'· parada en boxes',A.serviceTime(Object.assign({},c,{fuelAdd:0})).toFixed(1),'s');}
// 2) golpe trasero fuerte → el alerón trasero sale volando
{const R=mk(),c=R.cars[0];A.hurt(R,c,400,-15,0,1,0);console.log('golpe trasero 400: dRear',c.dRear.toFixed(2),'alerón trasero fuera:',!!c.rwOff,'· restos',R.debris?R.debris.length:0);}
// 3) carrera con 22 coches: cuántas ruedas se pierden y cuántos abandonos por ello
{let wheels=0,dnfW=0,runs=0;
 const B=new Function(core+';return {makeSession,stepRace,rosterFromTeams,DEFAULT_TEAMS,simEstimate,simQuali};')();
 for(const ti of [0,4,12])for(let s=0;s<3;s++){const est=B.simEstimate(ti,2,'sim'),roster=B.rosterFromTeams(B.DEFAULT_TEAMS,22,'normal');
  const R=B.makeSession({track:ti,laps:3,mult:2,mode:'race',steerMode:'sim',fx:true,est,grid:roster,playerFuel:'full',playerCompound:'M',autopilot:true});
  while(R.phase!=='race'&&R.t<60)B.stepRace(R,1/120);const t0=R.t;
  while(R.t<t0+90){B.stepRace(R,1/120);for(const e of R.events)if(e.type==='damage'&&e.msg==='Rueda perdida')wheels++;R.events.length=0;}
  dnfW+=R.cars.filter(c=>c.dnfReason==='Rueda perdida').length;runs++;}
 console.log('carreras de 90 s con 22 coches: ruedas perdidas',(wheels/runs).toFixed(2),'por carrera · abandonos por rueda',(dnfW/runs).toFixed(2));}
