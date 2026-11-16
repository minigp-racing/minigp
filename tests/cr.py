import pathlib
MINIGP=pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').as_uri()
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':1366,'height':860})
        pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(MINIGP);await pg.evaluate("localStorage.setItem('minigp_welcomed','1')");await pg.reload();await pg.evaluate("()=>{localStorage.clear();localStorage.setItem('minigp_welcomed','1')}");await pg.reload();await pg.wait_for_timeout(800)
        await pg.click('#bCareer');await pg.wait_for_timeout(300);await pg.screenshot(path='cr0.png')
        await pg.click('#crGo');await pg.wait_for_timeout(400);await pg.screenshot(path='cr1.png',full_page=True)
        for t in ['car','hq','staff','drv']:
            await pg.click(f'[data-crtab={t}]');await pg.wait_for_timeout(250);await pg.screenshot(path=f'cr_{t}.png')
        await pg.click('[data-crtab=car]');await pg.click('[data-up=aero]');await pg.wait_for_timeout(200)
        print(await pg.evaluate("()=>JSON.stringify({money:CR.money,pending:CR.pending,car:CR.teams[CR.team].car})"))
        # carrera falsa
        await pg.evaluate("()=>{const ro=rosterFromTeams(CR.teams,16,'normal');const st=ro.map((e,i)=>Object.assign({},e,{dnf:false,eng:0.9}));const pl=st.find(e=>e.isPlayer);st.splice(st.indexOf(pl),1);st.splice(7,0,pl);window.R={standings:st};careerAfterRace();careerAfterRace();}")
        print(await pg.evaluate("()=>JSON.stringify({money:CR.money.toFixed(2),rep:CR.rep,pending:CR.pending,last:CR.last,aero:CR.teams[CR.team].car.aero})"))
        print(errs[:3]);await ctx.close();await b.close()
asyncio.run(main())
