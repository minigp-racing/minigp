const fs=require('fs');const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,KMH,physics};')();
for(const surf of ['grass','gravel']){
 const R=A.makeSession({track:0,laps:5,mult:0,mode:'quali',fx:false,aids:true,est:{fuel:8,wear:0.05},steerMode:'sim',grid:[{name:'p',color:'#f00',isPlayer:true,skill:1,team:0}]});
 const c=R.cars[0];const sp=v=>{c.vx=Math.cos(c.a)*v/A.KMH;c.vy=Math.sin(c.a)*v/A.KMH;};
 const run=(v0,thr,brk,t)=>{sp(v0);const out=[];for(let i=0;i<t*120;i++){c.surf=surf;c.throttle=thr;c.brake=brk;c.steer=0;A.physics(R,c,1/120);c.x=0;c.y=0;if(i%60==0)out.push(Math.round(Math.hypot(c.vx,c.vy)*A.KMH));}return out.join(' ');};
 console.log(surf,'sin gas desde 200:',run(200,0,0,3));
 console.log(surf,'frenando desde 200:',run(200,0,1,3));
 console.log(surf,'gas a fondo desde 0:',run(0,1,0,4));}
