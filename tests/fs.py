import pathlib
MINIGP=pathlib.Path(__file__).resolve().parent.parent.joinpath('index.html').as_uri()
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for (w,h,tag) in [(1280,760,'d'),(844,390,'ml')]:
            ctx=await b.new_context(viewport={'width':w,'height':h},has_touch=tag!='d',is_mobile=tag!='d',device_scale_factor=1)
            pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(MINIGP);await pg.evaluate("localStorage.setItem('minigp_welcomed','1')");await pg.reload();await pg.wait_for_timeout(1500)
            await pg.screenshot(path=f'fs_menu_{tag}.png')
            await pg.click('#bQuick');await pg.wait_for_timeout(400);await pg.screenshot(path=f'fs_quick_{tag}.png')
            print(tag,errs[:3]);await ctx.close()
        await b.close()
asyncio.run(main())
