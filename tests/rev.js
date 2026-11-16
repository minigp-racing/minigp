const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,KMH};')();
const R=A.makeSession({track:0,laps:5,mult:0,mode:'quali',fx:false,aids:true,est:{fuel:8,wear:0.05},steerMode:'sim',grid:[{name:'p',color:'#f00',isPlayer:true,skill:1,team:0}]});
const c=R.cars[0];R.input={up:0,down:1,left:0,right:0};for(let i=0;i<240;i++)A.stepRace(R,1/120);
const vf=()=>(c.vx*Math.cos(c.a)+c.vy*Math.sin(c.a))*A.KMH;console.log('marcha atrás 2s:',vf().toFixed(1),'km/h');
R.input={up:1,down:0,left:0,right:0};const out=[];for(let i=0;i<240;i++){A.stepRace(R,1/120);if(i%30==0)out.push(vf().toFixed(1));}console.log('acelerando:',out.join(' '));
