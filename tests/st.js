const fs=require('fs');
const core=fs.readFileSync(process.argv[2],'utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,KMH};')();
const out=[];
for(const tgt of [120,200,300]){
const R=A.makeSession({track:0,laps:5,mult:0,mode:'quali',fx:false,aids:true,est:{fuel:8,wear:0.05},steerMode:'sim',grid:[{name:'p',color:'#f00',isPlayer:true,skill:1,team:0}]});
R.steerCfg={gain:7,rate:6};const c=R.cars[0];R.input={up:1,down:0,left:0,right:0};c.bot=true;
while(!(Math.hypot(c.vx,c.vy)*A.KMH>tgt&&!R.tr.corner[c.idx]&&!R.tr.corner[(c.idx+60)%R.tr.N]&&Math.abs(c.lat)<20)&&R.t<120)A.stepRace(R,1/120);
if(tgt<300){/* mantener velocidad */}
c.bot=false;c.steer=0;R.input={up:tgt<300?0:1,down:0,left:0,right:1};const t0=R.t;let g=0,t50=null,t90=null,gs=[];
while(R.t<t0+1.5){A.stepRace(R,1/120);gs.push([R.t-t0,c.latG]);g=Math.max(g,c.latG);}
for(const [t,l] of gs){if(t50==null&&l>=0.5*g)t50=t;if(t90==null&&l>=0.9*g)t90=t;}
out.push(tgt+' km/h: max '+g.toFixed(2)+'G  50% en '+t50.toFixed(2)+'s  90% en '+t90.toFixed(2)+'s');}
console.log(out.join('\n'));
