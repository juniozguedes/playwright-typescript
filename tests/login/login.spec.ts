import { test, expect } from '../../src/fixtures';
import { loginScenarios } from '../../src/data/login.data';

test.describe('Login', () => {
  for (const scenario of loginScenarios) {
    test(`${scenario.description}`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.login(scenario.username, scenario.password);

      const flashText = await loginPage.getFlashMessageText();
      expect(flashText).toContain(scenario.expectedMessage);

      if (scenario.expectSuccess) {
        await expect(loginPage.successFlash).toBeVisible();
      } else {
        await expect(loginPage.errorFlash).toBeVisible();
      }
    });
  }
});
