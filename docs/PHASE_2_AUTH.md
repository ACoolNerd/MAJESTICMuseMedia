# Phase 2 — Firebase Authentication and Role-Based Access

## Status

Phase 2 has started on `phase-2/firebase-auth-rbac`.

The first implementation slice adds:

- Firebase email/password authentication boundary
- Custom-claim role resolution
- Explicit application permissions
- Protected private routes
- Permission-filtered navigation
- Signed-in identity and role display
- Sign-out behavior
- Executive-only access-control workspace
- Local demo mode behind an explicit environment flag
- Deny-by-default Firestore rules
- Governance-sensitive permission tests

## Authority model

| Role | Core authority |
|---|---|
| CEO / Executive Producer | Final brand, editorial and release authority |
| COO / Technology & AI Operations | Users, systems, integrations and operating workflows without a final editorial override |
| Head of Post-Production | Media, review, CapCut handoff and technical approvals |
| Social & Distribution Manager | Distribution, community, YouTube and lead workflows |
| Production Crew | Assigned episode, task and media operations only |
| Guest / Partner / Public | No private control-center access in this implementation slice |

The `editorial.final` permission belongs only to the CEO role.

## Required Firebase setup

1. Create or select the Firebase project for MAJESTICMuseMedia.ai.
2. Enable Firebase Authentication.
3. Enable the approved sign-in providers.
4. Populate the `VITE_FIREBASE_*` variables in the local environment.
5. Create staff users.
6. Assign one supported custom claim to each staff account:

```json
{ "role": "ceo" }
```

Supported roles:

```text
ceo
coo
post
social
crew
guest
partner
public
```

Custom claims must be assigned through a trusted server environment using the Firebase Admin SDK. They must never be accepted from a browser form.

## Demo-auth safety

Local demo authentication is disabled by default.

To enable it temporarily for local interface review:

```text
VITE_ENABLE_DEMO_AUTH=true
```

Keep this value `false` in staging and production. Demo mode is also blocked whenever a complete Firebase client configuration is present.

## Firestore rules

The Phase 2 rules:

- Read role authority from Firebase custom claims
- Allow users to read their own profile
- Limit self-profile edits to display fields
- Separate executive, content-operator and crew capabilities
- Protect guest documents by ownership
- Make audit records append-only
- Restrict platform connections to the COO
- Deny unmatched collections by default

Deploy only after testing the rules with the Firebase Emulator Suite.

## Remaining Phase 2 work

- Trusted Admin SDK function for assigning and removing role claims
- User-management persistence
- Invitation flow
- Password reset and email verification
- Session-revocation workflow
- Audit events for role changes and sign-in security events
- Firestore emulator tests
- Guest and partner portal isolation
- Multi-factor authentication policy decision
- Production Firebase project and secret configuration
