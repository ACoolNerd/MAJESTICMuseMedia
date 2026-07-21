# Phase 9 — Operational control modules

This phase replaces the remaining calendar, task, approval, rights and governance placeholders with persistent, role-aware operating workspaces.

## Included

- Production calendar with Confirmed, Planned, Proposed and TBD status protection
- Persistent production task board with owner role, priority, blockers, source and due dates
- Role-bound approval inbox covering Editorial, Technical, Brand, Rights, Metadata and Release decisions
- Rights and release register for guest releases, music, images, disclosures and sensitive-information review
- Editable 22-workstream RASCI matrix
- Required governance change reasons and embedded previous-assignment history
- Firestore and local-development persistence for calendar, tasks, approvals, rights and RASCI
- Firestore authorization tests for calendar confirmation, approval authority and governance editing
- Operational truth and governance unit tests

## Calendar authority

- CEO, COO and Social roles may manage calendar records.
- Social may move a record among non-confirmed planning states.
- Only CEO or COO may create a Confirmed record or move an unconfirmed record to Confirmed.
- Proposed and TBD dates remain visibly unconfirmed in the interface.

## Approval authority

The approval record itself identifies the required authority.

- Editorial, Brand and Release approval remain under the CEO role.
- Technical approval belongs to Post-Production.
- Rights approval belongs to the assigned COO/rightsholder workflow.
- Metadata approval may be assigned to Social.
- The immutable episode, approval type and requested-role fields cannot be changed while approving.
- A written waiver remains visible and must include supporting evidence in the production audit flow.

## Rights model

A rights record is not cleared unless every applicable category is either Cleared or explicitly Not Applicable and the sensitive-information review is Cleared.

The current seed records intentionally remain incomplete. The application must not manufacture a signed guest release, music license, image permission, sponsor disclosure or sensitive-information clearance.

## RASCI governance

The RASCI workspace exposes the active 22-workstream operating baseline. Only CEO and COO roles may edit it.

Every edit requires:

- a change reason
- the acting role
- a timestamp
- a copy of the previous assignment set

The interface warns when a workstream lacks an Accountable or Responsible assignment. It does not silently change the approved source merely to remove a warning.

## Persistence

When Firebase is connected, the new collections are:

- `calendarItems`
- `tasks`
- `approvals`
- `rightsRecords`
- `rasciWorkstreams`

When Firebase is not configured, development-only records use browser local storage. Real guest data, legal releases, private locations and production credentials must never be placed in local demo storage.

## Remaining production work

- Trusted server mutations and immutable audit events for calendar, approval, rights and governance changes
- Google Calendar synchronization and conflict detection
- Evidence-file uploads and signed document references
- Approval notifications and escalation rules
- Task reminders and dependency graphs
- RASCI history in a dedicated immutable audit collection
- Rights-expiration and license-territory fields
- Production data migration and administrator onboarding
