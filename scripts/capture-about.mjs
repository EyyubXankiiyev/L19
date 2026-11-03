import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.evaluate(() => { location.hash = 'about'; });
  await page.waitForTimeout(650);
  await page.screenshot({ path: `artifacts/about-viewport-${width}.png`, animations: 'disabled' });
  await page.locator('.about-directions').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/about-directions-${width}.png`, animations: 'disabled' });
  await page.close();
}
await browser.close();
