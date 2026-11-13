# Star Track: JICS and Canvas Entry Point Specification

**Status:** Proposed integration readiness. Neither JICS nor Canvas has been changed, and the team has not obtained university administrative access or approval.

## 1. Goal

The supplied JICS/MyPanther screenshot shows a **Quick Links** panel in the left sidebar, containing links such as Philander Smith University, Philander Email, Net Partner and PSU Library. Star Track should be suitable for placement there as an additional external link. Students would leave JICS, visit the Star Track web app, and use its own authentication.

**Reference portal:** https://jics.philander.edu/ICS/

## 2. Recommended entry point

| Field | Proposal |
| --- | --- |
| Link placement | JICS/MyPanther sidebar, Quick Links section |
| Display text | Star Track \| AI Advising |
| Description | Degree planning, catalog-based answers and advisor appointments |
| Destination | `<APP_HTTPS_URL>/` after an approved stable HTTPS deployment; placeholder until hosting is decided |
| Opening behavior | Prefer a new tab for easy return to JICS, subject to portal admin preferences and accessibility guidance |
| Authentication | Independent Star Track account/session for the prototype; not JICS SSO |
| Access | Student and advisor demo roles; no real student information or campus account synchronization |

The application should also work when a student opens the same URL directly or receives it in a message, without first visiting JICS.

## 3. Integration levels and scope

1. **MVP: standalone, link-ready web application.** No university system configuration is required. Demonstrate external linking using a simple local HTML page if needed.
2. **Future: authorized JICS Quick Link.** University portal administrator adds the deployed Star Track HTTPS URL to the portal configuration, following its governance and security process.
3. **Future: Canvas external URL.** Authorized Canvas administrator or course manager adds an external URL link if permitted. This is only navigation and does not provide Canvas authentication or gradebook access.
4. **Future only: SSO, Canvas LTI 1.3, iframe embeds or SIS integration.** Each requires separately approved identity, security, data governance and administrative implementation. Do not implement these for the classroom MVP.

## 4. Student journey

1. Student sees a proposed **Star Track | AI Advising** entry in JICS Quick Links (or an approved Canvas link).
2. Clicking it opens a secure Star Track landing/login page, preferably in a new tab.
3. Student signs in using a synthetic Star Track demo account in the classroom prototype.
4. Student accesses the dashboard, catalog-grounded chatbot, progress tracker and appointment scheduling.
5. Students can return to JICS via the original tab, or a clearly labeled external **Back to MyPanther** link if added.

A link alone is not permission to read transcripts, schedules, official enrollment records, or portal session state.

## 5. UI and identity guidance

- Deliver an original, modern, responsive product, with optional university-inspired deep green and gold styling.
- The screenshot is a **placement/context reference**, not a visual component library and not authorization to duplicate the portal.
- Avoid unauthorized official logo use or implying PSU endorsement or deployment.
- Show an obvious disclaimer: **Student prototype. Not an official university advising or degree audit service.**
- Student degree progress comes from self-reported sample checklist data. The chatbot only answers from approved source documents.

## 6. Engineering acceptance criteria

- Browser route `/` resolves to landing/login without a university session.
- An unauthenticated deep link safely sends the visitor to Star Track login, with no private data leakage.
- Navigation and return route work when arriving through an ordinary external hyperlink.
- The application does not read or set JICS/Canvas cookies, request credentials or assume user identity from referrer or query parameters.
- Future hosting uses an HTTPS URL, correct SPA route fallback, restricted CORS and correctly configured secure session cookies.
- A local demo of linking must clearly identify the source page as a **mock**; do not describe a mock as an actual JICS integration.
- Tests T-15 through T-19 in `TEST_PLAN.md` cover relevant behavior and must include actual recorded execution results.

## 7. Institutional approval checklist for future adoption

Before any real university placement, obtain approvals for branding, hosted domain, data processing/security, accessibility, identity lifecycle, support ownership, continuity/maintenance and portal configuration. Coordinate with university IT, Academic Affairs and portal/Canvas administrators. Verify the correct and current product configuration rather than presuming integration features are enabled.

## 8. Not in this prototype

JICS modifications, Canvas course modifications, real student accounts, SSO/LTI, embedded iframe, official transcript ingestion, SIS synchronization, production deployment and real advisor calendar integration.
