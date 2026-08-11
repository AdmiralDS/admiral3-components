import { expect, test } from '@playwright/test';

const getScenarioId = (scenarioPath: string) => {
  const scenarioId = new URL(scenarioPath, 'http://localhost').searchParams.get('scenario');

  if (!scenarioId) {
    throw new Error(`Playground scenario is missing in path: ${scenarioPath}`);
  }

  return scenarioId.replaceAll('/', '-');
};

const getVisualId = (title: string) =>
  title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '');

test('playground scenarios match visual snapshots', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const scenarioPaths = await page
    .locator('.playground-nav-link[data-visual]')
    .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
  const themeModes = await page
    .locator('#playground-theme option')
    .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value));

  for (const scenarioPath of scenarioPaths) {
    for (const themeMode of themeModes) {
      await test.step(`${getScenarioId(scenarioPath)} / ${themeMode}`, async () => {
        await page.goto(scenarioPath);
        await page.locator('#playground-theme').selectOption(themeMode);
        await page.evaluate(() => document.fonts.ready);

        const sections = page.locator('.playground-preview section');
        const sectionCount = await sections.count();

        expect(sectionCount).toBeGreaterThan(0);

        for (let sectionIndex = 0; sectionIndex < sectionCount; sectionIndex += 1) {
          const section = sections.nth(sectionIndex);
          const sectionTitle = await section.locator('h2').first().innerText();
          const samples = section.locator('[data-visual-samples]');
          const samplesCount = await samples.count();

          if (samplesCount === 0) {
            const snapshotName = `${getScenarioId(scenarioPath)}-${themeMode}-${sectionIndex + 1}-${getVisualId(
              sectionTitle,
            )}.png`;

            await test.step(snapshotName, async () => {
              await expect.soft(section).toHaveScreenshot(snapshotName);
            });
          }

          for (let samplesIndex = 0; samplesIndex < samplesCount; samplesIndex += 1) {
            const sampleList = samples.nth(samplesIndex);
            const group = sampleList.locator('xpath=ancestor::*[@data-visual-group][1]');
            const snapshotPrefix = `${getScenarioId(scenarioPath)}-${themeMode}-${sectionIndex + 1}-${getVisualId(
              sectionTitle,
            )}`;
            const groupTitle = (await group.count()) > 0 ? await group.locator('h3').first().innerText() : undefined;
            const snapshotName = groupTitle
              ? `${snapshotPrefix}-${samplesIndex + 1}-${getVisualId(groupTitle)}.png`
              : `${snapshotPrefix}.png`;

            await test.step(snapshotName, async () => {
              await expect.soft(sampleList).toHaveScreenshot(snapshotName);
            });
          }
        }
      });
    }
  }
});
