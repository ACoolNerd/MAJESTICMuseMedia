# MAJESTIC Muse Media Architecture

## Product surfaces

1. Public editorial website and episode destination.
2. Private executive and production control center.
3. Guest preparation and promotional portal.
4. Media review and CapCut handoff center.
5. YouTube, Twitch, and KICK adapter layer.
6. Community inbox and lightweight lead CRM.
7. Muse Intelligence, grounded in the approved source hierarchy.

## Source hierarchy

1. Production Control Center.
2. Master Operating System Source.
3. Master Operating System spreadsheet.
4. Operating System Walkthrough.
5. Approved Executive Media.
6. Episode transcripts and signed guest materials.
7. Archived legacy materials for historical context only.

All project records preserve `Confirmed`, `Planned`, `Proposed`, and `TBD` distinctions. AI output must cite the internal record, expose missing information, and never invent completion.

## Security boundary

Browser-safe Firebase identifiers use `VITE_` variables. OAuth client secrets, Gemini keys, platform tokens, stream keys, and privileged publishing logic belong in a server runtime and cloud secret manager. Firestore rules are starter rules and require emulator testing before production.

## Next implementation phases

- Phase 2: Firebase authentication, claims-based RBAC, persistent episode/guest/task stores.
- Phase 3: signed media uploads, checksum service, review versions, time-coded comments.
- Phase 4: server-side YouTube/Twitch/KICK and Workspace adapters with OAuth.
- Phase 5: Gemini structured-output pipelines for transcript intelligence and content packages.
- Phase 6: analytics snapshots, UTM attribution, consent workflows, deployment hardening.
