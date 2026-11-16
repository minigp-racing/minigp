const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,KMH,physics};')();
const R=A.makeSession({track:0,laps:5,mult:1,mode:'race',fx:false,aids:true,est:{fuel:8,wear:0.05,lap:90},steerMode:'sim',grid:[{name:'p',color:'#f00',isPlayer:true,skill:1,team:0}]});
const c=R.cars[0];c.compound='M';c.tts=[90,90,90,90];c.tt=90;const out=[];
for(const thr of [0,1]){for(let i=0;i<120*15;i++){c.surf='grass';c.vx=0;c.vy=0;c.throttle=thr;c.brake=thr?0:1;c.steer=0;A.physics(R,c,1/120);c.x=0;c.y=0;c.vx=0;c.vy=0;if(i%(120*5)==0)out.push((thr?'gas ':'parado ')+c.tt.toFixed(0));}}
console.log(out.join(' | '));
