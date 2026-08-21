/**
 * Integration specs for @silverassist/consent-banner consumed by a real Next app.
 *
 * The fixture installs the *packed tarball*, so these run against exactly what
 * npm publishes -- not `src/`, not a workspace link. Two defects in this
 * package were invisible any other way: it shipped with no "use client"
 * directive at all (tsup dropped the esbuild banner under `treeshake: true`),
 * and its documented `./styles` subpath pointed at a CSS file the build never
 * emitted.
 */
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  // The banner hides itself once consent is stored, so every spec starts from
  // a clean slate rather than inheriting a previous run's decision.
  await context.clearCookies();
});

test("compound dot-notation works from a Server Component", async ({
  page,
}) => {
  // Regression guard for the fix in this PR.
  //
  // `ConsentBanner` is Object.assign(Root, { Content, ... }). While the barrel
  // was itself a client module, Next replaced it with client references -- one
  // per named export -- and properties attached to a function were stripped:
  // <ConsentBanner.Content> resolved to undefined and hydration died with
  // React error #130. The README documents that dot notation 40 times, so the
  // documented API was the broken one.
  //
  // The barrel now composes the compound from ./client's references while
  // staying a server module itself. The fixture page uses dot notation
  // exclusively, so this rendering at all is the assertion.
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("consent-banner fixture");
  await expect(page.getByText("We use cookies.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Accept" })).toBeVisible();
});

test("renders from a Server Component page without a client-boundary error", async ({
  page,
}) => {
  await page.goto("/");
  // Were the "use client" directive missing from the built file -- which is
  // how this package shipped for its entire published life -- the page would
  // have failed to prerender and never reached the browser.
  await expect(page.locator("h1")).toHaveText("consent-banner fixture");
  await expect(page.getByText("We use cookies.")).toBeVisible();
});

test("serves the documented ./styles subpath", async ({ page }) => {
  // README line 301 documents `import "@silverassist/consent-banner/styles"`
  // for consumers not using Tailwind. The exports map pointed at
  // dist/styles.css, which the build never emitted, so that import failed to
  // resolve in every published version -- the fixture's layout imports it, so
  // a regression breaks the build outright.
  //
  // Asserted through a design token rather than a class name: the stylesheet's
  // job is to define these, and reaching for a class would couple the spec to
  // markup instead of to the contract.
  await page.goto("/");
  const token = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--consent-banner-bg")
      .trim(),
  );
  expect(token, "styles.css defines its design tokens").toBe("#1f2937");
});

test("accepting hides the banner and persists the decision", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Accept" }).click();
  await expect(page.getByText("We use cookies.")).toBeHidden();

  // Persistence is the whole point of a consent banner: a reload must not ask
  // again. This exercises the storage path across a real navigation, which a
  // jsdom unit test only simulates.
  await page.reload();
  await expect(page.getByText("We use cookies.")).toBeHidden();
});

test("dismissing hides the banner", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Dismiss" }).click();
  await expect(page.getByText("We use cookies.")).toBeHidden();
});
