import { test, expect } from '../../src/fixtures';

test.describe('Checkboxes', () => {
  test.beforeEach(async ({ checkboxesPage }) => {
    await checkboxesPage.goto();
  });

  test('has correct initial state', async ({ checkboxesPage }) => {
    await expect(checkboxesPage.checkbox(0)).not.toBeChecked();
    await expect(checkboxesPage.checkbox(1)).toBeChecked();
  });

  test('checking checkbox 1 results in both checkboxes being checked', async ({ checkboxesPage }) => {
    await checkboxesPage.check(0);

    await expect(checkboxesPage.checkbox(0)).toBeChecked();
    await expect(checkboxesPage.checkbox(1)).toBeChecked();
  });
});
