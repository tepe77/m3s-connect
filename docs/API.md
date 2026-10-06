# M3S Connect --- API Specification

**Document:** `docs/API.md`\
**Base URL:** `/api/v1`\
**Style:** REST JSON API\
**Status:** Authoritative API contract.

## 1. Global Rules

-   API version is mandatory: `/api/v1`.
-   JSON request/response.
-   Authentication uses Laravel Sanctum token/session strategy
    appropriate to deployment.
-   Frontend MUST NOT access PostgreSQL directly.
-   Controllers MUST remain thin.
-   Validation MUST use Form Requests.
-   Business logic belongs in Actions/Services.
-   Authorization MUST use Laravel Policies/Gates.
-   Responses MUST use API Resources.
-   IDs are UUIDs.
-   Dates are ISO-8601.
-   All user-generated content MUST be sanitized/validated.

## 2. Authentication

### Register

`POST /auth/register`

Request:

``` json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "StrongPassword123!",
  "password_confirmation": "StrongPassword123!"
}
```

Validation: - `name`: required, string, 2--100. - `email`: required,
valid email, unique. - `password`: required, confirmed, minimum 8,
strong password rules.

Response `201`:

``` json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "Budi Santoso",
      "email": "budi@example.com"
    }
  },
  "message": "Registration successful."
}
```

### Login

`POST /auth/login`

``` json
{
  "email": "budi@example.com",
  "password": "StrongPassword123!"
}
```

Response:

``` json
{
  "data": {
    "user": {},
    "token": "..."
  },
  "message": "Login successful."
}
```

### Logout

`POST /auth/logout`

Auth required.

### Current User

`GET /auth/me`

Auth required.

### Forgot Password

`POST /auth/forgot-password`

``` json
{
  "email": "budi@example.com"
}
```

### Reset Password

`POST /auth/reset-password`

``` json
{
  "token": "...",
  "email": "budi@example.com",
  "password": "NewStrongPassword123!",
  "password_confirmation": "NewStrongPassword123!"
}
```

### Verify Email

`POST /auth/verify-email`

Request contains verification token/code according to implementation.

## 3. Profile

### Get Own Profile

`GET /profile`

Auth required.

### Update Profile

`PATCH /profile`

``` json
{
  "graduation_year": 2018,
  "graduation_class": "IPA 2",
  "bio": "Software engineer...",
  "current_city": "Yogyakarta",
  "current_country": "Indonesia",
  "occupation": "Software Engineer",
  "company": "Example Corp",
  "visibility": "members"
}
```

Validation: - graduation year: integer. -
city/country/company/occupation: bounded strings. - visibility:
`public|members|private`.

### Avatar

`POST /profile/avatar`

Multipart upload.

Rules: - image only. - configurable max size. - validate MIME, extension
and dimensions. - never trust client filename.

### Education

`GET /profile/education`

`POST /profile/education`

`PATCH /profile/education/{id}`

`DELETE /profile/education/{id}`

Request:

``` json
{
  "institution": "Universitas Gadjah Mada",
  "degree": "S1",
  "field_of_study": "Informatika",
  "start_year": 2019,
  "end_year": 2023,
  "description": "..."
}
```

### Experience

`GET /profile/experience`

`POST /profile/experience`

`PATCH /profile/experience/{id}`

`DELETE /profile/experience/{id}`

Request:

``` json
{
  "company": "Example Corp",
  "position": "DevOps Engineer",
  "location": "Yogyakarta",
  "start_date": "2024-01-01",
  "end_date": null,
  "is_current": true,
  "description": "..."
}
```

### Social Links

`GET /profile/social-links`

`POST /profile/social-links`

`PATCH /profile/social-links/{id}`

`DELETE /profile/social-links/{id}`

## 4. Alumni Directory

### List Alumni

`GET /alumni`

Query:

``` text
?page=1&per_page=24&search=andi&graduation_year=2018&city=Yogyakarta&occupation=Engineer
```

Filters: - `search` - `graduation_year` - `city` - `country` -
`occupation` - `company` - `page` - `per_page`

Public results MUST respect profile visibility.

Response:

``` json
{
  "data": [
    {
      "id": "uuid",
      "name": "Andi",
      "graduation_year": 2018,
      "occupation": "Engineer",
      "company": "Example",
      "current_city": "Yogyakarta",
      "avatar_url": "..."
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 24,
    "total": 120,
    "last_page": 5
  },
  "message": "Success."
}
```

### Alumni Detail

`GET /alumni/{username}`

### Alumni Stories

`GET /alumni/{username}/stories`

### Alumni Experience

`GET /alumni/{username}/experiences`

## 5. Forum

### Categories

`GET /forum/categories`

### Threads

`GET /forum/threads`

Query:

``` text
?page=1&per_page=20&category=general&sort=latest&search=kegiatan
```

Allowed sort: - `latest` - `popular` - `most_replied`

### Create Thread

`POST /forum/threads`

Auth required.

``` json
{
  "category_id": "uuid",
  "title": "Reuni angkatan 2018",
  "body": "Apakah ada yang..."
}
```

Validation: - category exists and active. - title required, 10--200
chars. - body required. - authenticated Alumni or above.

### Thread Detail

`GET /forum/threads/{id}`

### Update Thread

`PATCH /forum/threads/{id}`

Owner or authorized moderator/admin.

### Delete Thread

`DELETE /forum/threads/{id}`

Owner within allowed rules or moderator/admin.

### Reply

`POST /forum/threads/{id}/posts`

``` json
{
  "body": "Saya tertarik ikut.",
  "parent_id": null
}
```

`parent_id` is optional and MUST belong to the same thread.

### Update/Delete Post

`PATCH /forum/posts/{id}`

`DELETE /forum/posts/{id}`

### Like Post

`POST /forum/posts/{id}/like`

### Unlike Post

`DELETE /forum/posts/{id}/like`

### Bookmark Thread

`POST /forum/threads/{id}/bookmark`

### Remove Bookmark

`DELETE /forum/threads/{id}/bookmark`

### Report

`POST /forum/reports`

``` json
{
  "reportable_type": "forum_post",
  "reportable_id": "uuid",
  "reason": "spam",
  "description": "..."
}
```

Allowed reasons should be an application enum.

## 6. News

`GET /news`

Query: - `page` - `per_page` - `category` - `search`

`GET /news/{slug}`

`GET /news/categories`

Public users can read only published news.

## 7. Events

`GET /events`

Filters: - `status` - `category` - `from` - `to` - `search` - pagination

`GET /events/{slug}`

### RSVP

`POST /events/{id}/rsvp`

`DELETE /events/{id}/rsvp`

Response:

``` json
{
  "data": {
    "event_id": "uuid",
    "user_id": "uuid",
    "status": "registered"
  },
  "message": "RSVP successful."
}
```

Rules: - authenticated user. - registration window must be open. - event
must be published. - max participants must not be exceeded. - duplicate
RSVP prohibited.

### Participants

`GET /events/{id}/participants`

Authorization required according to event privacy/admin policy.

## 8. Stories

`GET /stories`

`GET /stories/{slug}`

### Create

`POST /stories`

Auth required.

``` json
{
  "title": "Perjalanan Saya Setelah Lulus",
  "excerpt": "Cerita singkat...",
  "content": "..."
}
```

New member stories enter `pending_review`.

### Update/Delete

`PATCH /stories/{id}`

`DELETE /stories/{id}`

Owner or moderator/admin.

## 9. Testimonials

`GET /testimonials`

`POST /testimonials`

Auth required.

``` json
{
  "content": "M3S Connect membantu saya...",
  "position": "Software Engineer",
  "company": "Example Corp"
}
```

Testimonials require approval before publication.

## 10. Albums / Media

`GET /albums`

`GET /albums/{slug}`

`POST /media`

`DELETE /media/{id}`

Uploads MUST use multipart/form-data.

## 11. Notifications

`GET /notifications`

`POST /notifications/{id}/read`

`POST /notifications/read-all`

## 12. Pagination Contract

Default: - `per_page=20` - maximum `per_page=100`.

Response:

``` json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 20,
    "to": 20,
    "total": 100
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  }
}
```

API MUST never allow arbitrary unbounded collection queries.

## 13. Error Contract

### Validation --- `422`

``` json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ]
  }
}
```

### Unauthenticated --- `401`

``` json
{
  "message": "Unauthenticated."
}
```

### Forbidden --- `403`

``` json
{
  "message": "You are not authorized to perform this action."
}
```

### Not Found --- `404`

``` json
{
  "message": "Resource not found."
}
```

### Conflict --- `409`

Use for business conflicts such as duplicate RSVP or full event.

``` json
{
  "message": "This event is already full."
}
```

### Rate Limited --- `429`

``` json
{
  "message": "Too many requests. Please try again later."
}
```

### Server Error --- `500`

Never expose stack traces, SQL errors, secrets, or internal
infrastructure details.

## 14. API Security

-   Rate limit login, registration, password reset, posting, reporting,
    and uploads.
-   Authorization is server-side.
-   Validate ownership before mutation.
-   Sanitize rich text.
-   Prevent mass assignment with `$fillable`/DTO strategy.
-   Do not return password/token hashes.
-   Avoid exposing private profile fields.
-   Log security-relevant actions.
-   Use HTTPS only in production.

## 15. API Implementation Pattern

``` text
Route
  -> Middleware
  -> FormRequest
  -> Controller
  -> Policy
  -> Action/Service
  -> Model
  -> API Resource
  -> JSON
```

Controllers MUST NOT contain large business workflows.

## 16. API Compatibility

Breaking API changes require a new API version.

Non-breaking: - adding optional response fields. - adding optional query
filters.

Breaking: - changing field type. - removing fields. - changing endpoint
semantics. - changing required request fields.
