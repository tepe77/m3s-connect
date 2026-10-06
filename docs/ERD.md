# M3S Connect --- ERD & Database Specification

**Document:** `docs/ERD.md`\
**Purpose:** Database contract for M3S Connect.\
**Status:** Authoritative technical specification.

## 1. Database Rules

-   Database engine: PostgreSQL.
-   Primary keys: UUID.
-   Timestamps: `created_at`, `updated_at`.
-   Use soft deletes only where explicitly specified.
-   Foreign keys MUST be enforced at database level.
-   Slugs MUST be unique within their resource.
-   Email MUST be unique.
-   Use relational tables for structured data; do not use JSON for
    fields that require filtering, joining, indexing, or reporting.
-   Every FK MUST have an appropriate index unless covered by a
    composite index.
-   Business authorization is enforced in Laravel Policies; database
    constraints enforce integrity.
-   All migrations MUST be reversible where practical.

## 2. Conventions

  Convention    Rule
  ------------- -----------------------------------------
  PK            `uuid`
  FK            `<singular>_id`
  Boolean       `is_*`
  Counters      `*_count`
  Dates         `*_at` for timestamps
  Soft delete   `deleted_at`
  Slug          lowercase URL-safe unique string
  Status        backed PHP enum + DB-compatible value
  Visibility    explicit enum, never inferred from null

## 3. Mermaid ERD

``` mermaid
erDiagram
    USERS ||--o| ALUMNI_PROFILES : owns
    ALUMNI_PROFILES ||--o{ ALUMNI_EDUCATIONS : has
    ALUMNI_PROFILES ||--o{ ALUMNI_EXPERIENCES : has
    ALUMNI_PROFILES ||--o{ ALUMNI_SKILLS : has
    SKILLS ||--o{ ALUMNI_SKILLS : assigned
    ALUMNI_PROFILES ||--o{ ALUMNI_SOCIAL_LINKS : has

    FORUM_CATEGORIES ||--o{ FORUM_THREADS : contains
    USERS ||--o{ FORUM_THREADS : creates
    FORUM_THREADS ||--o{ FORUM_POSTS : contains
    USERS ||--o{ FORUM_POSTS : writes
    FORUM_POSTS ||--o{ FORUM_POSTS : replies_to
    USERS ||--o{ FORUM_LIKES : creates
    FORUM_THREADS ||--o{ FORUM_LIKES : receives
    FORUM_POSTS ||--o{ FORUM_LIKES : receives
    USERS ||--o{ BOOKMARKS : creates
    FORUM_THREADS ||--o{ BOOKMARKS : bookmarked
    USERS ||--o{ REPORTS : submits

    NEWS_CATEGORIES ||--o{ NEWS : categorizes
    USERS ||--o{ NEWS : authors

    EVENT_CATEGORIES ||--o{ EVENTS : categorizes
    USERS ||--o{ EVENTS : creates
    EVENTS ||--o{ EVENT_RSVPS : receives
    USERS ||--o{ EVENT_RSVPS : registers

    USERS ||--o{ STORIES : authors
    USERS ||--o{ TESTIMONIALS : submits

    EVENTS o|--o{ ALBUMS : documents
    ALBUMS ||--o{ MEDIA : contains
    USERS ||--o{ MEDIA : uploads

    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ AUDIT_LOGS : performs

    USERS {
        uuid id PK
        string name
        string email UK
        string password
        timestamp email_verified_at
        string status
        string avatar
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    ALUMNI_PROFILES {
        uuid id PK
        uuid user_id FK,UK
        smallint graduation_year
        string graduation_class
        string alumni_identifier UK
        string gender
        date birth_date
        text bio
        string current_city
        string current_country
        string occupation
        string company
        string visibility
        timestamp verified_at
        timestamp created_at
        timestamp updated_at
    }

    ALUMNI_EDUCATIONS {
        uuid id PK
        uuid alumni_profile_id FK
        string institution
        string degree
        string field_of_study
        smallint start_year
        smallint end_year
        text description
        timestamp created_at
        timestamp updated_at
    }

    ALUMNI_EXPERIENCES {
        uuid id PK
        uuid alumni_profile_id FK
        string company
        string position
        string location
        date start_date
        date end_date
        boolean is_current
        text description
        timestamp created_at
        timestamp updated_at
    }

    SKILLS {
        uuid id PK
        string name UK
        string slug UK
        timestamp created_at
        timestamp updated_at
    }

    ALUMNI_SKILLS {
        uuid alumni_profile_id FK
        uuid skill_id FK
        timestamp created_at
    }

    ALUMNI_SOCIAL_LINKS {
        uuid id PK
        uuid alumni_profile_id FK
        string platform
        string url
        timestamp created_at
        timestamp updated_at
    }

    FORUM_CATEGORIES {
        uuid id PK
        string name UK
        string slug UK
        text description
        string icon
        integer sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    FORUM_THREADS {
        uuid id PK
        uuid category_id FK
        uuid user_id FK
        string title
        string slug UK
        text body
        string status
        boolean is_pinned
        boolean is_locked
        integer views_count
        timestamp last_post_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    FORUM_POSTS {
        uuid id PK
        uuid thread_id FK
        uuid user_id FK
        uuid parent_id FK
        text body
        string status
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    FORUM_LIKES {
        uuid id PK
        uuid user_id FK
        uuid thread_id FK
        uuid post_id FK
        timestamp created_at
    }

    BOOKMARKS {
        uuid id PK
        uuid user_id FK
        uuid thread_id FK
        timestamp created_at
    }

    REPORTS {
        uuid id PK
        uuid user_id FK
        string reportable_type
        uuid reportable_id
        string reason
        text description
        string status
        uuid resolved_by FK
        timestamp resolved_at
        timestamp created_at
        timestamp updated_at
    }

    NEWS_CATEGORIES {
        uuid id PK
        string name UK
        string slug UK
        text description
        timestamp created_at
        timestamp updated_at
    }

    NEWS {
        uuid id PK
        uuid category_id FK
        uuid author_id FK
        string title
        string slug UK
        text excerpt
        text content
        string cover_image
        string status
        timestamp published_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    EVENT_CATEGORIES {
        uuid id PK
        string name UK
        string slug UK
        text description
        timestamp created_at
        timestamp updated_at
    }

    EVENTS {
        uuid id PK
        uuid category_id FK
        uuid created_by FK
        string title
        string slug UK
        text description
        string cover_image
        string location
        timestamp start_at
        timestamp end_at
        timestamp registration_start_at
        timestamp registration_end_at
        integer max_participants
        string status
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    EVENT_RSVPS {
        uuid id PK
        uuid event_id FK
        uuid user_id FK
        string status
        timestamp registered_at
        timestamp cancelled_at
        timestamp created_at
        timestamp updated_at
    }

    STORIES {
        uuid id PK
        uuid user_id FK
        string title
        string slug UK
        text excerpt
        text content
        string cover_image
        string status
        timestamp published_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    TESTIMONIALS {
        uuid id PK
        uuid user_id FK
        text content
        string position
        string company
        string status
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }

    ALBUMS {
        uuid id PK
        uuid event_id FK
        string title
        string slug UK
        text description
        string cover_image
        timestamp published_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    MEDIA {
        uuid id PK
        uuid user_id FK
        string mediable_type
        uuid mediable_id
        string disk
        string path
        string filename
        string mime_type
        bigint size
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string type
        string title
        text body
        jsonb data
        timestamp read_at
        timestamp created_at
        timestamp updated_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string auditable_type
        uuid auditable_id
        jsonb old_values
        jsonb new_values
        string ip_address
        text user_agent
        timestamp created_at
    }
```

## 4. Table Specifications

### `users`

Core authentication identity.

-   `status`: `active`, `pending`, `suspended`, `inactive`.
-   `email` unique and normalized lowercase.
-   `deleted_at` enables account soft deletion.
-   Password is always hashed by Laravel.

Indexes: - unique `email` - `status` - `last_login_at`

### `alumni_profiles`

One-to-one extension of `users`.

Constraints: - `user_id` unique. - `graduation_year` should be within
configured school/alumni range. - `visibility`: `public`, `members`,
`private`. - `alumni_identifier` unique when present.

Indexes: - `graduation_year` - `current_city` - `occupation` -
`company` - composite `(graduation_year, current_city)`

### `alumni_educations`

One profile can have many education records.

Indexes: - `alumni_profile_id` - `(institution, start_year)`

### `alumni_experiences`

One profile can have many experience records.

Constraints: - `end_date >= start_date` when `end_date` exists. -
`is_current=true` implies `end_date IS NULL`.

Indexes: - `alumni_profile_id` - `company` - `position` - `is_current`

### `skills` / `alumni_skills`

Many-to-many relationship.

Constraints: - unique `(alumni_profile_id, skill_id)`.

### `alumni_social_links`

Indexes: - `alumni_profile_id` - `platform`

### Forum tables

`forum_threads.status`: `draft`, `published`, `hidden`, `archived`.

`forum_posts.status`: `published`, `hidden`, `deleted`.

Constraints: - thread belongs to one category and author. - post belongs
to one thread and author. - `parent_id` must reference another post in
the same thread. - likes must have exactly one target. - bookmarks
unique per `(user_id, thread_id)`.

Indexes: - threads `(category_id, status, last_post_at)` - threads
`(user_id, created_at)` - posts `(thread_id, created_at)` - posts
`(user_id, created_at)` - posts `(parent_id)` - likes
`(user_id, thread_id)` - likes `(user_id, post_id)` - bookmarks
`(user_id, thread_id)`

### `reports`

Polymorphic target: - `reportable_type` - `reportable_id`

`status`: `pending`, `reviewing`, `resolved`, `rejected`.

Indexes: - `(reportable_type, reportable_id)` - `(status, created_at)` -
`user_id`

### Content tables

`news.status`: `draft`, `published`, `archived`.

`stories.status`: `draft`, `pending_review`, `published`, `rejected`,
`archived`.

`testimonials.status`: `pending`, `approved`, `rejected`, `archived`.

Indexes: - unique `slug` - `(status, published_at)` - author/user FK

### Events

`events.status`: `draft`, `published`, `cancelled`, `completed`,
`archived`.

`event_rsvps.status`: `registered`, `cancelled`, `attended`, `no_show`.

Constraint: - unique `(event_id, user_id)`.

Indexes: - `(status, start_at)` -
`(registration_start_at, registration_end_at)` - `event_id` - `user_id`

### Media

Polymorphic relation: - `mediable_type` - `mediable_id`

Indexes: - `(mediable_type, mediable_id)` - `user_id`

The `metadata` JSONB field is allowed only for non-relational file
metadata such as dimensions, checksum, or processing metadata.

### Notifications

Indexes: - `(user_id, read_at, created_at)` - `(user_id, created_at)`

### Audit logs

Indexes: - `(auditable_type, auditable_id)` - `(user_id, created_at)` -
`(action, created_at)`

Audit logs are append-only.

## 5. Delete Behavior

Default policy:

-   User deletion: soft delete.
-   Alumni profile: cascade from user only if account is permanently
    removed.
-   Education/experience/social links: cascade from profile.
-   Forum category: restrict if threads exist; prefer deactivate.
-   Forum thread: soft delete; posts remain auditable.
-   Event: soft delete/restrict if registrations exist; prefer status
    change.
-   News/story/album: soft delete.
-   RSVP: retain for audit/history.
-   Reports: retain permanently.
-   Audit logs: never cascade-delete for ordinary user deletion.

## 6. Migration Requirements

Every feature migration MUST include:

1.  PK.
2.  FK constraints.
3.  Nullability.
4.  Appropriate defaults.
5.  Unique constraints.
6.  Indexes.
7.  Timestamps.
8.  Soft delete if specified.
9.  Factory where appropriate.
10. Seeder for baseline/reference data.
11. Migration test.
