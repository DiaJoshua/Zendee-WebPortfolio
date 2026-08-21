(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body=document.body;

  const boot=$('#boot'), bootProgress=$('#bootProgress');
  let bootValue=8, bootDone=false, bootTimer=0;
  const setBootProgress=(v)=>{
    bootValue=Math.max(0,Math.min(100,v));
    if(bootProgress)bootProgress.style.width=bootValue+'%';
  };
  const finishBoot=()=>{
    if(bootDone)return;
    bootDone=true;
    clearInterval(bootTimer);
    setBootProgress(100);
    boot?.classList.add('loading-complete');
    if(reduced){
      document.body.classList.add('site-ready');
      boot?.classList.add('hide');
      return;
    }
    setTimeout(()=>boot?.classList.add('exit'),180);
    setTimeout(()=>document.body.classList.add('site-ready'),300);
    setTimeout(()=>boot?.classList.add('hide'),980);
  };
  const trackedImages=[...document.images].filter(img=>!img.loading||img.loading!=='lazy');
  const totalTracked=Math.max(1,trackedImages.length);
  let loadedTracked=0;
  const imageSettled=()=>{
    loadedTracked++;
    const imagePart=(loadedTracked/totalTracked)*72;
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
    const ceiling=document.readyState==='complete'?94:82;
    if(bootValue<ceiling)setBootProgress(bootValue+Math.max(.4,(ceiling-bootValue)*.06));
  },90);
  if(document.readyState==='complete')finishBoot();
  else addEventListener('load',finishBoot,{once:true});

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
  const sectionIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;navAnchors.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-35% 0px -55% 0px',threshold:0});
  sections.forEach(s=>sectionIO.observe(s));

  const menu=$('#menuBtn'), links=$('#navLinks');
  menu?.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
  $$('#navLinks a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');menu?.setAttribute('aria-expanded','false')}));

  const roles=['Graphic Artist','Visual Designer','Photography & Brand Support'];
  const type=$('#typeRole'); let role=0,char=roles[0].length,del=false,typeTimer=0;
  const tick=()=>{if(!type||reduced)return;const word=roles[role];type.textContent=word.slice(0,char);let wait=del?38:68;if(!del&&char===word.length){del=true;wait=1500}else if(del&&char===0){del=false;role=(role+1)%roles.length;wait=300}char+=del?-1:1;typeTimer=setTimeout(tick,wait)}; tick();

  const visualFrames=$$('.visual-frame'), visualTabs=$$('.visual-tabs button'), visualTitle=$('#visualTitle'), visualDesc=$('#visualDesc'), chapter=$('.chapter-index'), visualLink=$('.visual-copy [data-case]');
  function showVisual(key){const idx=visualFrames.findIndex(f=>f.dataset.visual===key);visualFrames.forEach(f=>f.classList.toggle('active',f.dataset.visual===key));visualTabs.forEach(b=>b.classList.toggle('active',b.dataset.show===key));const f=visualFrames[idx];if(!f)return;visualTitle.textContent=f.dataset.title;visualDesc.textContent=f.dataset.desc;chapter.textContent=String(idx+1).padStart(2,'0')+' / 04';visualLink.dataset.case=key}
  visualTabs.forEach(b=>b.addEventListener('click',()=>showVisual(b.dataset.show)));

  const lock=v=>body.classList.toggle('lock',v);
  const envelope=$('#envelope'), photoModal=$('#photoModal'), photoClose=$('#photoClose'), photoStrip=$('#photoStrip'), slides=$$('.photo-slide'), photoCount=$('#photoCount'), photoBar=$('#photoBar');
  function openPhotos(){envelope?.classList.add('open');setTimeout(()=>{photoModal?.classList.add('open');photoModal?.setAttribute('aria-hidden','false');lock(true);photoStrip?.focus({preventScroll:true});updatePhotoProgress()},reduced?0:440)}
  function closePhotos(){photoModal?.classList.remove('open');photoModal?.setAttribute('aria-hidden','true');lock(false);setTimeout(()=>envelope?.classList.remove('open'),reduced?0:260)}
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
  slides.forEach(s=>s.addEventListener('click',()=>{if(dragMoved)return;viewerImg.src=s.dataset.photo;viewerImg.alt=$('img',s).alt;viewer.classList.add('open');viewer.setAttribute('aria-hidden','false')}));
  function closeViewer(){viewer?.classList.remove('open');viewer?.setAttribute('aria-hidden','true')}
  $('#viewerClose')?.addEventListener('click',closeViewer);viewer?.addEventListener('click',e=>{if(e.target===viewer)closeViewer()});

  const cases={
    tienda:{type:'digital experience',title:'Tienda',img:'assets/tienda.png',desc:'A friendly e-commerce experience designed around product discovery, visual hierarchy and easy navigation.',focus:'UI/UX · visual system',approach:'clean structure + warm brand cues',deliverable:'responsive web experience'},
    dylan:{type:'brand identity',title:"Dylan's Little Closet",img:'assets/dylans-logo.jpg',desc:'A playful identity for a children’s clothing concept, balancing charm with enough simplicity to stay memorable.',focus:'logo · identity',approach:'friendly forms + soft palette',deliverable:'brand mark + visual direction'},
    avon:{type:'campaign visual',title:'Avon Seamfree',img:'assets/avon-seamfree.jpg',desc:'A product-focused campaign direction designed to feel bright, approachable and easy to scan across digital placements.',focus:'campaign composition',approach:'product-led hierarchy',deliverable:'campaign visual system'},
    promo:{type:'print / social',title:'Promo Sheets',img:'assets/promo-sheet.jpg',desc:'Compact promotional layouts balancing useful information, branded rhythm and visual clarity.',focus:'layout design',approach:'scan-first information design',deliverable:'promotional sheets'},
    paw:{type:'awareness campaign',title:'Paw-Up',img:'assets/Paw-up.jpg',desc:'An awareness visual built to feel warm, optimistic and immediately understandable.',focus:'campaign poster',approach:'friendly storytelling',deliverable:'awareness creative'}
  };
  const caseModal=$('#caseModal'),caseSheet=$('#caseSheet');
  function openCase(key){const c=cases[key];if(!c)return;caseSheet.innerHTML=`<div class="case-head"><div><small>${c.type}</small><h3>${c.title}</h3></div><button class="round-close case-close" type="button" aria-label="Close case study">×</button></div><div class="case-body"><div class="case-media"><img src="${c.img}" alt="${c.title}"></div><div class="case-copy"><p>${c.desc}</p><div class="case-facts"><div><small>focus</small><b>${c.focus}</b></div><div><small>approach</small><b>${c.approach}</b></div><div><small>deliverable</small><b>${c.deliverable}</b></div></div></div></div>`;caseModal.classList.add('open');caseModal.setAttribute('aria-hidden','false');lock(true);$('.case-close',caseSheet).addEventListener('click',closeCase);wireImageFallbacks(caseSheet)}
  function closeCase(){caseModal?.classList.remove('open');caseModal?.setAttribute('aria-hidden','true');lock(false)}
  $$('[data-case]').forEach(el=>el.addEventListener('click',()=>openCase(el.dataset.case)));caseModal?.addEventListener('click',e=>{if(e.target===caseModal)closeCase()});

  addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(viewer?.classList.contains('open'))closeViewer();else if(caseModal?.classList.contains('open'))closeCase();else if(photoModal?.classList.contains('open'))closePhotos()});

  function wireImageFallbacks(root=document){$$('img',root).forEach(img=>{if(img.dataset.checked)return;img.dataset.checked='1';img.addEventListener('error',()=>img.parentElement?.classList.add('asset-missing'),{once:true})})}
  wireImageFallbacks();
})();
