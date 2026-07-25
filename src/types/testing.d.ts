// Added by Antigravity
declare module "vitest" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function expect(actual: unknown): {
    toBe(expected: unknown): void;
    toHaveProperty(property: string): void;
  };
}

declare module "@playwright/test" {
  export interface PageLocator {
    fill(value: string): Promise<void>;
    click(): Promise<void>;
    toBeVisible(options?: { timeout?: number }): Promise<void>;
  }

  export interface PlaywrightPage {
    goto(url: string): Promise<void>;
    locator(selector: string): PageLocator;
    getByRole(role: string, options?: { name?: RegExp | string }): PageLocator;
  }

  export interface PlaywrightTestContext {
    page: PlaywrightPage;
  }

  export interface TestFn {
    (name: string, fn: (context: PlaywrightTestContext) => Promise<void>): void;
    describe(name: string, fn: () => void): void;
  }

  export const test: TestFn;

  export function expect(locator: PageLocator | unknown): {
    toHaveTitle(title: RegExp | string): Promise<void>;
    toBeVisible(options?: { timeout?: number }): Promise<void>;
    catch(fn: (err: unknown) => Promise<void> | void): Promise<void>;
  };
}
