# Test Plan: User Authentication
**Feature:** User Authentication  
**App:** https://demo.realworld.show/  
**Stack:** React SPA, REST API at `/api/users/login`

---

## TC-AUTH-001 — Happy path: valid login

**Description:** A registered user can log in with correct credentials and reach their home feed.

**Preconditions:**
- A registered account exists (username, email, password known)

**Steps:**
1. Navigate to `/#/login`
2. Enter the registered email address in the Email field
3. Enter the correct password in the Password field
4. Click **Sign in**

**Expected result:**
- Redirected to the home feed (`/#/`)
- Navigation bar shows the user's username
- No error messages displayed

**Priority:** P1

---

## TC-AUTH-002 — Invalid credentials: wrong password

**Description:** Login attempt with a valid email but incorrect password is rejected.

**Preconditions:**
- A registered account exists

**Steps:**
1. Navigate to `/#/login`
2. Enter the registered email address
3. Enter an incorrect password
4. Click **Sign in**

**Expected result:**
- User remains on the login page
- Error message displayed: `email or password` is invalid (422 response from API)
- No session cookie / token set

**Priority:** P1

---

## TC-AUTH-003 — Invalid credentials: unregistered email

**Description:** Login attempt with an email that has no associated account is rejected.

**Preconditions:**
- Email address used is not registered

**Steps:**
1. Navigate to `/#/login`
2. Enter a non-existent email address
3. Enter any password
4. Click **Sign in**

**Expected result:**
- User remains on the login page
- Error message displayed: `email or password` is invalid
- No session established

**Priority:** P1

---

## TC-AUTH-004 — Empty fields: both fields empty

**Description:** Submitting the login form with no input does not trigger an API call and shows validation feedback.

**Preconditions:** None

**Steps:**
1. Navigate to `/#/login`
2. Leave Email and Password fields empty
3. Click **Sign in**

**Expected result:**
- No API request sent to `/api/users/login`
- Form-level or browser-native validation prevents submission
- User remains on the login page

**Priority:** P2

---

## TC-AUTH-005 — Empty fields: email missing

**Description:** Submitting with only a password and no email is rejected.

**Preconditions:** None

**Steps:**
1. Navigate to `/#/login`
2. Leave Email field empty
3. Enter any value in the Password field
4. Click **Sign in**

**Expected result:**
- Submission blocked or API returns a validation error
- User remains on the login page
- Email field is indicated as required

**Priority:** P2

---

## TC-AUTH-006 — Empty fields: password missing

**Description:** Submitting with only an email and no password is rejected.

**Preconditions:** None

**Steps:**
1. Navigate to `/#/login`
2. Enter a valid email address
3. Leave Password field empty
4. Click **Sign in**

**Expected result:**
- Submission blocked or API returns a validation error
- User remains on the login page
- Password field is indicated as required

**Priority:** P2

---

## TC-AUTH-007 — Session persistence: token survives page reload

**Description:** An authenticated session is restored after a full browser reload without requiring re-login.

**Preconditions:**
- User is logged in (TC-AUTH-001 preconditions met)

**Steps:**
1. Log in with valid credentials
2. Confirm the username appears in the nav bar
3. Reload the page (F5 / browser refresh)

**Expected result:**
- After reload, user is still authenticated
- Navigation bar still shows the username
- No redirect to the login page

**Priority:** P1

---

## TC-AUTH-008 — Session persistence: token survives new tab

**Description:** Opening a new tab in the same browser uses the existing session without requiring re-login.

**Preconditions:**
- User is logged in

**Steps:**
1. Log in with valid credentials
2. Open a new browser tab
3. Navigate to `https://demo.realworld.show/`

**Expected result:**
- New tab shows the user as authenticated
- Username visible in the navigation bar

**Priority:** P2
