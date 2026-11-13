# Star Track: Cursor Implementation Plan

**Important:** Inspect repository and Jira first. This is an order of operations, not evidence of completed work. Use the existing sprint entries in Jira and reflect actual owners and status. Limit work to Must requirements until the core workflow is stable.

## Working method for every phase
1. Open the project in Cursor and read `docs/STAR_TRACK_MASTER_PRD.md` and `.cursor/rules/star-track.mdc`.
2. Inspect existing code, tests, environment and current Git branch before editing.
3. Ask Cursor for a short plan listing files to change, API contracts and test cases.
4. Implement one bounded feature at a time. Preserve existing functioning code.
5. Run relevant tests and report **actual** commands/results; do not fabricate test evidence.
6. Commit changes on feature branch with Jira ID, open PR, and have the other teammate review.
7. Attach proof or notes to the corresponding Jira issue and change status only when genuinely ready.

## Phase 0: Repository verification (SCRUM-13)
- Clone `https://github.com/Emmanuella-t/star_track`.
- Inspect the existing React/Vite and FastAPI starter, version constraints and CI workflow.
- Run backend `/health` test; install frontend dependencies and run its build locally.
- Record actual failures and address them before adding features.
- Agree final model provider and source catalog; create safe `.env.example` placeholders only.

**Exit:** Both contributors can run app; backend health check and frontend build pass locally; no secrets in repo.

## Phase 1: Foundation and UI skeleton (SCRUM-10 through SCRUM-14)
- Review requirement IDs, schema, architecture, use case and activity models.
- Create route skeleton for student and advisor screens with mobile navigation and states.
- Implement database migrations, synthetic demo seed script, password hashing, authenticated login/logout and role-aware backend endpoints.
- Write authorization and invalid-login tests.

**Exit:** A synthetic student and advisor can sign in; wrong-role requests are denied; UI routes correctly.

## Phase 2: Source-grounded AI advising (SCRUM-15 through SCRUM-18)
- Log exact approved catalog edition; validate extraction.
- Build ingestion with page-aware metadata; create embeddings and retriever.
- Build server-side chat service using approved passages and controlled model credentials.
- Implement cited supported answers and honest insufficient-evidence response.
- Run 20 to 30 question evaluation set and record actual accuracy/abstention/citation checks.

**Exit:** Supported and unsupported queries behave correctly on representative tested examples; answers show traceable sources.

## Phase 3: Degree progress (SCRUM-19 through SCRUM-21)
- Validate / label sample CS checklist and categories.
- Implement GET requirements, GET own progress and PUT own checkoff endpoints.
- Build categorized responsive checklist and progress summary.
- Test persistence, counts, other-user access denial and integrated navigation.

**Exit:** Student checkoffs persist and only their own data is accessible.

## Phase 4: Advisor appointment booking (SCRUM-22 through SCRUM-24)
- Build advisor slot creation and listing with valid future windows and overlap checks.
- Build student available slots and booking/cancellation/rescheduling UI.
- Enforce transactional unique active booking at database level.
- Test conflict handling, reservation ownership and failed reschedule rollback.

**Exit:** Two simultaneous reservations for a single slot cannot both succeed; advisor sees own bookings.

## Phase 5: Test, refine, deliver (SCRUM-25 through SCRUM-29)
- Execute all test cases in `TEST_PLAN.md`, writing real pass/fail and observed results.
- Verify keyboard access and narrow/mobile rendering.
- Fix highest-severity issues; rerun regression tests.
- Update architecture/design diagrams if code changed.
- Prepare 8 to 10 page mini thesis, 8 to 10 minute slides/demo and sprint evidence.

**Exit:** Demo is reproducible; claims are backed by screenshots, source references, test logs and commits.

## First Cursor prompt
> Read `docs/STAR_TRACK_MASTER_PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE_SCHEMA.md`, `docs/IMPLEMENTATION_PLAN.md`, and `.cursor/rules/star-track.mdc`. Inspect the current repository first. We are starting Phase 0 only. Identify the actual current state of the frontend, backend and CI. Give me a concise plan, then verify the starter build and health test. Do not implement later phases, invent data or report unrun tests. Show commands executed, outputs and any blockers.

## Later feature prompt template
> Work only on Phase [number], Jira [SCRUM-ID]. Read the PRD and related technical spec; inspect existing files before editing. First describe planned changes and acceptance tests. Implement the smallest complete increment. Run tests, report exact results, update relevant docs, and stop. Do not change unrelated components or mark Jira complete without my review.

## Portal integration readiness, without changing the MVP

Treat this as a cross-cutting requirement, **not an additional sprint feature that delays the three core modules**.

- **Phase 1:** Ensure `/` is a public landing/login entry and protected pages redirect safely to login. Add an original Star Track identity that may draw from PSU green/gold colors, without making unsupported official branding claims.
- **Phase 3 and Phase 4:** Preserve an obvious path between AI advising, progress tracking and bookings after launching from the standalone URL.
- **Phase 5:** Run tests T-15 to T-19 for direct URL loading, authenticated deep links, external navigation, disclaimer visibility and lack of dependency on JICS/Canvas. Document the proposed JICS Quick Link label and screenshot-inspired placement.
- **Optional, only after MVP completion and with approval:** Deploy synthetic-data demo to a stable HTTPS URL for demonstration. JICS Quick Link configuration or Canvas course configuration is an action for authorized administrators, not a Cursor coding step.

**Do not** implement SSO, Canvas LTI, JICS plugins, transcript sync, production student accounts or iframe embedding as part of these phases. Refer to [PORTAL_INTEGRATION.md](PORTAL_INTEGRATION.md).

### Updated initial Cursor instruction

> Read the master PRD and all linked documents, including `docs/PORTAL_INTEGRATION.md`, plus `.cursor/rules/star-track.mdc`. First inspect the existing repository. Begin with Phase 0 verification, not feature implementation. Design Star Track as a standalone web app that could later be opened from a JICS Quick Link or Canvas external URL, without integrating with either portal. Verify tests that you actually run and stop after Phase 0.

## Visual design delivery
- Read `docs/VISUAL_DESIGN_SPEC.md` and inspect `docs/references/aeline-design-inspiration.png` before frontend design.
- Produce a distinctive Star Track landing page and task-focused logged-in UI; do not copy the original reference brand or use unverified statistics.
- Validate desktop/mobile responsiveness and accessibility. Preserve the project phased build order and do not expand MVP scope.
