BERRY ZENDEE — PRODUCTION BUILD

This folder is intended to be merged into:
C:\Users\PC\OneDrive\Desktop\Zendee-WebPortfolio-main

IMPORTANT:
1. Keep your EXISTING /assets folder. It contains your real high-resolution portfolio images.
2. Copy these files into the project root:
   - index.html
   - style.css
   - app.js
   - zendee-sound.js
   - BootzyTM.ttf
   - manifest.webmanifest
3. Copy only the included photography files from this package into /assets if needed:
   - photo-lake.jpg
   - photo-shop.jpg
   - photo-peacock.jpg
   - photo-city.jpg
4. Do NOT overwrite your real versions of:
   - Zendee Prof pic.jpg
   - tienda.png
   - dylans-logo.jpg
   - avon-seamfree.jpg
   - promo-sheet.jpg
   - Paw-up.jpg
   - PATALINGHUG, MARIE ZENDEE CV 2026.pdf

The HTML references those exact filenames.

Before deployment:
- Open index.html locally or with VS Code Live Server.
- Confirm all images are present in /assets.
- Test the envelope, horizontal photo archive, expanded photo viewer, project case studies, mobile menu and sound toggle.
- Run Lighthouse once on desktop and mobile.
- Then commit and deploy to Vercel.

Performance design:
- requestAnimationFrame scroll updates
- IntersectionObserver reveal animations
- transform/opacity animation only for major motion
- no cursor particle trail
- no continuous scroll listener doing layout work
- audio remains opt-in
- prefers-reduced-motion supported
