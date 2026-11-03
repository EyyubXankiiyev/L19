import { test, expect } from '@playwright/test';

test('PDF content is bilingual, searchable and included in the overview', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.equipment-card')).toHaveCount(7);
  await expect(page.locator('#team')).toContainText('Rəna Xankişiyeva');
  await page.getByRole('button', { name: 'Saytda axtarış' }).click();
  await page.getByRole('dialog').getByRole('textbox').fill('Primus');
  await page.getByRole('dialog').getByRole('button', { name: /Rigaku ZSX Primus IV/ }).click();
  await expect(page).toHaveURL(/#equipment-2$/);
  await page.locator('#research-tab-5').click();
  await expect(page.locator('#research-panel')).toContainText('Dozimetriya');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('#equipment-2')).toContainText('elemental composition');
  await expect(page.locator('#team')).toContainText('12 scientific and 4 technical');
  const downloadEvent = page.waitForEvent('download');
  await page.locator('.team-download').click();
  const download = await downloadEvent;
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream) text += chunk.toString('utf8');
  expect(text).toContain('Rigaku ZSX Primus IV');
  expect(text).toContain('Norm Sement');
  expect(errors).toEqual([]);
});
