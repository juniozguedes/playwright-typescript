import { test, expect } from '../../src/fixtures';

test.describe('Dynamic Loading', () => {
  test('shows finish text after loading completes', async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.goto();
    await dynamicLoadingPage.clickStart();
    await dynamicLoadingPage.waitForFinish();

    await expect(dynamicLoadingPage.finishHeading).toBeVisible();
    await expect(dynamicLoadingPage.finishHeading).toHaveText('Hello World!');
  });
});
