MARIE ZENDEE — BERRY DESKTOP
Updated portfolio • September 2026

GET STARTED
Unzip the folder and open index.html. No installation, build command, account,
or external fonts are required. For deployment, upload the contents of this
folder to your existing static hosting project or repository root.

WHAT'S INSIDE
- A responsive creative desktop with a pinned glass header and simple top navigation.
- Six projects with filters, focused project windows, full artwork viewing,
  expandable windows, and previous/next navigation.
- An unfolding photography envelope with four photographs, thumbnail selection,
  touch swipes, arrow-key navigation, and a separate original-image viewer.
- Portfolio search: click Search, or press Control+K / Command+K.
- Midnight (default), Berry, Pearl, and Cream appearances; the last one chosen is remembered on that device.
- Calm motion, plus automatic respect for system reduced-motion preferences.
- Opt-in music and subtle click sounds. Sound off silences both.
- Both original portraits, personal identity boards, berry accents, Bootzy font,
  résumé download, and the original contact/social links.

IMAGES AND FILES
Every original image, icon, PDF, and font is preserved byte for byte at its
original path. Keep the entire assets folder, including the original files.
assets/previews contains additional WebP previews for faster page loading.
The HTML uses the originals as fallbacks; full image views open the originals.
Identity boards 1.png and 3.png are visible in the portfolio.

TO UPDATE CONTENT
- Page content, project cards, and page image references: index.html
- Project descriptions, photography metadata, and search entries: app.js
- Appearance, responsive layouts, and motion: style.css
- Opt-in audio: zendee-sound.js
- Résumé: assets/PATALINGHUG, MARIE ZENDEE CV 2026.pdf
Keep the static cards in index.html and the project records in app.js in sync.

DEPLOYMENT NOTES
The existing canonical address and sharing metadata remain set to:
https://berry-zendee.vercel.app/
If your production address changes, update those values in index.html.
The manifest supports a home-screen launch; no offline service worker is added.
Local file opening works for portfolio viewing. Clipboard permissions, audio,
and home-screen installation depend on the browser and hosting environment.
The copy-email button has a local copy fallback and a selectable address.

VERIFICATION
See QA-NOTES.txt for checks performed and remaining testing limits.

LATEST REFINEMENT
All navigation and header tools remain at the top while scrolling. Header height
and section offsets adjust to wrapping text and device safe areas. The photo
envelope is larger, with a clearer invitation and a roomier mobile layout.

CREATIVE UPDATE — SEPTEMBER 2026
New on the page, in the existing berry style:
- A moving text band under the hero that scrolls the disciplines, and a second
  softer band before the contact card. Both pause when you hover them and stop
  completely under Calm motion.
- "The Index" (section 02): a tidy numbered ledger of all six projects.
  Selecting any row opens that project, exactly like the cards above it.
  Beneath it, four counts that come straight from the page itself.
- "What I can make" (section 06): four service cards — brand identity,
  campaign & social, layout & print, photography. Edit the lists in index.html.
- A "Based in / Currently / Happiest making" note in the About section.
- Small delights: a berry reading-progress line at the top, petals drifting in
  the background, sections that fade up as you reach them, numbers that count
  themselves in, and a gentle tilt on the work cards.
All of it is decorative and switches itself off under Calm motion or a system
reduced-motion preference. New file: enhance.js. Nothing was removed; the
original images, projects, photographs, résumé and links are untouched.

WHERE TO EDIT THE NEW PARTS
- Marquee wording ........ index.html, the .marquee-group spans
- Index rows ............. index.html, the .ledger-row buttons (keep the
                           data-case value matching the project in app.js)
- The four counts ........ index.html, data-count on each .glance strong
- Services ............... index.html, the .service-grid articles
- Based in / Currently ... index.html, the .currently block
- Speed, colour, motion .. the CREATIVE LAYER block at the end of style.css

CUTE-BUT-PROFESSIONAL PASS — SEPTEMBER 2026
Tone brought closer to the original berry site, without losing the structure:
- Type system: Playfair Display for headings, Quicksand for everything you
  read, Caveat for the handwritten section leads. All three are self-hosted in
  assets/fonts (woff2) — no Google Fonts request, works offline.
  "Zendee" in the hero keeps her own Bootzy signature face.
- Every section now opens with a numbered chip and a handwritten line
  ("01 · stuff i made with love"), so it stays easy to scan and still sounds
  like her.
- Hero: her three roles type themselves out (Brand Assistant · Visual Content
  Developer · Graphic Artist) and a strawberry sits beside the wordmark.
- Work cards carry a small category tag; the marquee reads in her own words.
- About: the two certifications from her original site (UI/UX with Figma &
  Adobe XD, Professional Google Workspace Administrator) sit with the résumé
  in one card stack.
- Toolbox: Figma, Canva, Photoshop, Lightroom, HTML5, CSS3 with little icons.
- Contact: a short note form that opens the visitor's own mail app, pre-filled.
  No server, no third party — it is a mailto: link built from the two fields.
- Footer signs off "made with 💖 by Marie Zendee".
The About section, her portrait, and the order of the page are unchanged.

WHERE TO EDIT THE NEW PARTS
- Section leads ........... index.html, the .eyebrow .lead spans
- Typed roles ............. enhance.js, the roles array
- Certifications .......... index.html, the .cert-stack block
- Toolbox ................. index.html, the .toolbox list
- Note form recipient ..... enhance.js, the mailto address
- Fonts ................... assets/fonts + the @font-face block in style.css

MENU BAR AND TIDY-UP — SEPTEMBER 2026
- The header is now a soft floating capsule: rounded pill, her logo in a ring
  with a little bow, pill-shaped page links with a filled berry pill for the
  page you are on, a Manila chip that switches between a sun and a moon, and a
  Command-K hint beside the search button. On phones it becomes a rounded
  two-row card.
- Removed four repeats:
  * the hero lead no longer says "hihi" right above the "hihi, I'm Marie" title
  * the "designed with feeling" strip that sat on top of the scrolling band
  * the second marquee, which scrolled the hero paragraph word for word
  * the index ledger, which listed the same six projects as the cards above it
- Sections renumbered to 01-06 after the index came out.
The work cards, photographs, About, resume, certifications and contact are all
unchanged.

TRIMMED — SEPTEMBER 2026
Removed at her request:
- The "or send a quick note" form in the contact card. Say hello, Copy email
  and the address itself are still there.
- The whole "A little method. A lot of care." section, including the toolbox
  row and the Understand / Shape / Refine cards.
Sections are now numbered 01-05. The styles for the form, the toolbox and the
process cards are still in style.css, so any of them can be brought back by
pasting the markup again - see an earlier version of index.html in the zip
history, or ask and it can be restored.

FINAL PASS — SEPTEMBER 2026
- The search button is out of the menu bar. The search window itself still
  exists and still opens with Control+K / Command+K; to bring the button back,
  restore the #searchBtn markup in index.html (app.js already handles both).
- The résumé is now its own panel: a small paper-document mark with a PDF tag,
  her name, what she does, and the file details, with two clear actions —
  Open résumé (new tab) and Download.
- The services section ("Ways we can work together") was removed, so the page
  now runs 01 Selected work, 02 Through my lens, 03 A little berry personal,
  04 Behind the pixels, then Contact.
- The footer signs off "Designed & built in Manila".
- More room for text: the page shell is wider, the hero paragraph gets a full
  line, and the Based in / Currently / Happiest making cards now break evenly
  instead of leaving a single word on its own line.
