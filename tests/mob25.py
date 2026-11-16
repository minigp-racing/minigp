import pathlib
MINIGP=pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').as_uri()
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for (w,h,tag) in [(1280,760,'d'),(390,844,'mp'),(844,390,'ml')]:
            ctx=await b.new_context(viewport={'width':w,'height':h},has_touch=tag!='d',is_mobile=tag!='d',device_scale_factor=2 if tag!='d' else 1)
            pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(MINIGP);await pg.evaluate("localStorage.setItem('minigp_welcomed','1')");await pg.reload();await pg.wait_for_timeout(1000)
            await pg.screenshot(path=f'u_menu_{tag}.png')
            await pg.click('#bSettings');await pg.wait_for_timeout(300);await pg.screenshot(path=f'u_set_{tag}.png',full_page=True)
            await pg.click('#setBack');await pg.click('#bQuick');await pg.wait_for_timeout(300)
            await pg.click('[data-set=quali] button[data-v="0"]');await pg.click('[data-set=formation] button[data-v="0"]');await pg.click('#qGo');await pg.wait_for_timeout(500);await pg.evaluate("()=>{const b=document.getElementById('preGo');if(b&&b.offsetParent)b.click();}");await pg.wait_for_timeout(1500)
            await pg.evaluate("()=>{R.player.bot=true;R.fx=false;for(let n=0;n<120*30;n++)stepRace(R,1/120);R.fx=true;R.events.length=0;radioSay('Prueba de radio del ingeniero.',null,0,true);}")
            await pg.wait_for_timeout(1500);await pg.screenshot(path=f'u_race_{tag}.png')
            print(tag,errs[:3]);await ctx.close()
        await b.close()
asyncio.run(main())
