const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1000);

  const addButtons = page.getByRole('button', { name: /add to cart/i });
  const count = await addButtons.count();
  console.log('add-to-cart buttons on homepage:', count);

  await addButtons.first().click();
  await page.waitForTimeout(300);
  await addButtons.nth(1).click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'cart-badge.png', clip: { x: 1250, y: 0, width: 190, height: 120 } });

  await page.click('a[href="/cart"]');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'cart-page-filled.png', fullPage: true });

  await browser.close();
  console.log('done');
})();
