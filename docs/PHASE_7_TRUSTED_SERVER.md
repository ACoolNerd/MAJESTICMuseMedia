# Phase 7 — Trusted server runtime and production deployment foundation

This phase moves privileged operations out of browser code and into a Cloud Run-ready Node.js service.

## Implemented

- Separate strict-TypeScript server package
- Firebase Admin initialization through application default credentials
- Firebase ID-token verification with revocation checks
- Server-side permission matrix
- Audited custom role assignment and refresh-token revocation
- Immutable Admin SDK audit writes
- Schema-validated Gemini Interactions API output
- Authorized source allowlist validation
- Signed Cloud Storage upload sessions
- Signed OAuth state, AES-256-GCM token encryption and YouTube web-server OAuth boundary
- Server-only encrypted platform-credential collection
- CORS restricted to the configured application origin
- Request-size limits and request IDs
- Health and readiness endpoints
- External platform actions disabled by default
- Cloud Run container and secret-managed service template
- Client API adapter and trusted Gemini mode
- Client and server CI jobs

## Trusted routes

### `GET /healthz`

Process health only. It does not prove external integrations are ready.

### `GET /readyz`

Returns `503` until required production boundaries are configured, including Firebase project identity, Gemini, YouTube OAuth, token encryption and the external-action enable flag.

### `POST /api/muse/answer`

Requires a verified Firebase ID token and `ai.use`. The client supplies only source records that the actor is authorized to access. The server requests Gemini structured output, validates the JSON with Zod, rejects citations outside the supplied allowlist and writes an audit event.

### `POST /api/uploads/sign`

Requires `media.sign-upload`. It creates a short-lived V4 Cloud Storage write URL with asset, episode, actor and declared-size metadata. The uploaded object still requires an asynchronous probe, checksum, malware/content-safety review where appropriate, backup verification and metadata finalization.

### `POST /api/oauth/youtube/start`

Requires `platforms.manage`. It generates a signed, time-limited OAuth state and a server-side YouTube authorization URL.

### `GET /api/oauth/youtube/callback`

Verifies state, exchanges the authorization code server-side, encrypts returned tokens and stores them in the client-inaccessible `platformCredentials` collection. Production hardening should replace application-level encryption with Cloud KMS envelope encryption.

### `POST /api/admin/users/:uid/role`

Requires `users.manage`. It sets a Firebase custom role, prevents non-CEO assignment of the CEO role, revokes refresh tokens and writes an audit event.

## Security model

- The frontend never receives OAuth client secrets, refresh tokens, stream keys, service-account keys or Gemini API keys.
- Production uses Cloud Run service identity and Secret Manager.
- Firebase ID tokens are verified on the server; verification is configured to check revocation for privileged calls.
- Browser writes to audit logs, AI conversations and platform credentials are denied.
- OAuth state is signed and expires after ten minutes.
- OAuth return URLs must remain on the configured application origin.
- External platform execution remains disabled until launch review explicitly enables it.
- API responses carry request IDs for traceability.

## Current limitations

This is a production-shaped foundation, not a live deployment. It does not yet include:

- a provisioned Google Cloud project or service account
- actual Secret Manager values
- Cloud KMS envelope encryption
- deployed Cloud Run revisions
- custom API domain and TLS verification
- YouTube consent-screen verification
- Twitch/KICK OAuth server routes
- distribution worker execution
- webhook signature and replay verification
- upload-completion worker, media probing and checksum finalization
- Firebase Emulator integration tests
- monitoring, alerting, budgets or incident runbooks

## Deployment sequence

1. Make the repository private or approve a public-source policy.
2. Create separate staging and production Google Cloud/Firebase projects.
3. Create least-privilege Cloud Run service accounts.
4. Create Secret Manager secrets and grant only the runtime identity access.
5. Configure Firebase Auth, Firestore, Storage and authorized domains.
6. Create YouTube OAuth web credentials and exact callback URLs.
7. Build and scan the container.
8. Deploy with `ENABLE_EXTERNAL_ACTIONS=false`.
9. Validate health, readiness, auth, rules and audit events in staging.
10. Complete OAuth/API verification and platform compliance reviews.
11. Perform security, privacy, accessibility and release-gate acceptance.
12. Enable specific external actions only after written executive approval.

## Official implementation references

- Firebase Admin ID-token verification: https://firebase.google.com/docs/auth/admin/verify-id-tokens
- Gemini structured output: https://ai.google.dev/gemini-api/docs/structured-output
- Gemini Interactions API migration: https://ai.google.dev/gemini-api/docs/migrate-to-interactions
- YouTube server-side OAuth: https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps
- Cloud Run secrets: https://docs.cloud.google.com/run/docs/configuring/services/secrets
