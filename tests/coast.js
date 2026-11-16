const fs=require('fs');
const core=fs.readFileSync(process.argv[2]||'index.html','utf8').split('// CORE START')[1].split('// CORE END')[0];
const A=new Function(core+';return {makeSession,stepRace,KMH};')();
for(const aids of [true,false])for(const thr of [0,1]){
const R=A.makeSession({track:0,laps:5,mult:1,mode:'quali',fx:false,aids,est:{fuel:8,wear:0.05},steerMode:'sim',grid:[{name:'p',color:'#f00',isPlayer:true,skill:1,team:0}]});
R.steerCfg={gain:7,rate:6};const c=R.cars[0];R.input={up:1,down:0,left:0,right:0};c.bot=true;
while(!(Math.hypot(c.vx,c.vy)*A.KMH>170&&!R.tr.corner[c.idx]&&!R.tr.corner[(c.idx+60)%R.tr.N]&&Math.abs(c.lat)<20)&&R.t<120)A.stepRace(R,1/120);
// sin frenar, girar 1,5 s
c.bot=false;R.input={up:thr,down:0,left:0,right:1};const t0=R.t,tt0=c.tt;let sk=0,n=0,mx=0,fr=0,ax=[];
while(R.t<t0+1.5){A.stepRace(R,1/120);n++;sk+=c.skid;mx=Math.max(mx,c.skid);ax.push(c.lonG);}
console.log('ayudas',aids,'gas',thr,'v fin',(Math.hypot(c.vx,c.vy)*A.KMH).toFixed(0),'skid medio',(sk/n).toFixed(2),'max',mx.toFixed(2),'temp gomas',tt0.toFixed(0),'->',c.tt.toFixed(0),'decel media G',(ax.reduce((a,b)=>a+b,0)/ax.length).toFixed(2));}
