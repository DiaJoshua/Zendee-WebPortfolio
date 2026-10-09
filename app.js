/* Marie Zendee — Berry Desktop. Buildless, dependency-free, and offline-friendly. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => motionQuery.matches || document.documentElement.classList.contains('calm-motion');
  const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const imagePath = filename => 'assets/' + filename;
  const previewPath = filename => 'assets/previews/' + filename.replace(/\.[^.]+$/, '.webp');
  const projects = [
    {"id": "daily-matcha", "title": "Daily Matcha Fix · Brand card", "type": "Product card", "img": "daily-matcha-card.jpg", "description": "The hero card of the Daily Matcha Fix identity: a hand-drawn whisk tied with a gingham bow, bold green lettering and a splash of pink that sets the playful tone.", "focus": "Brand card · illustration", "approach": "Hand-drawn whisk, chunky serif lettering, pink-and-green palette", "deliverable": "Brand card"},
    {"id": "daily-matcha-loyalty", "title": "Daily Matcha Fix · Loyalty card", "type": "Product card", "img": "daily-matcha-loyalty.jpg", "description": "A stamp-style loyalty card with eight matcha-bowl sticker slots. Customers fill every bowl to earn their reward, keeping the brand present with every visit.", "focus": "Loyalty card · layout", "approach": "Repeating sticker motif, deep matcha green, a short clear instruction", "deliverable": "Loyalty card"},
    {"id": "opening-hours", "title": "Kocha Matcha · Opening hours card", "type": "Product card", "img": "opening-hours-card.jpg", "description": "An in-store information card styled like a till receipt, sharing opening hours with a friendly thank-you note and a pink Kocha Matcha label.", "focus": "Product card · information design", "approach": "Receipt-inspired layout, monospaced type, soft matcha accents", "deliverable": "Opening-hours card"},
    {"id": "afterwave-front", "title": "Afterwave · Thank-you card, front", "type": "Product card", "img": "afterwave-front.jpg", "description": "The front of a swimwear thank-you card: a sunny yellow field, a bold blue AFTERWAVE wordmark and delicate pink bikini line art in the corner.", "focus": "Packaging insert · brand card", "approach": "Sunny yellow, ocean blue, light line-art details", "deliverable": "Thank-you card (front)"},
    {"id": "afterwave-back", "title": "Afterwave · Thank-you card, back", "type": "Product card", "img": "afterwave-back.jpg", "description": "The back of the card is laid out like a beach postcard, with a stamp illustration, a short thank-you message, a bikini-on-a-clothesline sketch and a handwritten “Enjoy”.", "focus": "Packaging insert · postcard layout", "approach": "Postcard structure, stamp motif, script lettering", "deliverable": "Thank-you card (back)"},
    {"id": "tienda", "title": "Tienda", "type": "Digital experience", "img": "tienda.png", "description": "A friendly e-commerce experience built around clear product discovery, easy navigation and a consistent, welcoming interface.", "focus": "UI/UX · visual system", "approach": "Clear structure, warm brand cues", "deliverable": "Responsive web experience"},
    {"id": "dylan", "title": "Dylan’s Little Closet", "type": "Brand identity", "img": "dylans-logo.jpg", "description": "A warm, playful brand identity for a children’s clothing concept, designed to feel friendly, memorable and easy to recognize.", "focus": "Logo · identity", "approach": "Friendly forms, a soft palette", "deliverable": "Brand mark · visual direction"},
    {"id": "avon", "title": "Avon Seamfree", "type": "Campaign design", "img": "avon-seamfree.jpg", "description": "A product-led campaign concept pairing clear messaging with polished visuals to make the Seamfree range feel approachable.", "focus": "Campaign composition", "approach": "Product-led hierarchy", "deliverable": "Campaign visual"},
    {"id": "promo", "title": "Promo Sheets", "type": "Print & social", "img": "promo-sheet.jpg", "description": "A promotional layout built to communicate offers quickly while keeping typography and visual hierarchy consistent.", "focus": "Layout design", "approach": "Information that scans clearly", "deliverable": "Promotional sheet"},
    {"id": "paw", "title": "Paw-Up", "type": "Awareness campaign", "img": "Paw-up.jpg", "description": "An awareness campaign with an approachable visual style that keeps the message clear, positive and easy to remember.", "focus": "Campaign poster", "approach": "Friendly storytelling", "deliverable": "Awareness creative"},
    {"id": "berry", "title": "A little berry · Monogram", "type": "Personal identity", "img": "1.png", "description": "The personal monogram: delicate pink lettering around a soft illustrated detail, the starting point for the whole personal identity.", "focus": "Personal identity · monogram", "approach": "Soft pinks, expressive lettering", "deliverable": "Monogram board"},
    {"id": "berry-about", "title": "A little berry · About board", "type": "Personal identity", "img": "2.png", "description": "An introduction board that carries the identity into text, pairing soft botanical details with a quiet, readable layout.", "focus": "Personal identity · layout", "approach": "Gentle type hierarchy, floral accents", "deliverable": "About board"},
    {"id": "berry-gardene", "title": "Gardene Theme · Portfolio cover", "type": "Personal identity", "img": "berry-gardene.jpg", "description": "A portfolio cover in a soft garden theme: watercolor florals frame a pink bow and a centered, elegant title.", "focus": "Cover design", "approach": "Symmetry, watercolor florals, refined serif type", "deliverable": "Portfolio cover"},
    {"id": "berry-cherry", "title": "Cherry on Top", "type": "Personal identity", "img": "berry-cherry.jpg", "description": "A bold poster exercise pairing a pink-bowed cherry illustration with oversized green type on a blush gradient.", "focus": "Poster design", "approach": "Big type, complementary red and green", "deliverable": "Poster"},
    {"id": "berry-valentine", "title": "Happy Valentine’s", "type": "Personal identity", "img": "berry-valentine.jpg", "description": "A romantic seasonal piece: a glossy red wax-seal heart holding a little lamb, finished with flowing script and a red bow.", "focus": "Seasonal graphic", "approach": "Rich reds, script lettering, playful details", "deliverable": "Greeting graphic"}
  ];
  const photographs = [
    {file:'photo-shop.jpg', title:'Found details', alt:'A green vintage shop filled with objects and plants'},
    {file:'photo-lake.jpg', title:'Still water', alt:'A portrait beside a calm lake beneath willow trees'},
    {file:'photo-peacock.jpg', title:'Quiet encounters', alt:'A peacock and a person in a green garden'},
    {file:'photo-city.jpg', title:'City / water', alt:'A city skyline beside the water in the evening'}
  ];
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Session preferences still work. */ } }
  };
  function theme(value) {
    const choice = ['berry','pearl','midnight'].includes(value) ? value : 'berry';
    document.body.dataset.theme = choice;
    $$('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === choice)));
    $('meta[name="theme-color"]').content = {berry:'#fff2f7',pearl:'#f3f4f6',midnight:'#211d28'}[choice];
  }
  theme(storage.get('mz-theme'));
  const calmInput = $('#calmMotion');
  let chosenCalm = storage.get('mz-calm') === 'true';
  function syncMotion() {
    document.documentElement.classList.toggle('calm-motion', chosenCalm || motionQuery.matches);
    calmInput.checked = chosenCalm || motionQuery.matches;
    calmInput.disabled = motionQuery.matches;
  }
  syncMotion();
  motionQuery.addEventListener?.('change', syncMotion);
  calmInput.addEventListener('change', () => { chosenCalm = calmInput.checked; storage.set('mz-calm', String(chosenCalm)); syncMotion(); });
  $$('[data-theme-choice]').forEach(button => button.addEventListener('click', () => {theme(button.dataset.themeChoice);storage.set('mz-theme', button.dataset.themeChoice);}));

  // Native dialogs provide focus containment, inert backgrounds, and nested modal behavior.
  const dialogStack = [];
  const openers = new WeakMap();
  let previousOverflow = '';
  function openDialog(dialog) {
    if (dialog.open) return;
    if (dialog.id !== 'galleryDialog' && envelopeTimer !== null) {
      clearTimeout(envelopeTimer); envelopeTimer = null; $('#envelope').classList.remove('open');
    }
    openers.set(dialog, document.activeElement);
    if (!dialogStack.length) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
    dialog.showModal();
    dialogStack.push(dialog);
  }
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      const index = dialogStack.indexOf(dialog);
      if (index !== -1) dialogStack.splice(index, 1);
      if (!dialogStack.length) document.body.style.overflow = previousOverflow;
      const opener = openers.get(dialog);
      const activeDialog = dialogStack[dialogStack.length - 1];
      if (opener?.isConnected && (!activeDialog || activeDialog.contains(opener))) opener.focus({preventScroll:true});
      if (dialog.id === 'galleryDialog') $('#envelope').classList.remove('open');
    });
    // Only the backdrop closes a dialog; padding and scrollbars are not backdrops.
    let backdropDown = false;
    const outside = event => { const r = dialog.getBoundingClientRect();return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom; };
    dialog.addEventListener('pointerdown', event => {backdropDown = event.target === dialog && outside(event);});
    dialog.addEventListener('click', event => {if (event.target === dialog && backdropDown && outside(event)) dialog.close();backdropDown = false;});
  });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $('#settingsBtn').addEventListener('click', () => openDialog($('#settingsDialog')));

  let toastTimer;
  function toast(message) { clearTimeout(toastTimer);const node=$('#toast');node.textContent=message;node.classList.add('visible');toastTimer=setTimeout(()=>node.classList.remove('visible'),2800); }

  // Retain every original image. A missing optional preview falls back to its original.
  function monitorImage(image, fallback) {
    const recover = () => {
      if (fallback && image.dataset.fallback !== fallback) {
        image.dataset.fallback = fallback;
        const picture = image.closest('picture');
        if (picture) $$('source', picture).forEach(source => source.remove());
        image.src = fallback;
      } else {
        image.classList.add('image-unavailable');
        image.alt = 'Image could not load. ' + (image.dataset.originalAlt || image.alt);
      }
    };
    image.dataset.originalAlt = image.alt;
    image.onerror = recover;
    if (image.complete && image.currentSrc && image.naturalWidth === 0) recover();
  }
  $$('img[src]').forEach(image => monitorImage(image, image.getAttribute('src')));
  function setImage(image, filename, alt, original = false) {
    image.classList.remove('image-unavailable');
    delete image.dataset.fallback;
    image.alt = alt;
    image.src = original ? imagePath(filename) : previewPath(filename);
    monitorImage(image, imagePath(filename));
  }
  function openImage(src, alt) {
    const image = $('#fullImage');
    image.src = src;
    image.alt = alt;
    delete image.dataset.fallback;
    monitorImage(image, src);
    $('#imageCaption').textContent = alt;
    $('#originalLink').href = src;
    openDialog($('#imageDialog'));
  }
  $$('[data-image]').forEach(button => button.addEventListener('click', () => openImage(button.dataset.image, button.dataset.alt)));

  // Projects are one consistent collection, so filters, search, and next/previous agree.
  let caseIndex = 0;
  function renderCase(index) {
    caseIndex = (index + projects.length) % projects.length;
    const project = projects[caseIndex];
    const art = (filename, alt, cls = '') => `<button class="${cls}" data-full-image="${escapeHTML(imagePath(filename))}" data-full-alt="${escapeHTML(alt)}" aria-label="Expand ${escapeHTML(alt)}"><img src="${escapeHTML(previewPath(filename))}" data-original="${escapeHTML(imagePath(filename))}" alt="${escapeHTML(alt)}" decoding="async"></button>`;
    $('#caseContent').innerHTML = `<div class="case-intro"><div><p class="eyebrow">${escapeHTML(project.type)}</p><h2 id="caseTitle">${escapeHTML(project.title)}</h2></div></div><div class="case-main-image">${art(project.img,project.title)}<span>Select artwork to see the full original.</span></div><p class="case-description">${escapeHTML(project.description)}</p><dl class="case-facts"><div><dt>Focus</dt><dd>${escapeHTML(project.focus)}</dd></div><div><dt>Approach</dt><dd>${escapeHTML(project.approach)}</dd></div><div><dt>Deliverable</dt><dd>${escapeHTML(project.deliverable)}</dd></div></dl>`;
    $$('img', $('#caseContent')).forEach(image => monitorImage(image, image.dataset.original));
    $$('[data-full-image]', $('#caseContent')).forEach(button => button.addEventListener('click', () => openImage(button.dataset.fullImage, button.dataset.fullAlt)));
    $('#caseCounter').textContent = String(caseIndex+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');
    $('#caseDialog').scrollTop = 0;
  }
  function openCase(id) { const index=projects.findIndex(project=>project.id===id);if(index<0)return;renderCase(index);openDialog($('#caseDialog')); }
  $$('[data-case]').forEach(button => button.addEventListener('click', () => openCase(button.dataset.case)));
  $('#casePrev').addEventListener('click', () => renderCase(caseIndex-1));
  $('#caseNext').addEventListener('click', () => renderCase(caseIndex+1));
  $('#caseExpand').addEventListener('click', event => { const expanded=$('#caseDialog').classList.toggle('expanded');event.currentTarget.setAttribute('aria-pressed',String(expanded));event.currentTarget.setAttribute('aria-label',expanded?'Restore project window':'Expand project window'); });
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    $$('[data-filter]').forEach(item => item.setAttribute('aria-pressed',String(item===button)));
    let count = 0;
    $$('.project-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter;if(!card.hidden)count++;});
    $('#workCount').textContent = count+' '+(count===1?'project':'projects');
  }));
  $('#workCount').setAttribute('aria-live','polite');

  let photoIndex = 0, envelopeTimer = null;
  function showPhoto(index) {
    photoIndex = (index + photographs.length) % photographs.length;
    const photo = photographs[photoIndex];
    setImage($('#galleryImage'),photo.file,photo.alt);
    $('#photoTitle').textContent=photo.title;
    $('#photoCount').textContent=String(photoIndex+1).padStart(2,'0')+' / 04';
    $$('[data-photo]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.photo)===photoIndex)));
    $('#galleryExpand').setAttribute('aria-label','Expand '+photo.title);
  }
  function openGallery(index=0, animate=false) {
    if(envelopeTimer!==null || $('#galleryDialog').open)return;
    $('#envelope').classList.add('open');
    if(!animate || reduced()) {showPhoto(index);openDialog($('#galleryDialog'));return;}
    envelopeTimer=setTimeout(()=>{envelopeTimer=null;showPhoto(index);openDialog($('#galleryDialog'));},460);
  }
  $('#envelope').addEventListener('click',()=>openGallery(0,true));
  $$('[data-gallery]').forEach(button=>button.addEventListener('click',()=>openGallery(Number(button.dataset.gallery))));
  $$('[data-photo]').forEach(button=>button.addEventListener('click',()=>showPhoto(Number(button.dataset.photo))));
  $('#photoPrev').addEventListener('click',()=>showPhoto(photoIndex-1));
  $('#photoNext').addEventListener('click',()=>showPhoto(photoIndex+1));
  let swipeStart=null,swiped=false;
  const stage=$('#galleryStage');
  stage.addEventListener('pointerdown',event=>{if(event.isPrimary){swipeStart={x:event.clientX,y:event.clientY,id:event.pointerId};swiped=false;}},{passive:true});
  stage.addEventListener('pointerup',event=>{
    if(!swipeStart || event.pointerId!==swipeStart.id)return;
    const dx=event.clientX-swipeStart.x,dy=event.clientY-swipeStart.y;
    swipeStart=null;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.3){swiped=true;showPhoto(photoIndex+(dx<0?1:-1));}
  },{passive:true});
  stage.addEventListener('pointercancel',()=>{swipeStart=null;swiped=false;});
  stage.addEventListener('dragstart',event=>event.preventDefault());
  $('#galleryExpand').addEventListener('click',event=>{if(swiped && event.detail!==0){swiped=false;return;}const photo=photographs[photoIndex];openImage(imagePath(photo.file),photo.alt);});

  const searchItems = [
    ...projects.map(project=>({title:project.title,subtitle:project.type,keywords:project.description,icon:'✳',action:()=>openCase(project.id)})),
    ...photographs.map((photo,index)=>({title:photo.title,subtitle:'Photography',keywords:'photo landscape moment '+photo.alt,icon:'▧',action:()=>openGallery(index)})),
    ...[{title:'Home',target:'top'},{title:'Selected work',target:'visual'},{title:'Photography collection',target:'photography'},{title:'Personal identity',target:'branding'},{title:'About Marie',target:'about'},{title:'Contact & social links',target:'contact'}].map(page=>({title:page.title,subtitle:'Go to page section',keywords:page.target,icon:'↗',action:()=>goTo(page.target)}))
  ];
  function goTo(id) {
    const section=document.getElementById(id);
    if(!section)return;
    location.hash=id;
    section.setAttribute('tabindex','-1');
    section.focus({preventScroll:true});
    section.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});
  }
  function renderSearch() {
    const query=$('#searchInput').value.trim().toLocaleLowerCase();
    const matches=searchItems.filter(item=>(item.title+' '+item.subtitle+' '+item.keywords).toLocaleLowerCase().includes(query));
    const results=$('#searchResults');results.replaceChildren();
    if(!matches.length){const empty=document.createElement('p');empty.className='search-empty';empty.textContent='No matches yet. Try “Tienda”, “photos”, or “contact”.';results.append(empty);return;}
    matches.forEach(item=>{
      const button=document.createElement('button');button.className='search-result';button.type='button';
      button.innerHTML=`<span class="result-icon" aria-hidden="true">${escapeHTML(item.icon)}</span><span><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.subtitle)}</small></span><span aria-hidden="true">↗</span>`;
      button.addEventListener('click',()=>{
        // Wait for native close/focus restoration before handing focus to the new destination.
        const search=$('#searchDialog');
        search.addEventListener('close',()=>item.action(),{once:true});
        search.close();
      });results.append(button);
    });
  }
  function openSearch() {$('#searchInput').value='';renderSearch();openDialog($('#searchDialog'));$('#searchInput').focus();}
  $('#searchBtn')?.addEventListener('click',openSearch);
  $('#searchInput').addEventListener('input',renderSearch);
  $('#searchDialog').addEventListener('keydown',event=>{
    if(!['ArrowDown','ArrowUp','Enter'].includes(event.key))return;
    const buttons=$$('.search-result');if(!buttons.length)return;
    const index=buttons.indexOf(document.activeElement);
    if(event.key==='Enter'){if(document.activeElement===$('#searchInput')){event.preventDefault();buttons[0].click();}return;}
    event.preventDefault();
    const next=event.key==='ArrowDown'?(index+1)%buttons.length:(index<0?buttons.length-1:(index-1+buttons.length)%buttons.length);
    buttons[next].focus();
  });
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){
      event.preventDefault();
      if($('#searchDialog').open)$('#searchDialog').close();
      else if(!dialogStack.length)openSearch();
    }
    if(event.key==='Escape' && envelopeTimer!==null){clearTimeout(envelopeTimer);envelopeTimer=null;$('#envelope').classList.remove('open');}
    if(dialogStack[dialogStack.length-1]===$('#galleryDialog') && ['ArrowLeft','ArrowRight'].includes(event.key)){
      event.preventDefault();showPhoto(photoIndex+(event.key==='ArrowRight'?1:-1));
    }
  });

  $('#copyEmail').addEventListener('click',async()=>{
    const email='mariezendee@gmail.com';let copied=false;
    try {if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(email);copied=true;}}catch{/* Try the local-file-compatible fallback. */}
    if(!copied){
      const text=document.createElement('textarea');text.value=email;text.setAttribute('readonly','');text.style.cssText='position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.append(text);text.select();
      try{copied=document.execCommand('copy');}catch{/* Show the selectable address below. */}
      text.remove();$('#copyEmail').focus({preventScroll:true});
    }
    toast(copied?'Email copied. Let’s make something lovely.':'Select the email address below to copy it.');
    if(!copied){const range=document.createRange();range.selectNodeContents($('.email-address'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);}
  });
  const updateClock=()=>{try{$('#clock').textContent=new Intl.DateTimeFormat('en',{timeZone:'Asia/Manila',hour:'numeric',minute:'2-digit'}).format(new Date());}catch{$('#clock').textContent='Philippines';}$('#year').textContent=new Date().getFullYear();};
  updateClock();
  let clockTimer=setInterval(updateClock,60000);
  document.addEventListener('visibilitychange',()=>{clearInterval(clockTimer);if(!document.hidden){updateClock();clockTimer=setInterval(updateClock,60000);}});

  // Measure the pinned header so wrapped text and safe areas never hide anchor targets.
  const header = $('.menubar');
  const navigationLinks = $$('[data-section]', $('.site-nav'));
  const sections = ['top','visual','photography','branding','about','contact'].map(id => document.getElementById(id));
  let headerHeight = 68, scrollFrame = 0;
  function measureHeader() {
    const measured = Math.ceil(header.getBoundingClientRect().height);
    if (measured > 0 && measured !== headerHeight) {
      headerHeight = measured;
      document.documentElement.style.setProperty('--header-height', measured + 'px');
    }
  }
  function updateNavigation() {
    scrollFrame = 0;
    let active = 'top';
    const marker = headerHeight + 44;
    for (const section of sections) {
      if (section.id !== 'top' && section.getBoundingClientRect().top <= marker) active = section.id;
    }
    // A short final section should still select Contact at the end of the page.
    if (window.scrollY > 0 && window.scrollY + innerHeight >= document.documentElement.scrollHeight - 3) active = 'contact';
    if (active === 'branding') active = 'visual';
    navigationLinks.forEach(link => {
      if (link.dataset.section === active) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleNavigation() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation);
  }
  measureHeader();
  addEventListener('scroll', scheduleNavigation, {passive:true});
  addEventListener('resize', () => { measureHeader(); scheduleNavigation(); }, {passive:true});
  if ('ResizeObserver' in window) {
    const headerObserver = new ResizeObserver(() => { measureHeader(); scheduleNavigation(); });
    headerObserver.observe(header);
  }
  updateNavigation();
})();
