# Evan Shattenkirk portfolio

Public portfolio at https://evanshattenkirk.github.io/. Buildless HTML, CSS, and JavaScript, served by GitHub Pages from `main` at the repository root.

## Editing

- `index.html`: content, semantic landmarks, native disclosures, captioned media, and project imagery.
- `styles.css`: responsive layout, system light/dark colors, print styles, and reduced-motion support. Type uses Georgia and Helvetica/system fallbacks; no web fonts or remote scripts.
- `site.js`: mobile navigation, selected section state, interface gallery, native dialog focus return, and video chapters.
- `assets/`: retained resume, fictional appraisal/pipeline media, and project visuals.

Use a static server for local preview. A server with HTTP byte-range support is needed to test video chapter seeking. No package installation or build step is required.

## Visual provenance and scope

- AppraisalIQ and IG Pipeline images/videos are explicitly fictional interface recreations, retained from the prior portfolio. They do not expose employer records.
- Pastefront images are the repository's example store/dashboard assets, showing sample data.
- AgentDesk's screenshot is from the public Trading-Agent repository, explicitly in PAPER mode. It is not a performance claim.
- Space Planner's image is a capture of the public application's built-in Sample bedroom, not a user's personal plan.
- TAP-EI is an original, source-grounded architecture illustration. Its foundation is in development with synthetic data and is not deployed for real use. It is not a screenshot.

Project visuals can be enlarged with a native dialog. Keep captions and status qualifications visible when editing. Keep the distinction between commercial review turnaround and residential report-processing time. Preserve human sign-off and in-development qualifications.

## Verification

Before publishing, check internal anchors and local asset paths, run `node --check site.js`, and inspect desktop, narrow phone, standard phone, and tablet layouts in Chrome. Check gallery selection/enlargement, Escape and focus return, mobile menu open/close, native disclosures, direct video links, chapter seeking, pause-on-close, captions, and the resume link. Keep page copy, metadata, captions, and SVG text free of em dashes.

The site supports reduced motion, system dark mode, no-JavaScript navigation/image fallbacks, and native media controls. Publication is a normal fast-forward push to `main`; do not rewrite repository history.
