(()=>{
  const soundBtn=document.getElementById('soundBtn');
  if(!soundBtn)return;
  const AC=window.AudioContext||window.webkitAudioContext;
  let ctx=null,playing=false,timer=0,step=0,unlocked=false,lastFx=0;
  const hoverSel='a, button, .photo-slide, .project-row, .visual-tabs button';
  const notes=[523,659,784,659,587,698,880,698,440,523,659,523,392,523,659,784];
  function audio(){if(!AC)return null;if(!ctx)ctx=new AC();if(ctx.state==='suspended')ctx.resume();return ctx}
  function unlock(){if(unlocked)return; if(audio()) unlocked=true;}
  addEventListener('pointerdown',unlock,{passive:true, once:true});
  function tone(freq,dur=.12,vol=.015,type='triangle',delay=0){if(!audio())return;const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+dur+.03)}
  function fx(kind='hover'){if(!unlocked)return; const now=performance.now(); if(now-lastFx<65)return; lastFx=now; if(kind==='hover'){tone(880,.05,.006,'sine'); tone(1174,.06,.004,'triangle',.01);} else if(kind==='click'){tone(660,.08,.009,'triangle'); tone(880,.09,.006,'sine',.015);} }
  function sync(){soundBtn.textContent=playing?'⏸':'♪';soundBtn.classList.toggle('playing',playing);soundBtn.setAttribute('aria-label',playing?'Pause sound':'Play sound')}
  function loop(){if(!playing)return; if(document.hidden){timer=setTimeout(loop,420);return;} const f=notes[step++%notes.length]; tone(f,.16,.010,'triangle'); if(step%4===1)tone(f/2,.12,.006,'sine'); timer=setTimeout(loop,420);}
  function start(){unlock(); if(playing||!ctx)return; playing=true; step=0; sync(); tone(784,.11,.012,'sine'); loop();}
  function stop(){playing=false; clearTimeout(timer); timer=0; sync();}
  soundBtn.addEventListener('click',()=>{fx('click'); playing?stop():start()});
  document.addEventListener('pointerenter',e=>{ if(e.target.closest(hoverSel)) fx('hover'); }, true);
  document.addEventListener('click',e=>{ if(e.target.closest(hoverSel) && e.target!==soundBtn) fx('click'); }, true);
  sync();
})();