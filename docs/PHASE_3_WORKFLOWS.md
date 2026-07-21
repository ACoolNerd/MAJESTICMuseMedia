# Phase 3 — Persistent operating workflows

This slice moves MAJESTIC Muse Media beyond static seed-only screens.

## Included

- Firestore-backed repository interface for episodes, guests and public form submissions
- Browser-local demo repository when Firebase is not configured
- Source-grounded episode and guest seed records
- Ten-stage episode command center
- Status confirmation authority rules
- Five release-gate readiness calculation
- 34-asset matrix integrity warning
- Guest biography, headshot and release tracking
- Validated public intake forms for guests, stories, suggestions, services, partners and newsletter interest
- Deny-by-default Firestore rules
- Server-only audit-log rule boundary

## Persistence behavior

When Firebase is configured, authorized internal records use Firestore. Public form submissions write only to `formSubmissions` and cannot read other submissions.

When Firebase is not configured, the application uses browser local storage for development demonstrations. Local demo storage is not a production database and must never contain real guest documents, releases, private media or credentials.

## Workflow safeguards

- Proposed and TBD records require executive authority before becoming Confirmed.
- Stages advance one step at a time.
- Pre-production requires a date, location and confirmed guests.
- Production requires signed releases or a documented waiver.
- Release requires a date, all five gates and at least one approved asset.
- Asset targets are calculated; a target other than 34 produces an integrity warning rather than silently changing source data.

## Audit logging

Client writes to `auditLogs` are denied. A later server-runtime phase must write immutable audit events through the Firebase Admin SDK after validating the authenticated actor and requested mutation.

## Remaining Phase 3 work

- Trusted server mutation endpoints with audit events
- Tasks, approvals and rights UI persistence
- Full field sets and secure file uploads for guest preparation
- Calendar views and recurring production cadence
- RASCI change history
- Firebase Emulator security-rule tests
- Anti-spam and rate limiting for public forms
