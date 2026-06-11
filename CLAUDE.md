# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests
npx playwright test

# Run tests for a specific project
npx playwright test --project=conduit
npx playwright test --project=the-internet

# Run a single test file
npx playwright test tests/10-apiTesting.spec.ts

# Run in headed mode
npx playwright test --headed

# Generate and view Allure report
npm run allure:generate
npm run allure:open

# Serve Allure report live from results
npm run allure:serve
```

## Projects and Base URLs

Two Playwright projects are configured in `playwright.config.ts`:

| Project | Base URL | Test files |
|---|---|---|
| `conduit` | `https://demo.realworld.show` | All except `07-08-complexUI.spec.ts` |
| `the-internet` | `https://the-internet.herokuapp.com` | Only `07-08-complexUI.spec.ts` |

The `BASE_URL` env variable overrides the base URL (used in CI). Tests use `page.goto('/')` — the base URL is prepended automatically.

## Architecture

### Page Object Model

All page interactions are encapsulated in `pages/`. Every page class:
- Takes a `Page` object in the constructor and assigns locators as properties
- Exposes action methods (e.g. `login()`, `publish()`) and assertion methods (e.g. `assertOnPage()`)
- Extends `BasePage` which provides shared assertions like `assertNavUsername()`

The `pages/theInternetHerokuApp/` subdirectory holds POMs specific to the `the-internet` project.

### Custom Fixtures

`fixtures/authenticatedPage.ts` extends the base Playwright `test` with an `authenticatedPage` fixture that registers a fresh user via the UI before each test and returns the authenticated `Page`. Import from this file instead of `@playwright/test` when a test needs a logged-in session.

### API Client

`utils/apiClient.ts` wraps `APIRequestContext` in a class with typed methods (`register`, `createArticle`, `getArticle`, `deleteArticle`). Token auth is set via `setToken()`. Used in `tests/10-apiTesting.spec.ts` inside a `beforeAll` to seed data before UI assertions.

### Test Data

`utils/testData.ts` exports `generateUser()` which produces a unique user object using `Date.now()` — always use this rather than hardcoded credentials to avoid collisions in parallel runs.

`utils/constants.ts` holds the API base URL (`https://api.realworld.show/api`).

### Reporting

Both HTML (Playwright native) and Allure reporters run on every test execution. Allure metadata decorators (`@epic`, `@feature`, `@story`, `@severity`) are used in `tests/09-allureReport.spec.ts` as a reference pattern.

### CI

`.github/workflows/playwright.yml` runs both projects in parallel via a matrix strategy, caches Playwright browsers by `package-lock.json` hash, and uploads the Playwright HTML report, raw test results, and the generated Allure HTML report as artifacts.
