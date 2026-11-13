# Star Track: Test Plan and Results Template

The tests below are **planned, not passed**. Record actual results only after running a test. Include date, build commit, environment, tester, observed result and evidence. Do not treat citation presence as proof of correctness.

| ID | Requirement | Scenario | Expected result |
| --- | --- | --- | --- |
| T-01 | FR-01, NFR-05 | Valid student/advisor login, invalid password and logout | Correct role routes; wrong password rejected; logout invalidates session. |
| T-02 | FR-02, FR-11 | Ask a question with a known source answer | Factually supported answer with correct catalog citation and edition. |
| T-03 | FR-03 | Ask an out-of-document policy question | `insufficient_evidence` and advisor fallback, not invented policy. |
| T-04 | FR-04, FR-05 | Check/uncheck course and refresh | Saved state persists; grouped totals recalculated. |
| T-05 | FR-06 | Advisor creates valid, reversed, past, overlapping slots | Valid future slot saved; invalid inputs rejected. |
| T-06 | FR-07, FR-08 | Two students race to book same slot | Only one succeeds; other receives conflict response. |
| T-07 | FR-07 | Cancel and reschedule own booking; test conflicting target | State updates; canceled slot opens; failed reschedule preserves original. |
| T-08 | FR-09, NFR-05 | Student A attempts to access student B's record | API denies access regardless of frontend hiding. |
| T-09 | FR-10, NFR-01, NFR-03 | Navigate question -> tracker -> booking on mobile and desktop | All tasks discoverable, no horizontal overflow, usable focus labels. |
| T-10 | NFR-04 | Measure initial load and chat response latency locally | Observations recorded against provisional <=3s and <=12s targets. |
| T-11 | NFR-02 | Submit prompt injection inside query and/or corpus | Untrusted text cannot override system behavior or force fabricated claims. |
| T-12 | NFR-06 | Repeat progress update for same student/requirement | One logical progress record; no duplicated totals. |
| T-13 | NFR-05 | Access advisor API using student session | Rejected with 403 or appropriate authorization response. |
| T-14 | NFR-03 | Test loading, empty, server error and unsupported AI states | Clear recovery or next action; no inaccessible controls. |

## RAG evaluation dataset
Use approximately 20 to 30 questions across: direct catalog lookups; prerequisite/policy queries with multi-step interpretation; information genuinely absent from the approved source; ambiguous questions; adversarial prompt-injection attempts. Each row must include question, expected supported answer/passages or expected abstention, actual output, source citation check, factual correctness, abstention correctness and notes.

## Actual test execution record
Copy this format for **each** execution:
```
Test ID:
Build commit SHA:
Date/time:
Tester:
Environment (OS, browser, versions):
Setup / synthetic test data:
Steps:
Expected result:
Actual result:
Pass / Fail / Blocked:
Evidence link or screenshot:
Bug issue ID (if failed):
Fix / retest results:
```

## Exit gates
- All Must feature flows function end to end.
- No known critical authorization or double-booking defect.
- Every claimed supported AI answer in the evaluation has source provenance.
- Failures and limitations are explicitly disclosed, not quietly relabeled passed.
- Both teammates contribute to test evidence and final demonstration.

## Future portal link and standalone entry tests (planned, not executed)

| ID | Requirement | Scenario | Expected result |
| --- | --- | --- | --- |
| T-15 | FR-13 | Open the standalone Star Track URL directly in a clean browser | Landing/login loads without any JICS/Canvas session or integration. |
| T-16 | FR-13, NFR-05 | Open a protected Star Track route with no session | Redirects to Star Track login; no student/advisor data is exposed. |
| T-17 | FR-13 | Follow an external link from a simple local mock JICS/Canvas page | App opens successfully and routes/login work without referring credentials or tokens. Mock page is not the actual university portal. |
| T-18 | FR-13, NFR-03 | Refresh a nested route on the chosen demo host and test narrow viewport | Host serves app route correctly; responsive page and navigation remain usable. Only applicable after host is configured. |
| T-19 | FR-13, FR-14 | Review landing and degree tracking disclaimer and portal link documentation | Clearly marked prototype, no false official integration claims, proposed administrator-owned Quick Link details documented. |

Record URL/origin, browser and whether tests used a local mock or an approved public deployment. **Do not** mark JICS or Canvas integration as passed merely because a standalone page works.

## Visual design and accessibility checks (planned)
- VD-01: Landing page communicates academic advising, links to own login, and shows sample-only preview cards.
- VD-02: Student and advisor dashboards remain practical and role appropriate.
- VD-03: Layouts render at 375px, 768px and 1440px without clipped navigation or horizontal overflow.
- VD-04: Keyboard-only navigation, focus visibility, labels, contrast and reduced-motion preference are verified.
- VD-05: No false adoption claims, source-specific Aeline branding, fabricated degree statistics or unauthorized PSU logo usage.

Record expected and actual results only after tests are executed.
