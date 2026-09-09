const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 700 } });
  await mobile.goto('http://localhost:3000', { waitUntil: 'load', timeout: 60000 });
  await mobile.waitForTimeout(1500);
  await mobile.screenshot({ path: 'nav-mobile-closed.png' });
  await mobile.click('button[aria-label="Toggle menu"]');
  await mobile.waitForTimeout(300);
  await mobile.screenshot({ path: 'nav-mobile-open.png' });

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 500 } });
  await desktop.goto('http://localhost:3000', { waitUntil: 'load', timeout: 60000 });
  await desktop.waitForTimeout(1000);
  await desktop.screenshot({ path: 'nav-desktop.png' });

  await browser.close();
  console.log('done');
})();
