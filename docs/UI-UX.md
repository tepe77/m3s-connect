# M3S Connect --- UI/UX Specification

**Document:** `docs/UI-UX.md`\
**Frontend:** Next.js 16 + React + TypeScript + Tailwind CSS\
**Status:** Authoritative frontend UX/design contract.

## 1. Product Experience

M3S Connect MUST feel:

-   community-driven.
-   editorial.
-   modern.
-   warm.
-   trustworthy.
-   lightweight.
-   content-first.

It MUST NOT look like: - an enterprise admin dashboard. - a generic SaaS
template. - an AI-generated landing page. - a card-heavy dashboard
everywhere.

Filament is the admin interface. The public/member Next.js application
should have its own community-oriented experience.

## 2. Design Principles

1.  Content before decoration.
2.  Clear hierarchy.
3.  Generous whitespace.
4.  Strong typography.
5.  Consistent spacing.
6.  Minimal unnecessary borders.
7.  Use cards only when grouping content benefits comprehension.
8.  Avoid excessive gradients.
9.  Avoid excessive animations.
10. Every interaction needs visible feedback.
11. Mobile is a first-class layout, not a shrunk desktop.
12. Accessibility is mandatory.

## 3. Visual System

### Colors

``` text
Primary:       #2BA8A2
Background:    #F8FAFC
Text:          #0F172A
Muted Text:    #64748B
Border:        #E2E8F0
Surface:       #FFFFFF
```

Semantic colors may be added:

``` text
Success
Warning
Danger
Info
```

Semantic colors MUST be used consistently and MUST NOT replace the core
visual identity.

## 4. Typography

Preferred:

-   Inter
-   Geist

Typography hierarchy:

``` text
Display
H1
H2
H3
Body
Small
Caption
```

Rules: - H1 should communicate page purpose immediately. - Body text
should remain highly readable. - Avoid excessive uppercase. - Use font
weight to create hierarchy, not many colors.

## 5. Spacing

Use Tailwind spacing tokens consistently.

Preferred rhythm:

``` text
4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px / 96px
```

Do not introduce arbitrary spacing values unless required by visual
design.

## 6. Layout

Desktop:

``` text
Header
  ↓
Main container
  ↓
Content / sidebar where appropriate
  ↓
Footer
```

Maximum content width should generally be around:

``` text
1200–1280px
```

Long-form reading content should use a narrower measure.

## 7. Navigation

Desktop navigation:

``` text
Home
Alumni
Forum
Stories
Events
News
Archive
```

Secondary actions:

``` text
Search
Login / Profile
```

Authenticated users additionally have:

``` text
Dashboard
Profile
Notifications
Settings
Logout
```

Mobile bottom navigation:

``` text
Home | Forum | Alumni | Events | Profile
```

Secondary content remains accessible through menus.

## 8. Homepage

Route:

`/`

Sections:

1.  Hero
2.  Community introduction
3.  Latest news
4.  Alumni stories
5.  Latest discussions
6.  Upcoming events
7.  Community statistics
8.  Join CTA
9.  Footer

Hero copy:

``` text
CONNECT. SHARE. GROW. REMEMBER.

One community. Thousands of journeys.
```

Primary CTA: - Explore Alumni

Secondary CTA: - Join Community

## 9. Alumni Directory

Route:

`/alumni`

Features: - search. - graduation year filter. - profession filter. -
city filter. - pagination. - empty state.

Desktop: - filters in top/side area. - responsive grid.

Mobile: - search at top. - filters in sheet/drawer.

Alumni card:

``` text
Avatar
Name
Graduation year
Occupation
Company
City
```

Do not expose private fields.

## 10. Alumni Profile

Route:

`/alumni/[username]`

Sections:

``` text
Profile header
About
Experience
Education
Skills
Social links
Stories
```

Profile visibility MUST be enforced by API.

Member's own profile:

`/profile`

Provides editing controls.

## 11. Forum

Routes:

``` text
/forum
/forum/[slug]
/forum/new
```

Forum landing: - categories. - search. - latest. - popular. - pinned.

Thread card: - title. - author. - graduation year where visible. -
timestamp. - reply count. - view count. - latest activity.

Thread detail: - title. - category. - author. - content. - replies. -
like. - bookmark. - report. - reply form.

Locked thread: - clearly display locked state. - hide reply form.

## 12. Forum Composer

Create thread:

``` text
Category
Title
Body
Optional media
Preview
Submit
```

Rules: - prevent accidental duplicate submission. - show validation
inline. - preserve draft on recoverable failure where practical.

## 13. Stories

Routes:

``` text
/stories
/stories/[slug]
```

Visual direction: - editorial. - large cover imagery. - readable
long-form content. - author identity. - graduation year. - related
stories.

Avoid dashboard-style card grids for the article detail.

## 14. Events

Routes:

``` text
/events
/events/[slug]
```

Event card: - date. - title. - location. - registration status. -
participant count where allowed.

Detail: - cover. - description. - date/time. - location. - organizer. -
RSVP CTA.

RSVP states: - Available - Registered - Full - Registration Closed -
Event Cancelled - Event Completed

## 15. News

Routes:

``` text
/news
/news/[slug]
```

News landing: - featured article. - latest articles. - category filter.

Article: - title. - publication date. - author. - cover. - content. -
related articles.

## 16. Archive / Documentation

Routes:

``` text
/archive
/archive/[slug]
```

Archive should feel historical and documentary.

Use: - albums. - event documentation. - photo grids. - timeline where
useful.

Do not overload the archive with unnecessary UI.

## 17. Authentication

Routes:

``` text
/login
/register
/forgot-password
/reset-password
/verify-email
```

Authentication UI should be: - focused. - minimal. - clear. -
accessible.

Registration should communicate the community purpose rather than
looking like a generic SaaS signup.

## 18. Member Dashboard

Route:

`/dashboard`

Dashboard content:

``` text
Greeting
Profile completion
Latest discussions
Upcoming events
Recommended alumni
Notifications
```

It should remain lightweight.

The dashboard is not an admin dashboard.

## 19. Settings

Route:

`/settings`

Sections:

``` text
Account
Privacy
Notifications
Security
```

Privacy settings MUST clearly explain who can see: - profile. - city. -
company. - social links. - contact information.

## 20. Search

Global search should eventually support:

``` text
Alumni
Forum
News
Stories
Events
```

MVP can use PostgreSQL search.

Do not introduce Elasticsearch/OpenSearch unless scale or search
requirements justify it.

Search UX: - clear query. - result type. - result count. - highlighted
context where appropriate. - empty state. - loading state.

## 21. Responsive Behavior

Breakpoints should follow Tailwind defaults unless design requires
otherwise.

### Mobile

-   single-column layouts.
-   bottom navigation.
-   collapsible filters.
-   touch-friendly controls.
-   readable typography.
-   no horizontal scrolling.

### Tablet

-   two-column layouts where useful.
-   sidebar may become collapsible.

### Desktop

-   multi-column layouts where content benefits.
-   persistent navigation.
-   richer filtering.

## 22. Component Architecture

``` text
components/
├── ui/
├── layout/
├── alumni/
├── forum/
├── news/
├── events/
└── stories/
```

Feature-specific business UI belongs in:

``` text
features/<feature>/components/
```

Examples:

``` text
features/forum/components/
├── ThreadCard.tsx
├── ThreadList.tsx
├── ThreadDetail.tsx
├── PostItem.tsx
├── CreateThreadForm.tsx
└── ReplyForm.tsx
```

## 23. Component Rules

Every reusable component MUST have: - clear props. - TypeScript types. -
accessible semantics. - loading behavior where applicable. - error
behavior where applicable. - responsive behavior where applicable.

Avoid: - giant components. - business logic hidden inside presentation
components. - duplicated API calls. - duplicated validation rules.

## 24. Server vs Client Components

Default to React Server Components.

Use `"use client"` only when required for: - interaction. - browser
APIs. - local state. - client-side query/mutation. - event handlers.

Do not turn entire route trees into Client Components without
justification.

## 25. Data Fetching

Use: - Server Components for initial server-rendered data where
appropriate. - TanStack Query for interactive client-side server
state. - typed API clients. - Zod for client-side validation where
useful.

API logic MUST NOT be scattered across UI components.

## 26. UI States

Every data-driven page MUST define:

1.  Loading
2.  Success
3.  Empty
4.  Error
5.  Unauthorized
6.  Forbidden where applicable

Example:

``` text
Loading:
  Skeleton

Empty:
  Explanation + CTA

Error:
  Human-readable message + Retry

Unauthorized:
  Login CTA

Forbidden:
  Permission explanation
```

Never leave blank screens.

## 27. Forms

Rules: - labels always visible. - validation near the relevant field. -
submit state visible. - prevent duplicate submission. - preserve valid
input on failed submission. - accessible error messages. - keyboard
accessible.

## 28. Toasts and Notifications

Use toast for: - successful mutations. - recoverable failures. - short
feedback.

Do not use toast for: - critical destructive confirmation. - information
that must remain visible.

Destructive actions require confirmation when irreversible or
high-impact.

## 29. Modals / Dialogs

Use dialogs sparingly.

Good use: - confirmation. - quick action. - focused form.

Avoid using dialogs for: - long articles. - complex profile pages. -
primary navigation.

## 30. Accessibility

MUST: - semantic HTML. - keyboard navigation. - visible focus states. -
accessible labels. - sufficient contrast. - alt text for meaningful
images. - decorative images marked appropriately. - buttons must be
actual buttons. - links must be actual links. - form errors associated
with inputs.

Target WCAG 2.1 AA practices.

## 31. Images

Use Next.js image optimization.

Rules: - explicit dimensions/aspect ratio. - responsive image sizes. -
meaningful alt text. - lazy load below-the-fold imagery. - use
appropriate crop ratios. - avoid layout shift.

Suggested aspect ratios: - avatar: `1:1` - story/news cover: `16:9` -
event cover: `16:9` - gallery: adaptive.

## 32. Motion

Animation should communicate state, not decorate everything.

Use: - subtle hover. - page transitions where appropriate. - skeleton
shimmer only when useful. - expandable content transitions.

Avoid: - constant floating animations. - excessive parallax. -
decorative particle systems. - motion that hurts accessibility.

Respect reduced-motion preferences.

## 33. Error Handling

API errors should be translated into user-friendly messages.

Never display: - SQL errors. - stack traces. - internal server paths. -
tokens. - infrastructure details.

## 34. Design Tokens

Prefer centralized tokens for: - colors. - spacing. - radius. -
shadows. - typography. - breakpoints.

Tailwind utility classes are preferred over large CSS files.

## 35. Border Radius

Use restrained rounding.

Suggested: - buttons: medium. - inputs: medium. - cards: medium. -
avatars: circular.

Avoid excessive "pill" UI unless it represents tags/status.

## 36. Cards

Cards should represent meaningful content boundaries.

Good: - alumni profile. - event. - news item. - story preview.

Avoid: - wrapping every section in a card. - nested cards. - card inside
card inside card.

## 37. Status Components

Use consistent status badges for:

``` text
Published
Draft
Pending
Rejected
Cancelled
Completed
Locked
Registered
Full
```

Status must not rely on color alone.

## 38. Mobile Navigation

Primary actions should be reachable with one hand.

Bottom navigation:

``` text
Home
Forum
Alumni
Events
Profile
```

Profile menu contains secondary destinations.

## 39. Page-Level Route Map

``` text
/
├── /alumni
│   └── /alumni/[username]
├── /forum
│   ├── /forum/[slug]
│   └── /forum/new
├── /stories
│   └── /stories/[slug]
├── /events
│   └── /events/[slug]
├── /news
│   └── /news/[slug]
├── /archive
│   └── /archive/[slug]
│
├── /login
├── /register
├── /forgot-password
├── /reset-password
├── /verify-email
│
├── /dashboard
├── /profile
└── /settings
```

## 40. Definition of Done --- UI

A frontend feature is complete only when:

-   desktop layout implemented.
-   mobile layout implemented.
-   loading state implemented.
-   empty state implemented.
-   error state implemented.
-   authorization state handled.
-   API errors handled.
-   responsive behavior tested.
-   keyboard navigation tested.
-   accessibility labels checked.
-   image optimization applied.
-   no unnecessary client component usage.
-   TypeScript has no errors.
-   lint/build passes.

## 41. Frontend Quality Rules

MUST NOT: - hardcode API secrets. - access database directly. -
duplicate backend authorization logic as security. - trust client-side
permissions. - expose private profile fields. - use arbitrary UI
libraries without justification. - introduce a second styling system
unnecessarily.

SHOULD: - reuse components. - reuse design tokens. - keep route
components small. - colocate feature logic. - use typed API responses. -
keep visual hierarchy consistent.

## 42. Future Scalability

The UI architecture MUST allow future additions:

-   career/job board.
-   business directory.
-   mentorship.
-   alumni networking.
-   alumni map.
-   donation/scholarship.
-   marketplace.
-   mobile application.

Do not design MVP pages around assumptions that prevent these modules
later.
