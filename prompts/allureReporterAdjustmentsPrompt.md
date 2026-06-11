Allure reporter is already configured in this Playwright TypeScript project.
Do not touch playwright.config.ts or any setup files.

Your job is to enrich the existing test file(s) I paste below with
Allure annotations imported from 'allure-js-commons'.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANNOTATIONS TO USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Add only the annotations that make sense for each test — do not
pad with annotations that add no value. Use these:

  epic / feature / story      → BDD hierarchy (where in the app)
  severity                    → 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'
  owner                       → team or person responsible
  tag / tags                  → free-form labels for filtering in the report
  allureId                    → stable test ID matching your test plan (e.g. 'ART-001')
  displayName                 → human-readable title if the test name is too technical
  description                 → markdown acceptance criteria or notes
  issue(url, name)            → link to a related bug
  tms(url, name)              → link to the test case in your TMS
  step(name, async () => {})  → wrap logical blocks (login, fill form, verify)
  parameter(name, value)      → expose test data values in the report
    — use mode: 'masked' for passwords/tokens
  attachment(name, content, ContentType.JSON)  → attach API responses or state snapshots
  test.afterEach: attach a screenshot on failure using testInfo.status

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Import from 'allure-js-commons', not the deprecated allure object
- await every annotation call
- Place metadata annotations (epic, feature, story, severity, owner,
  allureId, tags) at the top of the test body before any actions
- Wrap each logical phase in step() — e.g. 'Setup', 'Navigate',
  'Fill form', 'Assert' — so the report shows a clear test timeline
- Do not change test logic, locators, assertions, or existing imports
- Keep the original test.describe structure intact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MY TEST FILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[PASTE YOUR TEST FILE HERE]