# Phase 6 — Muse Intelligence, repurposing, analytics, CRM and deployment

This phase establishes the first source-grounded intelligence and growth layer for MAJESTICMuseMedia.ai.

## Included

- Prioritized source registry
- Deterministic Muse Intelligence engine
- Structured answers containing facts, recommendations, missing information, confidence and source citations
- Starter operational questions
- Coverage-aware analytics snapshots
- Lead and partnership CRM with consent, scoring, ownership and next actions
- Repurposing moments with timestamp, hook, platform, CTA, confidence and transcript-validation warnings
- Firestore and local-development repositories
- Role-aware security rules
- Muse grounding tests

## Source hierarchy

Muse must use the current project hierarchy in this order:

1. Production Control Center
2. Master Operating System Source
3. Master Operating System workbook
4. Operating System Walkthrough
5. Approved Executive Media
6. Approved episode transcripts and signed guest materials
7. Archived legacy material for historical context only

An active higher-priority source overrides conflicting archive material. Proposed and TBD records remain visibly unconfirmed.

## Gemini production architecture

The current application uses a deterministic local engine for safe development. A production Gemini service must run in the trusted server environment.

The service must:

1. Verify the Firebase identity and permission.
2. Retrieve only sources the user may access.
3. Build a bounded context package with source IDs and statuses.
4. Request structured JSON output using a supported JSON Schema or Zod schema.
5. Validate the returned structure and every semantic value.
6. Compare exact quotes against the approved transcript.
7. Preserve source IDs, confidence and missing-information fields.
8. Write the immutable request/response audit event server-side.
9. Return a reviewable response; never publish, send, confirm or clear rights automatically.

Official Gemini references:

- https://ai.google.dev/gemini-api/docs/structured-output
- https://ai.google.dev/gemini-api/docs/video-understanding
- https://ai.google.dev/gemini-api/docs/files

Gemini structured output guarantees JSON structure, not factual correctness. Application validation and human review remain mandatory.

## Media analysis

Large reusable video and document inputs should use an approved file-input strategy rather than browser inline data. The server must store only safe references and processing evidence. Timestamp-based moment extraction remains a proposal until checked against the approved transcript and review master.

## Analytics truth model

Each analytics snapshot stores:

- source
- capture time
- coverage-through time
- episode
- reporting period
- metrics
- caveats

Planning targets are displayed separately from measured results. Zero values in a manual baseline are not presented as platform performance.

## Lead model

The CRM supports guest, sponsor, partner, media-client, community, speaking, press, volunteer, vendor and subscriber leads. Every record carries attribution, consent state, owner, score, next action and status.

No promotional contact should occur without an appropriate lawful basis, required consent or documented business-purpose review.

## Deployment and secrets

Production deployment should use separate staging and production Google Cloud projects. Cloud Run services must access secrets through Secret Manager and service identity rather than committed environment files.

Official deployment references:

- https://docs.cloud.google.com/run/docs/configuring/services/secrets
- https://docs.cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service

## Remaining work

- Trusted Gemini Interactions API service
- Source ingestion from Drive and approved transcripts
- Schema-validated server responses and immutable audit events
- Exact-quote and timestamp verification
- Platform analytics collectors
- Form-to-lead conversion automation
- UTM link management
- Community-classification and response suggestions
- Staging and production Cloud Run services
- Secret Manager, monitoring and alerting
- Accessibility, privacy, deletion/export and launch review
