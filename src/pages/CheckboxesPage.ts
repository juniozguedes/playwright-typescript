import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
  private readonly checkboxes: Locator;

  constructor(page: Page) {
    super(page);
    this.checkboxes = page.getByRole('checkbox');
  }

  async goto(): Promise<void> {
    await this.navigate('/checkboxes');
  }

  checkbox(index: 0 | 1): Locator {
    return this.checkboxes.nth(index);
  }

  async check(index: 0 | 1): Promise<void> {
    await this.checkboxes.nth(index).check();
  }

  async uncheck(index: 0 | 1): Promise<void> {
    await this.checkboxes.nth(index).uncheck();
  }
}
