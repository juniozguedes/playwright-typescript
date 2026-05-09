import { test as base, expect } from '@playwright/test';
import { CheckboxesPage } from '../pages/CheckboxesPage';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';
import { LoginPage } from '../pages/LoginPage';

interface TestFixtures {
  checkboxesPage: CheckboxesPage;
  dynamicLoadingPage: DynamicLoadingPage;
  loginPage: LoginPage;
}

export const test = base.extend<TestFixtures>({
  checkboxesPage: async ({ page }, use) => {
    await use(new CheckboxesPage(page));
  },
  dynamicLoadingPage: async ({ page }, use) => {
    await use(new DynamicLoadingPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect };
