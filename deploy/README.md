# Deployment assets

Nothing in this directory authorizes or performs a production launch by itself.

## Files

- `cloudbuild.server.yaml` — builds and pushes the trusted-server container; it does not deploy it.
- `cloud-run-service.template.yaml` — Cloud Run service template inherited from the trusted-server phase. Replace placeholders only through an approved staging or production process.
- `launch-readiness.yaml` — auditable launch gates and evidence requirements.

## Pre-build requirements

1. Select the staging Google Cloud project.
2. Create an Artifact Registry Docker repository.
3. Grant the Cloud Build identity only the required repository and logging permissions.
4. Confirm the source revision is approved and CI is green.
5. Confirm the repository safety scan is green.

Example build command after those prerequisites exist:

```bash
gcloud builds submit \
  --project="STAGING_PROJECT_ID" \
  --config="deploy/cloudbuild.server.yaml" \
  --substitutions="_REGION=us-central1,_ARTIFACT_REPOSITORY=majestic-muse-media,_IMAGE_NAME=api" \
  .
```

## Deployment authorization boundary

Building an image is not deployment approval. Before a Cloud Run revision is created:

- the staging service account must exist
- Secret Manager references must exist
- the service account must have least-privilege secret access
- Firebase/Firestore/Storage project identity must be verified
- `ENABLE_EXTERNAL_ACTIONS` must remain `false`
- an authorized operator must record the deployed image digest and revision

Production deployment additionally requires completed launch gates and written executive authorization.

## Rollback evidence

For every staging or production release, record:

- source commit
- image digest
- Cloud Run revision
- configuration revision
- migration or rule version
- verification results
- rollback target
- approving person
- deployment and rollback timestamps
