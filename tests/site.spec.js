import { test, expect } from '@playwright/test';

test('bilingual content, research keyboard navigation and persisted language', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Radiasiya kimyası');
  const research = page.locator('#research');
  await research.getByRole('tab').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(research.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#research-panel')).toContainText('Qurğuşunsuz');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText('Radiation chemistry for');
  await expect(research.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(errors).toEqual([]);
});

test('research search, filters, detail dialog and overview download', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#publications');
  const search = section.getByRole('searchbox');
  await search.fill('bentonit');
  await expect(section.locator('.material-card')).toHaveCount(1);
  await section.getByRole('button', { name: 'Ətraflı bax' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('HNBR/bentonit');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(section.getByRole('button', { name: 'Ətraflı bax' })).toBeFocused();
  await search.fill('unfindable-material-123');
  await expect(section.locator('.material-card')).toHaveCount(0);
  await expect(section).toContainText('Uyğun material tapılmadı.');
  await section.getByRole('button', { name: 'Axtarışı təmizlə', exact: true }).first().click();
  await section.getByRole('tab', { name: 'Nəşrlər' }).click();
  await expect(section).toContainText('10.1016/j.radphyschem.2026.114064');
  await section.getByRole('tab', { name: 'Layihələr və patentlər' }).click();
  await expect(section.locator('.material-card')).toHaveCount(14);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Laboratoriya haqqında məlumatı endir' }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('laboratory-19-az.txt');
});

test('mobile navigation and a restrained content-first layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Radiasiya kimyası');
  await expect(page.locator('.cinematic-hero-image')).toBeVisible();
  await page.screenshot({ path: 'artifacts/mobile-hero.png', animations: 'disabled' });
  await page.getByRole('button', { name: 'Menyunu aç' }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Tədqiqatlar' }).click();
  await expect(page.getByRole('navigation')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/mobile.png', fullPage: true, animations: 'disabled' });
});

test('global search navigates to the chosen research area and method tabs explain measurements', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Saytda axtarış' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox').fill('biopolimer');
  await dialog.getByRole('button', { name: /Biopolimerlər və funksional örtüklər/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('#research-tab-2')).toHaveAttribute('aria-selected', 'true');
  const methods = page.locator('#methods');
  await methods.getByRole('tab', { name: /SEM \/ EDS/ }).click();
  await expect(page.locator('#method-detail')).toContainText('Səth və element tərkibi');
  await methods.getByRole('tab', { name: /SEM \/ EDS/ }).press('ArrowRight');
  await expect(page.locator('#method-detail')).toContainText('Temperatur altında davranış');
  await page.getByRole('button', { name: 'Saytda axtarış' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Saytda axtarış' })).toBeFocused();
});

test('desktop page, laboratory imagery and centered content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.material-card')).toHaveCount(23);
  await expect(page.locator('.about-gallery img')).toHaveCount(3);
  await expect(page.locator('#about .about-image')).toHaveCount(0);
  await page.locator('.about-direction').nth(1).click();
  await expect(page.locator('#research-tab-1')).toHaveAttribute('aria-selected', 'true');
  const about = await page.locator('#about').boundingBox();
  expect(about.width).toBe(1440);
  const inner = await page.locator('.about-layout').boundingBox();
  expect(inner.x).toBeGreaterThan(0);
  expect(inner.x + inner.width).toBeLessThan(1440);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true, animations: 'disabled' });
  await page.screenshot({ path: 'artifacts/desktop-hero.png', animations: 'disabled' });
});

test('both languages fit narrow phones, tablets and desktop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const language of ['az', 'en']) {
    if (language === 'en') await page.getByRole('button', { name: 'Switch to English' }).click();
    for (const width of [320, 600, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => new Promise(requestAnimationFrame));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow in ${language} at ${width}px`).toBe(true);
    }
  }
});

test('search opens the matching method or study, and print layout removes navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Saytda axtarış' }).click();
  let dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox').fill('SEM');
  await dialog.getByRole('button', { name: /SEM \/ EDS/ }).click();
  await expect(page.locator('#method-tab-2')).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Saytda axtarış' }).click();
  dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox').fill('bentonit');
  await dialog.getByRole('button', { name: /HNBR\/bentonit/ }).click();
  await expect(page.locator('#publications .material-card')).toHaveCount(1);
  await expect(page.locator('#publications .search-field input')).toHaveValue('HNBR/bentonit kompozitləri');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.section-index')).toBeHidden();
  await expect(page.locator('.header-actions')).toBeHidden();
  await expect(page.locator('h1')).toBeVisible();
});
