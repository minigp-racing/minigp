import pathlib
MINIGP=pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').as_uri()
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,vp in [('a',{'width':700,'height':310}),('b',{'width':844,'height':390}),('c',{'width':390,'height':760})]:
            pg=await b.new_page(viewport=vp,is_mobile=True,has_touch=True,device_scale_factor=2)
            errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(MINIGP);await pg.evaluate("localStorage.setItem('minigp_welcomed','1')");await pg.reload();await pg.wait_for_timeout(700)
            await pg.evaluate("()=>{settings.quali=0;settings.weather='var';settings.formation=0;}")
            await pg.click('#bQuick');await pg.wait_for_timeout(300);await pg.click('#qGo');await pg.wait_for_timeout(500)
            await pg.evaluate("()=>{const b=document.getElementById('preGo');if(b&&b.offsetParent)b.click();}")
            await pg.wait_for_timeout(500)
            await pg.evaluate("()=>{R.player.bot=true;R.fx=false;for(let n=0;n<120*40;n++)stepRace(R,1/120);R.fx=true;R.events.length=0;radioSay('Posición devuelta. Sin sanción.',null,0,true);}")
            await pg.wait_for_timeout(1500)
            await pg.screenshot(path='out_mob37_{name}.png');print(name,errs)
        await b.close()
asyncio.run(main())
