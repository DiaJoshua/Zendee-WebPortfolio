(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body=document.body;

  const boot=$('#boot'), bootProgress=$('#bootProgress');
  const bootStart=performance.now();
  let seenPortfolio=false;try{seenPortfolio=sessionStorage.getItem('mz-seen')==='1'}catch(e){};
  const MIN_BOOT_TIME=reduced?80:(seenPortfolio?560:1450);
  let bootValue=8, bootDone=false, bootTimer=0, pageReady=false;

  const setBootProgress=(v)=>{
    bootValue=Math.max(0,Math.min(100,v));
    if(bootProgress)bootProgress.style.width=bootValue+'%';
  };

  const revealSite=()=>{
    if(bootDone)return;
    bootDone=true;
    try{sessionStorage.setItem('mz-seen','1')}catch(e){};
    clearInterval(bootTimer);
    setBootProgress(100);
    boot?.classList.add('loading-complete');

    if(reduced){
      document.body.classList.add('site-ready');
      boot?.classList.add('hide');
      return;
    }

    setTimeout(()=>boot?.classList.add('exit'),220);
    setTimeout(()=>document.body.classList.add('site-ready'),420);
    setTimeout(()=>boot?.classList.add('hide'),1120);
  };

  const tryFinishBoot=()=>{
    if(!pageReady||bootDone)return;
    const elapsed=performance.now()-bootStart;
    const remaining=Math.max(0,MIN_BOOT_TIME-elapsed);
    setTimeout(revealSite,remaining);
  };

  const trackedImages=[...document.images].filter(img=>!img.loading||img.loading!=='lazy');
  const totalTracked=Math.max(1,trackedImages.length);
  let loadedTracked=0;

  const imageSettled=()=>{
    loadedTracked++;
    const imagePart=(loadedTracked/totalTracked)*68;
    setBootProgress(Math.max(bootValue,12+imagePart));
  };

  trackedImages.forEach(img=>{
    if(img.complete) imageSettled();
    else{
      img.addEventListener('load',imageSettled,{once:true});
      img.addEventListener('error',imageSettled,{once:true});
    }
  });

  setBootProgress(10);

  bootTimer=setInterval(()=>{
    if(bootDone)return;
    const elapsed=performance.now()-bootStart;
    const timePart=Math.min(1,elapsed/MIN_BOOT_TIME);
    const ceiling=pageReady?96:88;
    const target=18+(ceiling-18)*timePart;
    if(bootValue<target)setBootProgress(bootValue+Math.max(.35,(target-bootValue)*.08));
  },90);

  if(document.readyState==='complete'){
    pageReady=true;
    tryFinishBoot();
  }else{
    addEventListener('load',()=>{
      pageReady=true;
      setBootProgress(Math.max(bootValue,92));
      tryFinishBoot();
    },{once:true});
  }

  const nav=$('#nav'), progress=$('#progressBar'), heroShowcase=$('.hero-showcase'), photoBackdrop=$('.photo-backdrop img'); let scrollRAF=0;
  const updateScroll=()=>{
    const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
    if(progress)progress.style.width=(max?y/max*100:0)+'%';
    nav?.classList.toggle('scrolled',y>24);
    if(!reduced){
      if(heroShowcase){
        const hero=$('.hero');
        const hp=Math.max(0,Math.min(1,y/Math.max(1,hero?.offsetHeight||innerHeight)));
        heroShowcase.style.setProperty('--hero-shift',`${hp*22}px`);
      }
      if(photoBackdrop){
        const sec=$('#photography');
        const r=sec?.getBoundingClientRect();
        if(r){
          const p=Math.max(-1,Math.min(1,(innerHeight/2-(r.top+r.height/2))/Math.max(1,innerHeight)));
          photoBackdrop.style.setProperty('--photo-y',`${p*22}px`);
        }
      }
    }
    scrollRAF=0
  };
  addEventListener('scroll',()=>{if(!scrollRAF)scrollRAF=requestAnimationFrame(updateScroll)},{passive:true}); updateScroll();

  const revealIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');revealIO.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -8% 0px'});
  $$('.reveal').forEach(el=>revealIO.observe(el));

  const sections=$$('.page-section[id]'); const navAnchors=$$('.nav-links a');
  const sectionIO=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(!e.isIntersecting)return;
    navAnchors.forEach(a=>{
      const current=a.getAttribute('href')==='#'+e.target.id;
      a.classList.toggle('active',current);
      if(current)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
    });
  }),{rootMargin:'-34% 0px -58% 0px',threshold:0});
  sections.forEach(s=>sectionIO.observe(s));

  const menu=$('#menuBtn'), links=$('#navLinks'), navBackdrop=$('#navBackdrop');
  const closeMenu=()=>{
    links?.classList.remove('open');
    body.classList.remove('menu-open');
    menu?.setAttribute('aria-expanded','false');
    navBackdrop?.setAttribute('aria-hidden','true');
  };
  const openMenu=()=>{
    links?.classList.add('open');
    body.classList.add('menu-open');
    menu?.setAttribute('aria-expanded','true');
    navBackdrop?.setAttribute('aria-hidden','false');
    $('a',links)?.focus({preventScroll:true});
  };
  menu?.addEventListener('click',()=>links?.classList.contains('open')?closeMenu():openMenu());
  navBackdrop?.addEventListener('click',closeMenu);
  $$('#navLinks a').forEach(a=>a.addEventListener('click',closeMenu));

  const roles=['Graphic Artist','Visual Designer','Photography & Brand Support'];
  const type=$('#typeRole'); let role=0,char=roles[0].length,del=false,typeTimer=0;
  const tick=()=>{if(!type||reduced)return;const word=roles[role];type.textContent=word.slice(0,char);let wait=del?38:68;if(!del&&char===word.length){del=true;wait=1500}else if(del&&char===0){del=false;role=(role+1)%roles.length;wait=300}char+=del?-1:1;typeTimer=setTimeout(tick,wait)}; tick();

  const visualFrames=$$('.visual-frame'), visualTabs=$$('.visual-tabs button'), visualTitle=$('#visualTitle'), visualDesc=$('#visualDesc'), chapter=$('.chapter-index'), visualLink=$('.visual-copy [data-case]');
  function showVisual(key){const idx=visualFrames.findIndex(f=>f.dataset.visual===key);visualFrames.forEach(f=>f.classList.toggle('active',f.dataset.visual===key));visualTabs.forEach(b=>b.classList.toggle('active',b.dataset.show===key));const f=visualFrames[idx];if(!f)return;visualTitle.textContent=f.dataset.title;visualDesc.textContent=f.dataset.desc;chapter.textContent=String(idx+1).padStart(2,'0')+' / 04';visualLink.dataset.case=key}
  visualTabs.forEach(b=>b.addEventListener('click',()=>showVisual(b.dataset.show)));

  let lastFocus=null,activeTrap=null;
  const focusables=root=>$$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',root).filter(el=>!el.hidden&&el.offsetParent!==null);
  const activateTrap=(root,initial)=>{
    lastFocus=document.activeElement;
    activeTrap=root;
    (initial||focusables(root)[0])?.focus({preventScroll:true});
  };
  const releaseTrap=()=>{
    activeTrap=null;
    if(lastFocus?.focus)lastFocus.focus({preventScroll:true});
    lastFocus=null;
  };
  addEventListener('keydown',e=>{
    if(e.key==='Tab'&&activeTrap){
      const list=focusables(activeTrap);if(!list.length)return;
      const first=list[0],last=list[list.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
  const lock=v=>body.classList.toggle('lock',v);
  const envelope=$('#envelope'), photoModal=$('#photoModal'), photoClose=$('#photoClose'), photoStrip=$('#photoStrip'), slides=$$('.photo-slide'), photoCount=$('#photoCount'), photoBar=$('#photoBar');
  function openPhotos(){envelope?.classList.add('open');setTimeout(()=>{photoModal?.classList.add('open');photoModal?.setAttribute('aria-hidden','false');lock(true);activateTrap(photoModal,photoClose);photoStrip?.focus({preventScroll:true});updatePhotoProgress()},reduced?0:440)}
  function closePhotos(){photoModal?.classList.remove('open');photoModal?.setAttribute('aria-hidden','true');lock(false);releaseTrap();setTimeout(()=>envelope?.classList.remove('open'),reduced?0:260)}
  envelope?.addEventListener('click',openPhotos); photoClose?.addEventListener('click',closePhotos); photoModal?.addEventListener('click',e=>{if(e.target===photoModal)closePhotos()});
  let photoRAF=0,activePhoto=0,wheelLock=false;
  function nearestPhoto(){if(!photoStrip||!slides.length)return 0;const center=photoStrip.scrollLeft+photoStrip.clientWidth/2;let best=0,dist=Infinity;slides.forEach((s,i)=>{const c=s.offsetLeft+s.offsetWidth/2,d=Math.abs(c-center);if(d<dist){dist=d;best=i}});return best}
  function updatePhotoProgress(){if(!photoStrip||!slides.length)return;activePhoto=nearestPhoto();slides.forEach((s,i)=>s.classList.toggle('active',i===activePhoto));photoCount.textContent=String(activePhoto+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');photoBar.style.width=((activePhoto+1)/slides.length*100)+'%';photoRAF=0}
  function goPhoto(index){if(!photoStrip||!slides.length)return;activePhoto=Math.max(0,Math.min(slides.length-1,index));slides[activePhoto].scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'});requestAnimationFrame(updatePhotoProgress)}
  $('#photoPrev')?.addEventListener('click',()=>goPhoto(activePhoto-1));
  $('#photoNext')?.addEventListener('click',()=>goPhoto(activePhoto+1));
  photoStrip?.addEventListener('scroll',()=>{if(!photoRAF)photoRAF=requestAnimationFrame(updatePhotoProgress)},{passive:true});
  photoStrip?.addEventListener('wheel',e=>{const dominant=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;if(Math.abs(dominant)<6)return;e.preventDefault();if(wheelLock)return;wheelLock=true;goPhoto(activePhoto+(dominant>0?1:-1));setTimeout(()=>{wheelLock=false},reduced?60:180)},{passive:false});
  let drag=false,dragMoved=false,startX=0,startLeft=0;
  photoStrip?.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag=true;dragMoved=false;startX=e.clientX;startLeft=photoStrip.scrollLeft;photoStrip.setPointerCapture(e.pointerId)}});
  photoStrip?.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-startX;if(Math.abs(dx)>5)dragMoved=true;photoStrip.scrollLeft=startLeft-dx});
  function endDrag(){if(!drag)return;drag=false;const target=nearestPhoto();requestAnimationFrame(()=>goPhoto(target));setTimeout(()=>{dragMoved=false},0)}
  photoStrip?.addEventListener('pointerup',endDrag); photoStrip?.addEventListener('pointercancel',endDrag);
  photoStrip?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();goPhoto(activePhoto+1)}else if(e.key==='ArrowLeft'){e.preventDefault();goPhoto(activePhoto-1)}});

  const viewer=$('#viewer'),viewerImg=$('#viewerImg');
  slides.forEach(s=>s.addEventListener('click',()=>{if(dragMoved)return;viewerImg.src=s.dataset.photo;viewerImg.alt=$('img',s).alt;viewer.classList.add('open');viewer.setAttribute('aria-hidden','false');activateTrap(viewer,$('#viewerClose'))}));
  function closeViewer(){viewer?.classList.remove('open');viewer?.setAttribute('aria-hidden','true');releaseTrap()}
  $('#viewerClose')?.addEventListener('click',closeViewer);viewer?.addEventListener('click',e=>{if(e.target===viewer)closeViewer()});

  const cases={
    tienda:{type:'digital experience',title:'Tienda',img:'assets/tienda.png',desc:'A friendly e-commerce experience designed around product discovery, visual hierarchy and easy navigation.',focus:'UI/UX · visual system',approach:'clean structure + warm brand cues',deliverable:'responsive web experience'},
    dylan:{type:'brand identity',title:"Dylan's Little Closet",img:'assets/dylans-logo.jpg',desc:'A playful identity for a children’s clothing concept, balancing charm with enough simplicity to stay memorable.',focus:'logo · identity',approach:'friendly forms + soft palette',deliverable:'brand mark + visual direction'},
    avon:{type:'campaign visual',title:'Avon Seamfree',img:'assets/avon-seamfree.jpg',desc:'A product-focused campaign direction designed to feel bright, approachable and easy to scan across digital placements.',focus:'campaign composition',approach:'product-led hierarchy',deliverable:'campaign visual system'},
    promo:{type:'print / social',title:'Promo Sheets',img:'assets/promo-sheet.jpg',desc:'Compact promotional layouts balancing useful information, branded rhythm and visual clarity.',focus:'layout design',approach:'scan-first information design',deliverable:'promotional sheets'},
    paw:{type:'awareness campaign',title:'Paw-Up',img:'assets/Paw-up.jpg',desc:'An awareness visual built to feel warm, optimistic and immediately understandable.',focus:'campaign poster',approach:'friendly storytelling',deliverable:'awareness creative'}
  };
  const caseModal=$('#caseModal'),caseSheet=$('#caseSheet');
  function openCase(key){const c=cases[key];if(!c)return;caseSheet.innerHTML=`<div class="case-head"><div><small>${c.type}</small><h3>${c.title}</h3></div><button class="round-close case-close" type="button" aria-label="Close case study">×</button></div><div class="case-body"><div class="case-media"><img src="${c.img}" alt="${c.title}"></div><div class="case-copy"><p>${c.desc}</p><div class="case-facts"><div><small>focus</small><b>${c.focus}</b></div><div><small>approach</small><b>${c.approach}</b></div><div><small>deliverable</small><b>${c.deliverable}</b></div></div></div></div>`;caseModal.classList.add('open');caseModal.setAttribute('aria-hidden','false');lock(true);activateTrap(caseModal,$('.case-close',caseSheet));$('.case-close',caseSheet).addEventListener('click',closeCase);wireImageFallbacks(caseSheet)}
  function closeCase(){caseModal?.classList.remove('open');caseModal?.setAttribute('aria-hidden','true');lock(false);releaseTrap()}
  $$('[data-case]').forEach(el=>el.addEventListener('click',()=>openCase(el.dataset.case)));caseModal?.addEventListener('click',e=>{if(e.target===caseModal)closeCase()});

  addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(viewer?.classList.contains('open'))closeViewer();else if(caseModal?.classList.contains('open'))closeCase();else if(photoModal?.classList.contains('open'))closePhotos();else if(links?.classList.contains('open'))closeMenu()});

  const copyEmail=$('#copyEmail');
  copyEmail?.addEventListener('click',async()=>{
    const email=copyEmail.dataset.email||'mariezendee@gmail.com';
    try{
      await navigator.clipboard.writeText(email);
      copyEmail.textContent='copied ✓';
      copyEmail.classList.add('copied');
      setTimeout(()=>{copyEmail.textContent='copy email';copyEmail.classList.remove('copied')},1800);
    }catch(e){
      location.href='mailto:'+email;
    }
  });

  function wireImageFallbacks(root=document){$$('img',root).forEach(img=>{if(img.dataset.checked)return;img.dataset.checked='1';img.addEventListener('error',()=>img.parentElement?.classList.add('asset-missing'),{once:true})})}
  wireImageFallbacks();
})();
