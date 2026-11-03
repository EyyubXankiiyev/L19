import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const width of [1440, 1280, 1024, 768, 390, 360, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  const metrics = await page.evaluate(() => {
    const box = (selector) => {
      const rect = document.querySelector(selector)?.getBoundingClientRect();
      return rect && { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) };
    };
    return {
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      header: box('.site-header'),
      hero: box('.cinematic-hero'),
      about: box('.section.about'),
      aboutInner: box('.about-layout'),
      aboutIntro: box('.about-intro'),
      gallery: box('.about-gallery'),
      directions: box('.about-directions'),
      research: box('.section.research'),
      imageFailures: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
      aboutGalleryCount: document.querySelectorAll('#about .about-gallery img').length,
      duplicatePhotoCount: document.querySelectorAll('#about .about-image').length,
      overflow: [...document.querySelectorAll('body *')].map((element) => ({ element, rect: element.getBoundingClientRect() })).filter(({ rect }) => rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1)).slice(0, 12).map(({ element, rect }) => ({ tag: element.tagName, className: typeof element.className === 'string' ? element.className : '', left: Math.round(rect.left), right: Math.round(rect.right) })),
    };
  });
  console.log(JSON.stringify(metrics));
  if (metrics.documentWidth > width || metrics.about.width !== width || metrics.research.width !== width || metrics.imageFailures.length || metrics.aboutGalleryCount !== 3 || metrics.duplicatePhotoCount !== 0) {
    throw new Error(`Layout audit failed at ${width}px`);
  }
  if (width > 850 && (metrics.gallery.x <= metrics.aboutIntro.x || Math.abs(metrics.gallery.y - metrics.aboutIntro.y) > 2)) {
    throw new Error(`About gallery is not beside the introduction at ${width}px`);
  }
  if (width === 1440 || width === 390) {
    await page.screenshot({ path: `artifacts/home-${width}.png`, fullPage: false });
    await page.evaluate(() => { location.hash = 'about'; });
    await page.waitForTimeout(500);
    const anchor = await page.evaluate(() => ({
      headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
      eyebrowTop: document.querySelector('.about-intro .section-kicker').getBoundingClientRect().top,
    }));
    console.log(JSON.stringify({ width, anchor }));
    if (anchor.eyebrowTop < anchor.headerBottom) throw new Error(`About anchor hidden by header at ${width}px`);
    await page.locator('#about').screenshot({ path: `artifacts/about-${width}.png` });
  }
  await page.close();
}
const resizedPage = await browser.newPage();
await resizedPage.emulateMedia({ reducedMotion: 'reduce' });
await resizedPage.goto('http://127.0.0.1:5173/');
await resizedPage.setViewportSize({ width: 320, height: 900 });
await resizedPage.screenshot({ path: 'artifacts/home-320-resized.png' });
console.log(JSON.stringify(await resizedPage.evaluate(() => ({
  resizedWidth: document.documentElement.scrollWidth,
  overflow: [...document.querySelectorAll('body *')].map((element) => ({ element, rect: element.getBoundingClientRect() })).filter(({ rect }) => rect.width > 0 && rect.right > innerWidth + 1).slice(0, 20).map(({ element, rect }) => ({ tag: element.tagName, className: typeof element.className === 'string' ? element.className : '', right: Math.round(rect.right) })),
}))));
await resizedPage.close();
await browser.close();
