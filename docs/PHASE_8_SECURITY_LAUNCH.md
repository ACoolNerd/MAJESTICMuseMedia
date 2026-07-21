# Phase 8 — Security validation and launch readiness

This phase turns the code-level foundation into an auditable pre-deployment package. It does not deploy the application or connect external accounts.

## Included

- Firestore Emulator configuration
- Dedicated security-rules test suite
- CI job for Firestore authorization tests
- CI scan for private-key and credential-shaped material in tracked files
- Build-only Cloud Build configuration for the trusted server image
- Machine-readable launch-gate manifest
- Separation between code readiness, staging readiness and public-launch authorization

## Firestore security evidence

The emulator suite verifies these critical boundaries:

- Public users may read only approved public-content records.
- Anonymous users cannot read episode operations.
- Production crew may read episodes but cannot edit them.
- Authorized content operators may create episode records.
- Guest documents are isolated by authenticated owner UID.
- Every client role is denied writes to immutable audit logs.
- Encrypted platform credentials are invisible to every client role.
- Social operators may create only Draft or Waiting Approval distribution jobs.
- Only the CEO role may move a distribution job into Approved.
- Processing, success and failure states remain trusted-server-only.
- Unregistered collections are denied by default.
- Anonymous public-form submissions are write-only.

Run locally:

```bash
npm install
npm run test:rules
```

The command launches an isolated Firestore emulator through `firebase emulators:exec`, runs the dedicated Vitest configuration and shuts the emulator down after the test process.

## Repository safety scan

Run:

```bash
npm run security:scan
```

The scan inspects tracked text files for strong indicators of committed private keys, Google service-account files and common credential formats. A clean scan does not replace provider-side secret scanning, Git-history review or credential rotation. Any real credential discovered in Git must be removed from history and rotated.

## Container build pipeline

`deploy/cloudbuild.server.yaml` builds and pushes the trusted-server image to Artifact Registry. It intentionally does not deploy Cloud Run or enable external actions.

Required substitutions:

- `_REGION`
- `_ARTIFACT_REPOSITORY`
- `_IMAGE_NAME`

The build identity requires only the permissions needed to read source, write the selected Artifact Registry repository and write build logs. Deployment should use a separate, explicitly authorized identity.

## Launch-gate manifest

`deploy/launch-readiness.yaml` records ownership, status, evidence and authorization boundaries for:

- repository policy
- final brand approval
- security review
- privacy and legal review
- accessibility and mobile acceptance
- source-truth verification
- staging environment
- platform compliance
- rights and releases
- production deployment and rollback
- domain connection
- written launch approval

The manifest keeps these flags false until the appropriate evidence and written authorization exist:

```yaml
external_actions_enabled: false
production_deployment_authorized: false
public_launch_authorized: false
```

## Environment separation

Use separate staging and production Google Cloud/Firebase projects. Do not reuse OAuth tokens, service accounts, Storage buckets or production data in local development.

### Staging

Staging should include:

- Firebase Authentication with test users and custom roles
- Firestore and Storage with non-production data
- Cloud Run API with external actions disabled
- Secret Manager values dedicated to staging
- approved test OAuth applications or test users
- monitoring, audit logging and budget alerts

### Production

Production should not be created by copying local `.env` files. Provision it through an approved infrastructure process, least-privilege identities and Secret Manager references.

## External prerequisites that code cannot complete

The repository cannot independently provide:

- ownership approval to change repository visibility
- Google Cloud/Firebase project creation and billing authorization
- Secret Manager secret values
- OAuth application ownership and platform verification
- domain ownership and DNS changes
- final logo, photography, privacy, terms or release approvals
- real guest data, signed releases and approved media
- written executive launch authorization

These remain launch blockers rather than fabricated completion states.

## Acceptance criteria for this phase

- Client typecheck, lint, tests and production build pass.
- Server typecheck, tests and build pass.
- Repository safety scan passes.
- Firestore emulator authorization tests pass.
- No production credentials are committed.
- Cloud build configuration remains build-only.
- Launch gates remain blocked or evidence-required until real evidence exists.
- No external platform action is enabled.

## Next execution stage

After this phase merges, the next stage is environment provisioning and staging validation:

1. Approve the repository visibility/public-source policy.
2. Create staging Google Cloud and Firebase projects.
3. Create Artifact Registry and least-privilege service identities.
4. Add Secret Manager values.
5. Deploy the trusted server with external actions disabled.
6. Deploy the web application to a staging host.
7. Seed authorized test users and roles.
8. Run end-to-end auth, Firestore, upload, Muse and audit tests.
9. Begin platform OAuth verification and server-adapter testing.
10. Complete privacy, accessibility, rights and executive acceptance before production.
