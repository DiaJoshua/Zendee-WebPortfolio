Berry Zendee — V7 production build

What changed
- Work-first hero: the personal portrait is no longer repeated in the opening screen. The hero now previews actual portfolio work.
- The new book-studio portrait appears once, in the About section, with an editorial crop.
- Photography archive paging was tuned so one deliberate wheel/trackpad gesture advances one photo; swipe, drag, arrow buttons and keyboard arrows remain supported.
- The bottom-left music player is removed. Audio is controlled only from the navigation bar.
- Backgrounds are more neutral and section-specific. Berry pink remains an accent rather than the background of the entire portfolio.
- Decorative berries are limited to a few identity moments rather than repeated everywhere.
- Motion remains transform/opacity based and respects prefers-reduced-motion.

Installation
1. Back up your current Zendee-WebPortfolio-main folder.
2. Copy index.html, style.css, app.js, zendee-sound.js, BootzyTM.ttf, manifest.webmanifest and the icon files from this package into the project root.
3. Merge this package's assets folder into your existing assets folder.
4. KEEP your existing resume file:
   assets/PATALINGHUG, MARIE ZENDEE CV 2026.pdf
   The HTML already references it.
5. Test locally before committing to GitHub/Vercel.

Production notes
- No external JavaScript or CSS libraries are required.
- Images use local assets.
- The photo viewer supports wheel, touch swipe, mouse drag, arrow buttons and keyboard arrows.
- Audio is opt-in and browser-safe.
- Reduced-motion preferences are supported.
