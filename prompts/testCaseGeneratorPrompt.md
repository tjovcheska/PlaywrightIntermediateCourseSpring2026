You are a QA engineer writing Playwright tests in TypeScript for https://demo.realworld.show/ (a Conduit blog app).

Feature: User authentication
App stack: React SPA, REST API at /api/users/login

Generate a test plan covering:
1. Happy path (valid login)
2. Invalid credentials
3. Empty fields
4. Session persistence after reload

Format each test as:
- Test ID
- Description
- Preconditions
- Steps
- Expected result
- Priority (P1/P2/P3)
Store the test cases in testCases directory that should be created

You are a QA engineer writing Playwright tests in TypeScript for
https://demo.realworld.show/ (Conduit blog app).

Feature: Article management
API base: https://demo.realworld.show/api

Generate a test plan covering:
1. Create article — happy path (title, description, body, tags)
2. Create article — validation (empty required fields)
3. Edit article — author can update their own article
4. Edit article — non-author cannot edit (unauthorized)
5. Delete article — author deletes, verifies removal from feed
6. Global feed — articles appear, pagination works
7. Personal feed — only followed users' articles appear

Format each test as:
- Test ID (e.g. ART-001)
- Description
- Preconditions (e.g. "logged in as author")
- Steps
- Expected result
- API calls involved
- Priority (P1/P2/P3)
Store the test cases in testCases directory that should be created