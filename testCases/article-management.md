# Test Plan: Article Management
**Feature:** Article Management  
**App:** https://demo.realworld.show/  
**API base:** https://demo.realworld.show/api

---

## ART-001 — Create article: happy path

**Description:** An authenticated author can publish an article with all fields filled and is redirected to the article page.

**Preconditions:**
- Logged in as a registered user

**Steps:**
1. Navigate to `/#/editor`
2. Fill in Article Title, description, body, and one or more tags (press Enter after each tag)
3. Click **Publish Article**

**Expected result:**
- Redirected to the article detail page (`/#/article/<slug>`)
- Article title appears in the page heading
- Tags are visible on the article page

**API calls involved:**
- `POST /api/articles` — creates the article, returns slug

**Priority:** P1

---

## ART-002 — Create article: empty required fields

**Description:** Attempting to publish an article with no title, description, or body shows validation errors and does not create an article.

**Preconditions:**
- Logged in as a registered user

**Steps:**
1. Navigate to `/#/editor`
2. Leave all fields empty
3. Click **Publish Article**

**Expected result:**
- Error messages are displayed (e.g. "title can't be blank", "body can't be blank")
- URL remains on `/editor`
- No article is created

**API calls involved:**
- `POST /api/articles` — returns 422 Unprocessable Entity with field errors

**Priority:** P1

---

## ART-003 — Edit article: author updates their own article

**Description:** The article author can open the editor for an existing article, change the title and body, and see the updated content on the article page.

**Preconditions:**
- Logged in as author
- At least one article exists authored by this user

**Steps:**
1. Navigate to the article detail page
2. Click the **Edit Article** button (visible only to the author)
3. Update the title and/or body
4. Click **Publish Article**

**Expected result:**
- Redirected to the updated article page
- New title and body content are displayed
- No error messages

**API calls involved:**
- `PUT /api/articles/:slug` — updates the article, may return a new slug

**Priority:** P1

---

## ART-004 — Edit article: non-author cannot edit

**Description:** A user who is not the article author does not see the Edit/Delete controls on the article page.

**Preconditions:**
- Article exists authored by User A
- Logged in as User B (different account)

**Steps:**
1. Navigate to the article detail page for User A's article
2. Inspect the article action buttons in the banner

**Expected result:**
- Edit Article and Delete Article buttons are **not visible**
- Only the Favorite button is shown

**API calls involved:**
- `GET /api/articles/:slug` — used to load the article

**Priority:** P2

---

## ART-005 — Delete article: author deletes and verifies removal

**Description:** The article author can delete their article and it no longer appears in the global feed.

**Preconditions:**
- Logged in as author
- At least one article exists authored by this user

**Steps:**
1. Navigate to the article detail page
2. Click **Delete Article**
3. Navigate to the global feed (`/#/`)

**Expected result:**
- After deletion, user is redirected away from the article page
- The deleted article title does not appear in the global feed

**API calls involved:**
- `DELETE /api/articles/:slug` — deletes the article (204 No Content)
- `GET /api/articles?limit=10&offset=0` — feed reload to verify removal

**Priority:** P1

---

## ART-006 — Global feed: articles appear and pagination works

**Description:** The global feed displays published articles and the user can navigate to the next page.

**Preconditions:**
- At least 11 articles exist in total (to trigger pagination)
- User may be logged out or logged in

**Steps:**
1. Navigate to `/#/`
2. Click the **Global Feed** tab
3. Verify articles are listed
4. Click page **2** in the pagination bar

**Expected result:**
- First page shows up to 10 article previews
- Clicking page 2 loads the next set of articles (different from page 1)
- Each article preview shows title, description, author, and date

**API calls involved:**
- `GET /api/articles?limit=10&offset=0` — first page
- `GET /api/articles?limit=10&offset=10` — second page

**Priority:** P2

---

## ART-007 — Personal feed: only followed users' articles appear

**Description:** The "Your Feed" tab shows articles only from users that the current user follows, and shows an empty state when following nobody.

**Preconditions:**
- Logged in as User A
- User A follows User B (who has published at least one article)
- User A does not follow User C (who has also published)

**Steps:**
1. Navigate to `/#/`
2. Click the **Your Feed** tab

**Expected result:**
- Articles by User B appear in the feed
- Articles by User C do **not** appear
- If User A follows nobody, the feed shows an empty/placeholder message

**API calls involved:**
- `GET /api/articles/feed?limit=10&offset=0` — returns only articles from followed users

**Priority:** P2
