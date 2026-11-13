# Star Track: Visual Design Direction and UI Specification

**Status:** Approved inspiration / proposed design direction, not a completed UI.  
**Reference:** `docs/references/aeline-design-inspiration.png` (user-provided Aeline webpage screenshot).  
**Principle:** Borrow *composition and visual energy*, never copy the reference's brand, layout pixel-for-pixel, assets, texts, imagery, or metrics.

## 1. Creative concept
**Star Track: Find your way forward.** A premium, optimistic academic planning product where AI assistance and student progress feel clear, trustworthy, and motivating. Combine the reference's full-bleed colorful hero, generous whitespace, layered floating cards, rounded geometry and carefully controlled typography with a university-appropriate green/gold visual language. Star Track is an academic tool, **not an AI consulting agency**.

## 2. Visual identity
- Primary Evergreen `#173F35`, deep forest `#102B25`, Legacy Gold `#D7AD56`, warm ivory `#F7F4EB`, mint `#B8D9C9`, ink `#263641`, muted text `#5E7068`, borders `#DFE8E1`.
- Homepage hero: deep green to brighter emerald gradient, gold and mint glow accents, subtle atmospheric light/abstract star-path or orbit motifs. Do **not** recreate the reference's blue sky/cloud photography literally.
- Use off-white surfaces outside the hero. Reserve gold for important highlights and CTA details; keep core reading text dark green/ink for contrast.
- Typography: distinctive modern display sans-serif for large headings, clear accessible sans-serif for interface/body. Use safe licensed/free font fallbacks; no assumption of proprietary fonts.
- Visual motif: a star, orbit, path, milestone dots and directional lines. Aim for editorial polish, not astronomy-themed clutter. Never imply academic progress has been verified against official university records.

## 3. Landing page layout (public marketing entry)
1. **Header:** Original Star Track wordmark / star symbol at left; About, Features, How it works; `Student Sign in` prominent; `Advisor Sign in` accessible without exposing roles via signup. Optional link back to MyPanther. No false PSU endorsement or trademark/logo without permission.
2. **Hero:** Oversized, 2-line headline such as **“Your future is closer than you think.”**; supporting text: “Explore degree requirements, track your plan, and connect with an academic advisor in one place.” Primary `Explore Star Track`/`Sign in`; secondary `See how it works`. Design for desktop first but adapt cleanly to mobile.
3. **Floating product preview cards:** An intentional semi-3D, gently staggered composition representing **Ask Star Track AI**, **Degree progress**, and **Book an advisor**. Cards should preview actual product UI, with clearly labeled **sample** values, not invented testimonials or results. Decorative tilt/perspective may be applied only to noninteractive cards; actual controls remain flat and readable.
4. **Three feature sections:** Short, specific student benefit statements with small interface previews; no generic consulting copy.
5. **How it works:** Ask a question -> review self-reported progress -> book advising. Explain sources and limits.
6. **Trust note and footer:** Prototype disclaimer: source-grounded guidance is informational; self-reported checklists are not official degree audits. Footer may link to JICS through a public URL without suggesting an active integration.

## 4. Authenticated application UX (distinct from marketing landing)
- Do **not** recreate a cinematic marketing hero on every dashboard screen. After login, prioritize a usable product with compact app header and predictable navigation.
- **Student dashboard:** Welcome headline, three prominent action cards, self-reported progress summary, next appointment, and contextual citation/trust labels.
- **AI advising screen:** Clear conversation column, prompt field, sourced answer cards with document title and section/page, `insufficient evidence` state, advisor CTA. Avoid fake chat transcripts.
- **Degree progress screen:** Grouped categories, checkboxes, progress bars with explicit `self-reported` tag, accessible labels and remaining counts.
- **Appointments screen:** Available slots and confirmed bookings, cancellation/reschedule flows, form validation, conflict/errors and empty states.
- **Advisor dashboard:** Practical scheduling interface and bookings list; no decorative cards that compromise legibility.
- **Login:** Accessible separate student/advisor experience using the same secure server-side authorization; do not imply JICS SSO.

## 5. Component design tokens
- Large visual cards: ~20-28px radius; application cards ~12-18px radius; buttons rounded ~10-14px or pill for primary hero actions.
- Subtle shadows + thin borders; no heavy glassmorphism that reduces text legibility.
- Spacing system based on 4/8px increments. Maximum marketing content width ~1200px; dashboard content width responsive to view.
- Use fluid headline scale with CSS `clamp()`. Typical body 16px minimum on mobile. Buttons/inputs target >=44px touch height.
- Breakpoints as needed: mobile <640px, tablet 640-1023px, desktop >=1024px. On mobile, stack preview cards in a readable arrangement rather than shrinking them into tiny perspective thumbnails.
- Motion: optional short hover lift or reveal, under 250ms; honor `prefers-reduced-motion`. Never hide required information in motion-only states.
- Accessibility: WCAG AA contrast target, visible focus rings, semantic headings, keyboard operation, clear input errors; decorative stars aria-hidden.

## 6. Copy and data integrity
- Never reproduce the Aeline name, slogans, `520k+` metrics, client logos, template CTA or testimonial cards.
- Do not invent PSU adoption, graduation statistics, users, AI accuracy, affiliations or endorsement.
- Use realistic but plainly marked **sample** course progress and availability only when demonstrating UI. Never invent official prerequisites.
- Favor confidence and clarity over flashy claims. Example UI captions: `Sample degree checklist`, `Answers grounded in approved catalog sources`, `Appointment availability (demo)`.

## 7. Cursor implementation instructions
1. Read this file and the master PRD before editing frontend.
2. Create a reusable tokens file/theme and a small component library for Buttons, Cards, Badges, Inputs, Navigation and SourceCitation.
3. Build the public landing page separately from student/advisor routes; keep authentication and feature logic consistent with architecture docs.
4. The image is a **visual mood reference only**; do not trace/recreate it, scrape imagery, or use copyrighted source assets in Star Track.
5. Implement responsive views, keyboard accessibility, loading/error/empty states, and role-aware navigation. Use CSS shapes/SVG icons for product previews unless authorized imagery is provided.
6. Show visual progress to team in Cursor before extending to backend modules. Do not mark design approved automatically.
7. Include UI tests or review steps in the test plan, and do not claim to have tested without executing checks.

## 8. Design review checklist
- [ ] Visitors can recognize that this is academic advising, not a consulting website.
- [ ] Landing hero and floating product previews echo the reference's visual impact without copying it.
- [ ] Brand is distinctly Star Track and PSU-inspired without unauthorized official logos.
- [ ] Product dashboards are simpler and more task-focused than the landing page.
- [ ] No manufactured social proof, metrics or university integration claims.
- [ ] App can open from a JICS/Canvas external link and still requires its own login.
- [ ] Works on desktop, tablet and mobile with keyboard and screen reader support.
