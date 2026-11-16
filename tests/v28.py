import pathlib
MINIGP=pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').as_uri()
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':1280,'height':900})
        pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(MINIGP);await pg.evaluate("localStorage.setItem('minigp_welcomed','1')");await pg.reload();await pg.wait_for_timeout(800)
        await pg.click('#bQuick');await pg.wait_for_timeout(300)
        await pg.click('[data-set=quali] button[data-v="0"]');await pg.click('[data-set=formation] button[data-v="0"]')
        el=await pg.query_selector('.setupFx');await el.scroll_into_view_if_needed();
        await pg.evaluate("()=>{const r=document.querySelector('input[data-setup=wing]');r.value=2;r.dispatchEvent(new Event('input',{bubbles:true}));}")
        await pg.screenshot(path='v28_setup.png')
        await pg.click('#qGo');await pg.wait_for_timeout(500);await pg.evaluate("()=>{const b=document.getElementById('preGo');if(b&&b.offsetParent)b.click();}");await pg.wait_for_timeout(300)
        await pg.evaluate("()=>{window._ev=[];const o=R.events.push.bind(R.events);R.events.push=(e)=>{if(e.type==='launch'&&e.car.isPlayer)window._ev.push(e.kind+' '+Math.round(e.car.launchRpm));return o(e);};}")
        # dar toques durante la cuenta atrás
        for i in range(60):
            ph=await pg.evaluate("R.phase")
            if ph!='countdown' and i>5: break
            r=await pg.evaluate("R.player.lrpm||0")
            if r<10500: await pg.keyboard.down('ArrowUp')
            else: await pg.keyboard.up('ArrowUp')
            await pg.wait_for_timeout(120)
        await pg.keyboard.up('ArrowUp')
        await pg.wait_for_timeout(1200)
        print('launch',await pg.evaluate("window._ev"),'vel km/h sin tocar nada',await pg.evaluate("Math.round(Math.hypot(R.player.vx,R.player.vy)*0.55)"),errs[:3])
        await ctx.close();await b.close()
asyncio.run(main())
