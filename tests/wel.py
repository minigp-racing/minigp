import pathlib
MINIGP=pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').as_uri()
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,vp,mob in [('d',{'width':1500,'height':900},False),('m',{'width':844,'height':390},True)]:
            pg=await b.new_page(viewport=vp,is_mobile=mob,has_touch=mob)
            errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(MINIGP);await pg.wait_for_timeout(800)
            await pg.screenshot(path='out_wel_{name}.png')
            await pg.click('#welGo');await pg.wait_for_timeout(1500)
            r=await pg.evaluate("()=>[R&&R.mode,R&&R.cars.length,R&&R.tr.name,R&&R.phase,EV.laps,document.getElementById('prerace').classList.contains('hidden')]")
            await pg.reload();await pg.wait_for_timeout(600)
            r2=await pg.evaluate("()=>[document.getElementById('welcome').classList.contains('hidden'),document.getElementById('menu').classList.contains('hidden'),settings.mult]")
            print(name,r,r2,errs)
        await b.close()
asyncio.run(main())
