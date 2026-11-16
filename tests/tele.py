import pathlib
MINIGP=pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').as_uri()
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1500,'height':1000})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(MINIGP);await pg.evaluate("localStorage.setItem('minigp_welcomed','1')");await pg.reload();await pg.wait_for_timeout(700)
        await pg.evaluate("()=>{settings.quali=0;settings.laps=5;settings.weather='var';}")
        await pg.click('#bQuick');await pg.wait_for_timeout(300);await pg.click('#qGo');await pg.wait_for_timeout(500)
        await pg.evaluate("()=>{const b=document.getElementById('preGo');if(b&&b.offsetParent)b.click();}")
        await pg.wait_for_timeout(300)
        r=await pg.evaluate("""()=>{R.player.bot=true;R.fx=false;let k=0;for(let n=0;n<120*700&&!R.player.finished;n++){stepRace(R,1/120);if(n%12==0)teleRecord();}
          const c={};for(const x of R.cars)c[x.compound]=(c[x.compound]||0)+1;return [R.player.lap,ui.tele&&ui.tele.laps.length,JSON.stringify(c),R.yellow.length]}""")
        print(r)
        await pg.evaluate("()=>{R.fx=true;showRaceResults();}");await pg.wait_for_timeout(400)
        await pg.screenshot(path='out_tele.png',full_page=False)
        await pg.evaluate("()=>{document.querySelector('#results .card').scrollTop=400}");await pg.screenshot(path='out_tele2.png')
        print(errs);await b.close()
asyncio.run(main())
