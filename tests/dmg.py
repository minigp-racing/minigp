import pathlib
MINIGP=pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').as_uri()
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,vp,mob in [('d',{'width':1500,'height':900},False),('m',{'width':844,'height':390},True)]:
            pg=await b.new_page(viewport=vp,is_mobile=mob,has_touch=mob,device_scale_factor=2)
            errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(MINIGP);await pg.evaluate("localStorage.setItem('minigp_welcomed','1')");await pg.reload();await pg.wait_for_timeout(700)
            await pg.evaluate("()=>{settings.quali=0;settings.formation=0;}")
            await pg.click('#bQuick');await pg.wait_for_timeout(300);await pg.click('#qGo');await pg.wait_for_timeout(500)
            await pg.evaluate("()=>{const b=document.getElementById('preGo');if(b&&b.offsetParent)b.click();}")
            await pg.wait_for_timeout(300)
            await pg.evaluate("()=>{R.player.bot=true;R.fx=false;for(let n=0;n<120*30;n++)stepRace(R,1/120);R.fx=true;const p=R.player;p.dWing=0.7;p.dSusp=0.3;p.suspSide=1;}")
            await pg.wait_for_timeout(800)
            if mob: await pg.screenshot(path='out_dmg_{name}.png',clip={'x':150,'y':200,'width':550,'height':190})
            else: await pg.screenshot(path='out_dmg_{name}.png',clip={'x':300,'y':700,'width':900,'height':200})
            print(name,errs)
        await b.close()
asyncio.run(main())
