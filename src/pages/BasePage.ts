import { Page } from '@playwright/test';

export interface NavigateOptions {
  maskUrl?: boolean;
}

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string, options?: NavigateOptions): Promise<void> {
    const logUrl = options?.maskUrl ? '/[masked]' : path;
    console.info(`[navigation] → ${logUrl}`);
    await this.page.goto(path);
  }
}
