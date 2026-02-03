import { test as base, chromium, type BrowserContext } from '@playwright/test';

export const test = base.extend<{ context: BrowserContext }>({
    context: async (_baseContext, runTest) => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        await runTest(context);
        await browser.close();
    },
});

export { expect } from '@playwright/test';
