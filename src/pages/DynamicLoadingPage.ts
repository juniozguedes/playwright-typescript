import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

const FINISH_VISIBLE_TIMEOUT = 10_000;

export class DynamicLoadingPage extends BasePage {
  private readonly startButton: Locator;
  private readonly finishContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.finishContainer = page.locator('#finish');
  }

  async goto(): Promise<void> {
    await this.navigate('/dynamic_loading/1');
  }

  async clickStart(): Promise<void> {
    await this.startButton.click();
  }

  get finishHeading(): Locator {
    return this.finishContainer.getByRole('heading');
  }

  async waitForFinish(): Promise<void> {
    await this.finishContainer.waitFor({ state: 'visible', timeout: FINISH_VISIBLE_TIMEOUT });
  }
}
