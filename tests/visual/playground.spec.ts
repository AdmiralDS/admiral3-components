import { themeModes } from '@admiral-ds/admiral3-tokens';
import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { VISUAL_SCENARIO_IDS } from '../../playground/scenarios/visual/manifest';

const playgroundThemeStorageKey = 'admiral-playground-theme';
const snapshotDirectory = resolve(dirname(fileURLToPath(import.meta.url)), 'playground.spec.ts-snapshots');
const snapshotSuffix = '-chromium-linux.png';
const scenarioIds = Object.values(VISUAL_SCENARIO_IDS);

const getVisualId = (title: string) =>
  title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '');

const getScenarioSnapshotId = (scenarioId: string) => scenarioId.replaceAll('/', '-');

const baselineNames = readdirSync(snapshotDirectory)
  .filter((name) => name.endsWith(snapshotSuffix))
  .map((name) => name.slice(0, -snapshotSuffix.length));

const getBaselineNames = (scenarioId: string, themeMode: string) => {
  const prefix = `${getScenarioSnapshotId(scenarioId)}-${themeMode}-`;

  return baselineNames.filter((name) => name.startsWith(prefix)).sort();
};

const registerSnapshotTargets = async (page: Page, scenarioId: string, themeMode: string) => {
  const snapshotNames: string[] = [];
  const sections = page.locator('.playground-preview section');
  const sectionCount = await sections.count();

  expect(sectionCount).toBeGreaterThan(0);

  for (let sectionIndex = 0; sectionIndex < sectionCount; sectionIndex += 1) {
    const section = sections.nth(sectionIndex);
    const sectionTitle = await section.locator('h2').first().innerText();
    const samples = section.locator('[data-visual-samples]');
    const samplesCount = await samples.count();
    const snapshotPrefix = `${getScenarioSnapshotId(scenarioId)}-${themeMode}-${sectionIndex + 1}-${getVisualId(
      sectionTitle,
    )}`;

    if (samplesCount === 0) {
      snapshotNames.push(snapshotPrefix);
      await section.evaluate(
        (element, snapshotName) => element.setAttribute('data-visual-snapshot', snapshotName),
        snapshotPrefix,
      );
      continue;
    }

    for (let samplesIndex = 0; samplesIndex < samplesCount; samplesIndex += 1) {
      const sampleList = samples.nth(samplesIndex);
      const group = sampleList.locator('xpath=ancestor::*[@data-visual-group][1]');
      const groupTitle = (await group.count()) > 0 ? await group.locator('h3').first().innerText() : undefined;
      const snapshotName = groupTitle
        ? `${snapshotPrefix}-${samplesIndex + 1}-${getVisualId(groupTitle)}`
        : snapshotPrefix;

      snapshotNames.push(snapshotName);
      await sampleList.evaluate(
        (element, registeredSnapshotName) => element.setAttribute('data-visual-snapshot', registeredSnapshotName),
        snapshotName,
      );
    }
  }

  return snapshotNames.sort();
};

for (const scenarioId of scenarioIds) {
  for (const themeMode of themeModes) {
    test.describe(`${scenarioId} / ${themeMode}`, () => {
      const scenarioBaselineNames = getBaselineNames(scenarioId, themeMode);
      let context: BrowserContext;
      let page: Page;
      let registeredSnapshotNames: string[];

      test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        await context.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), {
          key: playgroundThemeStorageKey,
          value: themeMode,
        });
        page = await context.newPage();
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(`/?scenario=${encodeURIComponent(scenarioId)}`);
        await page.evaluate(() => document.fonts.ready);
        registeredSnapshotNames = await registerSnapshotTargets(page, scenarioId, themeMode);
      });

      test.afterAll(async () => {
        await context.close();
      });

      for (const snapshotName of scenarioBaselineNames) {
        test(snapshotName, async () => {
          const target = page.locator(`[data-visual-snapshot="${snapshotName}"]`);

          await expect(target).toHaveCount(1);
          await expect(target).toHaveScreenshot(`${snapshotName}.png`);
        });
      }

      test('snapshot list is complete', async () => {
        const knownSnapshots = new Set(scenarioBaselineNames);

        for (const snapshotName of registeredSnapshotNames) {
          if (!knownSnapshots.has(snapshotName)) {
            const target = page.locator(`[data-visual-snapshot="${snapshotName}"]`);

            await expect(target).toHaveScreenshot(`${snapshotName}.png`);
            knownSnapshots.add(snapshotName);
          }
        }

        expect([...knownSnapshots].sort()).toEqual(registeredSnapshotNames);
      });
    });
  }
}
