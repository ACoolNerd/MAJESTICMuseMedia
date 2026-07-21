# Phase 5 — Live and distribution adapters

This phase establishes capability-aware platform boundaries for YouTube, Twitch and KICK.

## Included

- Platform connection metadata
- Explicit capability flags per platform
- Live-event records with run-of-show, CTA, moderators and external references
- Distribution jobs with approval, idempotency, attempts and returned state
- Livestream control-room UI
- YouTube operating center
- Distribution approval queue
- Test adapters that make no external request
- Firestore and local-development repositories
- Security rules for platform metadata, live events and distribution jobs
- Tests for capability, approval and publication-truth guardrails

## Current official platform model

### YouTube

The YouTube Live Streaming API represents a live event as a `liveBroadcast` resource associated with a `liveStream` resource. The production server adapter must create or select the resources, bind them, monitor stream health and store every returned external identifier and lifecycle state.

Official references:

- https://developers.google.com/youtube/v3/live/getting-started
- https://developers.google.com/youtube/v3/live/docs
- https://developers.google.com/youtube/v3/live/life-of-a-broadcast

### Twitch

Twitch scheduling uses Helix schedule endpoints. EventSub is the event-delivery layer, and current Twitch guidance prefers EventSub and Twitch API methods for chat experiences.

Official references:

- https://dev.twitch.tv/docs/api/schedule
- https://dev.twitch.tv/docs/eventsub/
- https://dev.twitch.tv/docs/chat

### KICK

KICK integrations must use documented developer materials only. Capabilities remain conservative and disabled unless the connected application, scopes and current documentation explicitly support them. KICK data must follow the developer agreement, retention and user-control requirements.

Official references:

- https://dev.kick.com/
- https://dev.kick.com/terms-of-service

## Secret architecture

OAuth client secrets, refresh tokens, access tokens and stream keys must never enter browser code, Firestore metadata, logs or Git commits. They belong in the trusted server runtime and secret manager.

The browser may receive:

- connection state
- account display label
- granted scope names
- capability flags
- token-expiration time
- last health-check result
- approved external resource IDs and public URLs

## Distribution truth model

1. A staff user prepares a draft job.
2. The CEO / Executive Producer supplies final publishing approval.
3. A trusted server validates gates, rights, asset status, connection and idempotency.
4. The server executes the supported platform action.
5. The server records attempts and the returned external state.
6. Upload success is not treated as Public unless the platform returns and subsequent verification confirms that visibility.
7. Processing, success and failure transitions are server-written and audited.

## Test mode

Test mode is a no-network simulation. Browser test execution is permitted only in local-development persistence. When Firestore is active, all execution must move through the trusted server adapter.

## Remaining Phase 5 work

- OAuth callback and token-refresh services
- Secret Manager integration
- YouTube broadcast, stream, bind, transition, chat and upload server adapters
- Twitch schedule, EventSub and chat server adapters
- KICK app review and currently documented endpoint implementation
- Webhook signature verification and replay protection
- Distribution worker retries and immutable audit events
- Live chat aggregation and moderation
- Analytics snapshots
