import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('docs/preview', { recursive: true });
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:4173');
await page.locator('.hero-product').evaluate(img=>img.decode());
await page.screenshot({path:'docs/preview/desktop.png'});
await page.screenshot({path:'docs/preview/full-page.png',fullPage:true});
assert.equal(await page.locator('.hero-product').evaluate(img=>img.naturalWidth),1400);
const missing=await page.evaluate(()=>{const keys=[...document.querySelectorAll('[data-i18n],[data-aria],[data-placeholder]')].map(e=>e.dataset.i18n||e.dataset.aria||e.dataset.placeholder);return ['ko','zh'].flatMap(lang=>keys.filter(k=>!(k in translations[lang])).map(k=>`${lang}:${k}`));});
assert.deepEqual(missing,[],'Every user-facing translation key must be translated');
await page.getByRole('button',{name:'Increase quantity',exact:true}).click();
await page.getByRole('button',{name:'Add to preview bag',exact:true}).click();
assert.match(await page.locator('.cart-total').innerText(),/A\$48.00/);
await page.locator('#cart-dialog [data-close]').click();
await page.locator('#currency').selectOption('USD');
await page.getByRole('button',{name:'Shopping bag',exact:true}).click();
assert.match(await page.locator('.cart-total').innerText(),/US\$32.00/);
await page.getByRole('button',{name:'Remove',exact:true}).click();
assert.equal(await page.locator('.empty-bag').isVisible(),true);
await page.locator('#cart-dialog [data-close]').click();
await page.getByRole('button',{name:'Found a better everyday price?',exact:true}).click();
await page.locator('#match-url').fill('https://example.com/product');
await page.locator('#match-price').fill('14.50');
await page.locator('#match-email').fill('preview@example.com');
await page.getByRole('button',{name:'Preview request',exact:true}).click();
assert.match(await page.locator('#match-result').innerText(),/Nothing has been submitted/);
await page.locator('#info-dialog [data-close]').click();
await page.locator('#newsletter-email').fill('preview@example.com');
await page.locator('#newsletter-form input[type=checkbox]').check();
await page.getByRole('button',{name:'Keep me posted',exact:true}).click();
assert.match(await page.locator('#newsletter-result').innerText(),/hasn’t saved your email/);
assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage}).includes('preview@example.com')),false);
for(const lang of ['en','ko','zh']){
  await page.locator('#language').selectOption(lang);
  assert.equal(await page.locator('html').getAttribute('lang'),{en:'en',ko:'ko',zh:'zh-Hans'}[lang]);
  for(const width of [1440,768,390,320]){
    await page.setViewportSize({width,height:900});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${lang} at ${width}px must not overflow`);
    assert.equal(await page.locator('.hero-product').isVisible(),true);
    if(width===390){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`docs/preview/mobile-${lang}.png`});}
  }
}
await page.reload();assert.equal(await page.locator('#language').inputValue(),'zh');assert.equal(await page.locator('#currency').inputValue(),'USD');
await page.locator('#language').selectOption('en');await page.locator('#currency').selectOption('AUD');
await page.setViewportSize({width:390,height:900});
await page.getByRole('button',{name:'Open menu',exact:true}).click();
assert.equal(await page.locator('#mobile-nav').isVisible(),true);
await page.locator('#mobile-nav a[href="#shop"]').click();
assert.equal(await page.locator('#mobile-nav').isVisible(),false);
await page.locator('#shop').screenshot({path:'docs/preview/mobile-product.png'});
assert.deepEqual(errors,[]);
await writeFile('docs/preview/checks.txt','PASS: build and JavaScript syntax; product image; all translation keys; bag quantity/remove/currency totals; demo price-match and newsletter; no email persistence; 3 languages at 1440/768/390/320px without horizontal overflow; remembered preferences; mobile navigation. No browser errors.\n');
console.log('All storefront preview checks passed.');
await browser.close();
