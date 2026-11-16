import pathlib
MINIGP=pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').as_uri()
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,vp,mob in [('d',{'width':1600,'height':1000},False),('m',{'width':844,'height':390},True)]:
            pg=await b.new_page(viewport=vp,is_mobile=mob,has_touch=mob)
            errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(MINIGP);await pg.evaluate("localStorage.setItem('minigp_welcomed','1')");await pg.reload();await pg.wait_for_timeout(800)
            await pg.click('#bQuick');await pg.wait_for_timeout(400)
            await pg.screenshot(path='out_q36_{name}.png',full_page=False)
            await pg.evaluate("()=>{document.querySelector('#quick .card').scrollTop=700}")
            await pg.screenshot(path='out_q36_{name}b.png')
            await pg.evaluate("()=>{settings.quali=0;}")
            await pg.click('#qGo');await pg.wait_for_timeout(600)
            await pg.evaluate("()=>{const b=document.getElementById('preGo');if(b&&b.offsetParent)b.click();}")
            await pg.wait_for_timeout(500)
            await pg.screenshot(path='out_pre36_{name}.png')
            await pg.evaluate("()=>{R.phase='race';R.player.lap=2;requestBox();}")
            await pg.wait_for_timeout(400)
            await pg.screenshot(path='out_pit36_{name}.png')
            await pg.click('.tcard[data-pc=\"H\"]');await pg.click('#pitOk');await pg.wait_for_timeout(200)
            print(name,await pg.evaluate("()=>[R.player.pitReq,R.player.nextCompound,R.player.fuelPlan,paused]"),errs)
        await b.close()
asyncio.run(main())
