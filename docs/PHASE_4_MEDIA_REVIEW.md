# Phase 4 — Media library, review, and CapCut handoff

This phase establishes the production metadata, review and editor-handoff layer for MAJESTIC Muse Media.

## Included

- Metadata-only media library
- Original, proxy, review-export, final-master, audio, caption, still and derivative asset types
- Checksum and backup-verification evidence
- Review versions
- Time-coded comments with category, severity and resolution state
- Consolidated revision-list generation
- Controlled CapCut packet generation
- JSON edit packet and CSV clip-candidate exports
- 16:9, 9:16, 4:5 and 1:1 export specifications
- Firestore and local-development repositories
- Role-aware Firestore rules for media and review collections

## Large-media architecture

Large files must never be written into Firestore documents or committed to GitHub. The production path is:

1. An authenticated user requests an upload session.
2. A trusted server verifies role, episode access, file type and proposed size.
3. The server creates a short-lived signed Cloud Storage upload URL.
4. The browser uploads directly to Cloud Storage.
5. A trusted worker validates media metadata and calculates a checksum.
6. Backup evidence is recorded.
7. Only then is the Firestore metadata record created or updated.

The current UI represents this boundary and uses storage references rather than exposing private URLs.

## Review workflow

- Each review export belongs to a named version.
- Every comment records an exact time, category, severity, author and resolution state.
- Unresolved comments become the consolidated revision list.
- A final master cannot unlock publishing merely because a file was uploaded.
- Technical validation requires the Final Master label, checksum, backup evidence, duration, dimensions and a supported media type.
- Executive and release-gate approval remain separate requirements.

## CapCut boundary

The application does not claim unsupported direct control over CapCut. It creates a controlled editor packet containing:

- sequence and file-naming instructions
- source-asset references
- cold-open and story outline
- unresolved removal and rights notes
- lower-thirds guidance
- clip candidates
- aspect-ratio and export specifications

The editor completes the cut in CapCut, uploads a review export, resolves notes, and returns the final master to the operating system.

## Remaining work

- Trusted signed-upload server endpoint
- Automated media probing and checksum worker
- Real signed review playback URLs
- Visual-region annotations
- Reply threads and mentions
- Formal technical-QC approval action
- Cloud Storage lifecycle and retention rules
- Emulator tests for media security rules
