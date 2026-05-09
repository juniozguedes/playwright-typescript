import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';

interface TestFixtures {
  loginPage: LoginPage;
  dynamicLoadingPage: DynamicLoadingPage;
}

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dynamicLoadingPage: async ({ page }, use) => {
    await use(new DynamicLoadingPage(page));
  },
});

export { expect };
