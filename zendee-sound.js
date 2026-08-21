(()=>{
  const soundBtn=document.getElementById('soundBtn');
  const soundTooltip=document.getElementById('soundTooltip');
  if(!soundBtn)return;

  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx){
    soundBtn.disabled=true;
    soundBtn.setAttribute('aria-label','Audio unavailable');
    return;
  }

  let ctx=null, master=null, musicGain=null, fxGain=null;
  let playing=false, timer=0, step=0, unlocked=false, lastFx=0;

  const melody=[523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,440,523.25,659.25,523.25,392,523.25,659.25,783.99];

  async function ensureAudio(){
    if(!ctx){
      ctx=new AudioCtx();
      master=ctx.createGain();
      master.gain.value=.72;
      musicGain=ctx.createGain();
      musicGain.gain.value=.34;
      fxGain=ctx.createGain();
      fxGain.gain.value=.32;
      musicGain.connect(master);
      fxGain.connect(master);
      master.connect(ctx.destination);
    }
    if(ctx.state==='suspended'){
      try{await ctx.resume()}catch(e){}
    }
    unlocked=ctx.state==='running';
    return unlocked;
  }

  function voice(freq,dur=.16,vol=.13,type='triangle',delay=0,bus=musicGain){
    if(!ctx||ctx.state!=='running'||!bus)return;
    const t=ctx.currentTime+delay;
    const o=ctx.createOscillator();
    const g=ctx.createGain();
    o.type=type;
    o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(vol,t+.012);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t+dur+.04);
  }

  function sync(){
    soundBtn.textContent=playing?'⏸':'♪';
    soundBtn.classList.toggle('playing',playing);
    soundBtn.setAttribute('aria-label',playing?'Pause portfolio sound':'Play portfolio sound');
    soundBtn.setAttribute('aria-pressed',String(playing));
    if(soundTooltip)soundTooltip.textContent=playing?'sound on':'sound off';
  }

  function playStep(){
    if(!playing)return;
    if(!document.hidden&&ctx?.state==='running'){
      const f=melody[step++%melody.length];
      voice(f,.18,.11,'triangle',0,musicGain);
      if(step%4===1)voice(f/2,.17,.065,'sine',0,musicGain);
      if(step%8===5)voice(f*2,.10,.035,'sine',.035,musicGain);
    }
    timer=setTimeout(playStep,390);
  }

  async function start(){
    const ok=await ensureAudio();
    if(!ok)return;
    clearTimeout(timer);
    playing=true;
    step=0;
    sync();
    voice(659.25,.10,.11,'sine',0,fxGain);
    voice(880,.12,.075,'triangle',.045,fxGain);
    timer=setTimeout(playStep,170);
  }

  function stop(){
    playing=false;
    clearTimeout(timer);
    timer=0;
    sync();
  }

  function fx(kind='hover'){
    if(!unlocked||!ctx||ctx.state!=='running')return;
    const now=performance.now();
    if(now-lastFx<70)return;
    lastFx=now;
    if(kind==='hover'){
      voice(987.77,.055,.045,'sine',0,fxGain);
    }else{
      voice(659.25,.07,.06,'triangle',0,fxGain);
      voice(880,.08,.04,'sine',.018,fxGain);
    }
  }

  soundBtn.addEventListener('pointerdown',()=>{ensureAudio()},{passive:true});
  soundBtn.addEventListener('click',async()=>{
    if(playing)stop();
    else await start();
  });

  // Browser audio policies require one user interaction before hover sounds can exist.
  document.addEventListener('pointerdown',()=>{ensureAudio()},{once:true,passive:true});

  const hoverSelector='a, button, .photo-slide, .project-row, .visual-tabs button';
  document.addEventListener('pointerover',e=>{
    if(e.pointerType==='touch')return;
    if(e.target.closest(hoverSelector))fx('hover');
  },{passive:true});
  document.addEventListener('click',e=>{
    if(e.target===soundBtn)return;
    if(e.target.closest(hoverSelector))fx('click');
  },{passive:true});

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      clearTimeout(timer);
      timer=0;
    }else if(playing&&!timer){
      ensureAudio().then(()=>{timer=setTimeout(playStep,120)});
    }
  });

  sync();
})();