# M3S Connect --- RBAC & Authorization Specification

**Document:** `docs/RBAC.md`\
**Status:** Authoritative authorization contract.

## 1. Roles

M3S Connect has four application roles:

1.  Guest
2.  Alumni
3.  Moderator
4.  Admin

Roles are hierarchical for convenience:

``` text
Guest
  ↓
Alumni
  ↓
Moderator
  ↓
Admin
```

However, Laravel Policies MUST still check the actual ability. Role
hierarchy MUST NOT be used as a replacement for resource ownership
checks.

## 2. Guest

Guest can:

-   view public homepage.
-   view public alumni profiles.
-   browse published news.
-   browse published stories.
-   browse published events.
-   browse public gallery/archive.
-   view public forum categories and published threads/posts.

Guest cannot:

-   create content.
-   reply.
-   like.
-   bookmark.
-   RSVP.
-   report.
-   edit profiles.
-   access member dashboard.
-   access moderation/admin features.

## 3. Alumni

Alumni can:

-   manage own profile.
-   manage own education.
-   manage own experience.
-   manage own social links.
-   create forum threads.
-   edit/delete own threads within policy rules.
-   reply to threads.
-   edit/delete own posts within policy rules.
-   like content.
-   bookmark threads.
-   report inappropriate content.
-   RSVP to events.
-   submit stories.
-   submit testimonials.
-   manage own drafts/submissions.
-   receive notifications.
-   access member dashboard.

Alumni cannot:

-   moderate other users' content.
-   publish official news.
-   approve stories/testimonials.
-   manage users.
-   manage roles.
-   access audit logs.

## 4. Moderator

Moderator inherits Alumni abilities and additionally:

### Forum

-   hide inappropriate threads.
-   hide inappropriate posts.
-   lock threads.
-   unlock threads.
-   pin/unpin threads.
-   review reports.
-   resolve/reject reports.
-   remove spam.
-   suspend forum participation when authorized.

### Content

-   review submitted stories.
-   approve/reject stories.
-   review testimonials.
-   approve/reject testimonials.

Moderator MUST NOT:

-   change system settings.
-   manage admin accounts.
-   change application roles unless explicitly delegated.
-   delete audit logs.

## 5. Admin

Admin has full platform management:

-   users.
-   alumni profiles.
-   roles/permissions.
-   forum categories.
-   forum moderation.
-   news.
-   events.
-   stories.
-   testimonials.
-   albums.
-   media.
-   reports.
-   notifications.
-   application settings.
-   audit logs.

Admin actions MUST still be audited where the action changes data or
access control.

## 6. Permission Matrix

  Permission                    Guest     Alumni                Moderator   Admin
  --------------------------- ------- ---------- ------------------------ -------
  View public content               ✓          ✓                        ✓       ✓
  View member-only profiles       ---          ✓                        ✓       ✓
  Manage own profile              ---          ✓                        ✓       ✓
  Manage own education            ---          ✓                        ✓       ✓
  Manage own experience           ---          ✓                        ✓       ✓
  Browse forum                      ✓          ✓                        ✓       ✓
  Create thread                   ---          ✓                        ✓       ✓
  Reply                           ---          ✓                        ✓       ✓
  Like                            ---          ✓                        ✓       ✓
  Bookmark                        ---          ✓                        ✓       ✓
  Report                          ---          ✓                        ✓       ✓
  Moderate forum                  ---        ---                        ✓       ✓
  Manage forum categories         ---        ---                      ---       ✓
  Create story                    ---          ✓                        ✓       ✓
  Approve story                   ---        ---                        ✓       ✓
  Create testimonial              ---          ✓                        ✓       ✓
  Approve testimonial             ---        ---                        ✓       ✓
  Create official news            ---        ---                      ---       ✓
  Manage events                   ---        ---   Moderator as delegated       ✓
  RSVP event                      ---          ✓                        ✓       ✓
  Manage albums/media             ---   own only                delegated       ✓
  Manage users                    ---        ---                      ---       ✓
  Manage roles                    ---        ---                      ---       ✓
  View audit logs                 ---        ---                      ---       ✓
  Manage settings                 ---        ---                      ---       ✓

## 7. Laravel Authorization

Use:

``` text
app/
├── Policies/
│   ├── AlumniProfilePolicy.php
│   ├── ForumThreadPolicy.php
│   ├── ForumPostPolicy.php
│   ├── StoryPolicy.php
│   ├── TestimonialPolicy.php
│   ├── EventPolicy.php
│   ├── MediaPolicy.php
│   └── ReportPolicy.php
```

## 8. Policy Rules

### Profile

A user may update a profile only when:

``` php
$user->id === $profile->user_id
```

Admin may update any profile.

Moderator should not automatically gain permission to edit arbitrary
personal profile data.

### Forum Thread

User can update/delete own thread if: - authenticated. - owns thread. -
thread is not locked. - content is within moderation policy.

Moderator/Admin may moderate any thread.

### Forum Post

User can edit/delete own post according to edit window/application
rules.

Moderator/Admin may hide/delete inappropriate posts.

### Story

Author: - create. - edit own draft. - withdraw own pending submission.

Moderator/Admin: - review. - approve. - reject. - publish where
authorized.

Published story ownership does not grant permission to bypass moderation
state.

### Event

Alumni: - view published event. - RSVP.

Admin: - create/update/publish/cancel event.

Moderator event-management permission should only be granted if the
business explicitly delegates it.

### Report

Any authenticated Alumni can create reports.

Moderator/Admin: - view pending reports. - change report status. -
resolve/reject. - perform moderation action.

Reporter cannot resolve own report.

## 9. Ownership vs Role

Authorization MUST use both:

``` text
Ability + Ownership + Resource State
```

Example:

``` php
public function update(User $user, ForumThread $thread): bool
{
    if ($user->isAdmin() || $user->isModerator()) {
        return true;
    }

    return $thread->user_id === $user->id
        && !$thread->is_locked
        && $thread->status === 'published';
}
```

Do not implement:

``` php
return $user->role === 'admin';
```

for every policy. Resource ownership and state matter.

## 10. Authentication State

Unauthenticated users are Guests.

Authenticated users must have: - active account. - verified email where
required. - non-suspended status.

Suspended users: - may have limited read access. - cannot create forum
content. - cannot RSVP or submit content if the suspension policy blocks
community actions.

## 11. Moderator Safety

Moderator actions are privileged actions.

The application MUST: - audit moderation decisions. - record actor. -
record target. - record timestamp. - record previous/new state where
applicable.

## 12. Admin Safety

Admin MUST NOT bypass: - database constraints. - validation. - audit
logging. - security middleware.

"Admin" means authorized, not unrestricted raw database access.

## 13. Filament Authorization

Filament Resources MUST respect the same authorization model.

Do not implement a separate authorization system for Filament.

Use: - Laravel Policies. - Gates for global abilities. - role/permission
package only if justified.

The API and Filament MUST produce equivalent authorization decisions for
the same resource.

## 14. Permission Naming Convention

If granular permissions are introduced, use:

``` text
resource.action
```

Examples:

``` text
forum.thread.create
forum.thread.update-own
forum.thread.moderate
forum.report.review
story.create
story.review
story.publish
event.manage
user.manage
role.manage
audit-log.view
```

Avoid vague permissions such as:

``` text
manage_everything
full_access
```

## 15. Authorization Tests

Every policy MUST have tests for:

-   guest denied.
-   owner allowed.
-   non-owner denied.
-   moderator allowed where applicable.
-   admin allowed.
-   locked/archived state behavior.
-   suspended user behavior.

Authorization tests are mandatory for P0/P1 features.
