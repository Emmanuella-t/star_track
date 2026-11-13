# Star Track: Master Product Requirements Document

**Project:** Star Track, an AI-powered student advising web application  
**Course:** Software Engineering Final Mini Project, Group 3, Philander Smith University  
**Team:** Emmanuella Turkson and Percia Burrows  
**Status:** Build specification, not evidence of implemented functionality  
**Primary project board:** [Jira Team Star Track](https://startrackteam.atlassian.net/jira/software/projects/SCRUM/backlog)  
**Repository:** [Emmanuella-t/star_track](https://github.com/Emmanuella-t/star_track)

## 1. Purpose and success criteria
Build a small, polished, locally demoable responsive web application that helps an undergraduate student (1) find answers to advising questions grounded in one **approved catalog/handbook**, (2) track manually self-reported completion against **one sample Computer Science degree checklist**, and (3) book an advisor appointment when further help is needed.

This is a classroom prototype, **not official advising**, a degree audit, or registration authorization. Catalog and degree requirements must never be invented. No real student records, university sign-on, official transcripts, or live campus scheduling integrations are permitted in the MVP.

**End-to-end demo:** Student signs in -> asks a documented prerequisite question -> sees a cited answer or honest abstention -> checks sample degree progress -> books an available advisor slot -> advisor signs in to view the appointment.

**Definition of project success:** All Must requirements below are implemented and verified with recorded actual test results, the core journey works on desktop and mobile, at least three design artifacts are maintained, and both team members can explain their work and the Agile process.

## 2. User roles and access
- **Student:** sign in; see student dashboard; ask catalog questions; view sample program requirements; update only their own progress; see and manage only their own bookings; browse published advisor slots.
- **Advisor:** sign in; see advisor dashboard; create/view their own weekly slots; see bookings on their own slots. No access to another advisor's private management controls.
- **Public visitor:** access login only; no private API data.
- **Admin:** not a role in this MVP. Seed demo accounts via scripts, not an admin UI.

Use synthetic demo accounts and generic course data until the chosen catalog and sample program are independently validated.

## 3. Release scope
### Must have
- Secure demo login/logout and server-side role/ownership checks.
- One approved source catalog or handbook, source version recorded.
- Catalog-based RAG chat with visible title/page or section citations; explicit insufficient-evidence response.
- Manual completed/uncompleted course checklist grouped into general education, major core, and electives; persisted per student.
- Advisor slot creation, viewing, student booking, rescheduling, cancellation, and prevention of duplicate active bookings.
- Responsive student/advisor screens; useful loading, empty, validation and error states.
- Tests, engineering documentation, and a reproducible demo.

### Should have
- Connected navigation from chat to tracker to appointments.
- Explicit catalog edition labels.
- Basic progress summary on student dashboard.

### Could have, only after Musts work
- Local recent chat history (avoid storing sensitive questions).
- Additional polish and accessibility improvements.

### Excluded
Student information systems, transcripts, actual course registration, automated degree audits or prerequisites-based eligibility decisions, email/SMS reminders, calendar sync, native apps, production deployment, multi-university support, AI-generated course recommendations without verified rule logic.

## 4. Requirements traceability
| ID | Priority | Functional requirement | Acceptance criteria |
| --- | --- | --- | --- |
| FR-01 | Must | Sign in and route by role | Valid demo credentials enter correct dashboard; invalid credentials return safe error; logout invalidates session. |
| FR-02 | Must | Source-grounded catalog Q&A | A supported question yields a verifiable cited answer and source metadata. |
| FR-03 | Must | Abstain without evidence | Unsupported question returns `insufficient_evidence`, with no fabricated answer or citation. |
| FR-04 | Must | Course completion checklist | Student can mark/unmark requirements and state survives reload. |
| FR-05 | Must | Progress by category | Completed/remaining counts recalculate correctly for each requirement category. |
| FR-06 | Must | Advisor availability | Advisor can create/view future slots; invalid or overlapping own slots are refused. |
| FR-07 | Must | Appointment management | Student can book, reschedule and cancel; updated booking state is visible. |
| FR-08 | Must | Prevent double booking | Only one active booking per slot, including concurrent requests. |
| FR-09 | Must | Ownership and privacy | Student A cannot access Student B's progress/bookings; advisor cannot edit another advisor's slots. |
| FR-10 | Should | Integrated navigation | Entry points to all three tasks are discoverable from student dashboard. |
| FR-11 | Should | Source/version transparency | Chat answer references identify the approved document and its edition/version. |
| FR-12 | Could | Recent Q&A | Limited, non-sensitive questions may appear as local history; optional. |

### Nonfunctional requirements
| ID | Quality | Verification |
| --- | --- | --- |
| NFR-01 | Usability | Walk through primary tasks with at least two volunteer testers if available; record problems. |
| NFR-02 | Grounding | Every factual AI answer in the documented test set shows sources; grade factual accuracy and abstention separately. |
| NFR-03 | Responsive | No horizontal scrolling in primary workflows on narrow phone and desktop widths. |
| NFR-04 | Performance | Record page-load and chat latency; provisional local targets <=3s page load and <=12s chat response, not guaranteed. |
| NFR-05 | Security | Password hashes only, protected routes, no real student records, no keys in source control. |
| NFR-06 | Integrity | Unique student/requirement progress and one active booking per slot enforced in database transaction. |
| NFR-07 | Maintainability | Separate auth, chat, progress and appointments modules; document setup/seeding/testing. |

**Visual direction:** Follow `docs/VISUAL_DESIGN_SPEC.md` for the reference-inspired landing page, modern Star Track identity, floating product previews, responsive UI tokens, and differentiated application dashboards. Treat the reference as inspiration, not a template to reproduce.

## 5. Product screens
1. **Login:** email/password, loading state, invalid-credential error, no publicly selectable advisor privilege.
2. **Student dashboard:** progress summary with self-reported disclaimer, prominent Ask AI button, Degree Progress, Appointments, next booked appointment, logout.
3. **AI advising:** question form, response text, independently inspectable citations with document title/version and page or section, unsupported evidence state, link to advisor bookings. Never present AI as official approval.
4. **Degree progress:** fixed program title, catalog/version badge, grouped course/requirement rows, checked state, completed/total and remaining per category. Explain self-reported and not official.
5. **Student appointments:** available slots per advisor, create booking, confirm, cancel and reschedule; meaningful empty and conflict states.
6. **Advisor dashboard:** own upcoming appointments, form for available time slots, slot validation and existing slots.
7. **Shared design:** accessible navigation, keyboard interactions, consistent form validation, sensible mobile layouts; use placeholder visual branding until team approves designs.

## 6. Principal user flows
**Flow A, question:** Sign in -> enter question -> API retrieves relevant approved passages -> answer only if evidence sufficient -> show answer and citations; otherwise show cannot verify and appointment CTA.

**Flow B, progress:** Sign in -> load own program and saved checkoffs -> check/uncheck -> server saves own record -> derived counts update -> reload persists.

**Flow C, booking:** Student signs in -> list unbooked future slots -> request booking -> transaction reserves if still available -> confirmation -> cancellation releases slot; reschedule atomically switches to another available slot, or preserves original booking if new slot fails.

**Flow D, advisor:** Advisor signs in -> create future valid non-overlapping availability -> list own slots and bookings -> student bookings appear on dashboard.

## 7. Data, AI and trust safeguards
- Store catalog **document title, edition/year, checksum, page/section metadata**, and chunk provenance. Ingestion scripts only operate on content the team is authorized to use.
- Parse PDFs using text extraction; verify headings/tables manually. If extraction is poor, use an attributed, reviewed text/Markdown copy of relevant source content.
- Embed approved chunks in one selected local vector store. **Chroma is the proposed default; confirm before implementation.** Use a configurable model provider, not hard-coded secrets.
- Use retrieval-only evidence. If evidence is missing or insufficient, abstain. A citation does not establish correctness by itself: evaluation must compare claim and source.
- Never treat user questions or catalog passages as instructions that override system rules; defend against prompt injection.
- Chat endpoint returns structured `answer`, `status`, `citations`, `source_version`; return `insufficient_evidence` when needed.
- Do not auto-infer course eligibility from checkbox state or AI output. A self-marked course is not verified transcript data.

## 8. Implementation contract
See [ARCHITECTURE.md](ARCHITECTURE.md), [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md), and [TEST_PLAN.md](TEST_PLAN.md). These define suggested endpoint contracts and phased build tasks. **Before coding each phase, inspect the current repository and adapt without deleting working code.** Do not claim tests passed until executed.

## 9. Project management and delivery
Use the existing Jira project, two existing sprint entries and linked tasks. Current setup is tracked on the board, not in this frozen PRD. Before touching a task, inspect its Jira status/assignee. Use branch names like `feature/SCRUM-20-progress-dashboard`, commit with the Jira ID, and record implementation evidence. Never automatically transition work to Done without tested evidence.

For the class deliverables, retain: proposal, requirements/design document, at least three design artifacts, prototype, expected/actual test report, 8-10 page mini thesis, 8-10 minute presentation, and live/recorded demo. Both team members must contribute.

## 10. Assumptions requiring confirmation
- Approved catalog/handbook title, edition and rights to use it.
- Exact sample Computer Science degree requirements.
- Final vector store and LLM provider/API access.
- Final UI direction and whether existing wireframes are approved.
- Whether appointment rescheduling uses same booking ID or creates a replacement row (this package recommends replacement record with transactional update).
- Final dates and task ownership follow Jira, not guesses in Cursor.

## 11. What Cursor must never do
- Invent Philander Smith University policies, courses, advisors or completed work.
- Use real student records in sample data or logs.
- Expose a model API key in frontend or GitHub.
- Generate an answer that sounds grounded when retrieval cannot verify it.
- Label a checklist an official degree audit.
- Mark Jira tickets complete or report test success without real evidence.
- Expand beyond the one-month MVP without an explicit scope decision.

## 10. Future university portal entry point: JICS and Canvas (FR-13)

**Product direction:** Star Track is a standalone companion to the Philander Smith University student experience. It should be possible for an authorized university portal administrator to add a **Star Track | AI Advising** external link to the **Quick Links** area of JICS/MyPanther (`https://jics.philander.edu/ICS/`). The JICS screenshot provided by the team is a visual reference for where that link could appear, not proof of administrative access or a promised JICS integration.

**MVP integration level:** Build a standalone application whose publicly reachable HTTPS entry URL could be configured as a JICS Quick Link or as a Canvas external URL by authorized administrators. No custom code will be installed in JICS or Canvas for the class prototype. Local development may use `http://localhost:5173`, but that address is not a usable link for other students. A live, remotely reachable HTTPS deployment is an optional demonstration enhancement and must use non-sensitive synthetic data.

| ID | Priority | Requirement | Acceptance criteria |
| --- | --- | --- | --- |
| FR-13 | Should (integration-ready design), not live portal integration | Star Track must be launchable independently through a stable entry URL without needing JICS or Canvas credentials, APIs or embedded code. | Visiting the entry route directly renders a useful landing/login page. Protected routes enforce Star Track authentication. Navigation works when the application is opened from an external website. External links do not automatically grant access to private data. |
| FR-14 | Could (future enhancement, not MVP) | An authorized university administrator may add a link in JICS Quick Links and/or Canvas. | Document the proposed label, target URL, new-tab behavior and approval prerequisites. Do not claim an external portal has been modified. |

**Proposed JICS link label:** `Star Track | AI Advising`. Proposed description: `Degree planning, catalog-based answers and advisor appointments`.

**Entry behavior:** JICS Quick Links -> Star Track HTTPS landing/login -> independent demo student/advisor login -> authenticated dashboard. If a user arrives at a protected path without an active session, redirect them to login and safely return to the intended internal path after authenticating. Provide a way back to MyPanther as an external outbound link, clearly labeled, if a return navigation item is added.

**Brand and UX:** Use an original, modern, responsive student interface inspired by PSU's green/gold academic identity, but do not reproduce the JICS UI or imply Star Track is an officially deployed university service. PSU logos and marks may require institutional permission for public use. Keep the disclaimer visible on the landing screen and degree progress views.

**Integration boundaries:** A portal hyperlink is not SSO, authorization, SIS access, Canvas LTI, an iframe, or a data synchronization mechanism. SSO, Canvas LTI 1.3, iframe embedding, official student information and portal administration require separate design, access, authorization, testing and university IT approval. Avoid relying on third-party cookies or iframe behavior in the MVP. Never copy JICS usernames/passwords or solicit credentials for JICS in Star Track.

**Open decisions:** Production host/domain, PSU IT approval, official branding permissions, Canvas course placement, accessibility and security review, ownership of the URL and long-term maintenance. These are future decisions and do not block classroom MVP delivery. See [PORTAL_INTEGRATION.md](PORTAL_INTEGRATION.md).
