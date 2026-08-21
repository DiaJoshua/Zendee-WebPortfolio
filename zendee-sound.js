(()=>{
  const dock=document.getElementById('soundDock'),musicBtn=document.getElementById('musicBtn'),sfxBtn=document.getElementById('sfxBtn'),soundBtn=document.getElementById('soundBtn');
  if(!dock||!musicBtn||!sfxBtn)return;
  const AC=window.AudioContext||window.webkitAudioContext; let ctx=null,music=false,sfx=true,timer=0,step=0;
  try{sfx=localStorage.getItem('zendee-sfx')!=='off'}catch(e){}
  const audio=()=>{if(!AC)return null;if(!ctx)ctx=new AC();if(ctx.state==='suspended')ctx.resume();return ctx};
  function tone(freq,dur=.07,vol=.03,type='sine',delay=0){if(!audio())return;const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+dur+.025)}
  function pop(){if(!sfx)return;tone(720,.05,.025);tone(980,.06,.018,'sine',.026)}
  function start(){if(music)return;audio();music=true;dock.classList.add('playing');musicBtn.textContent='⏸';const notes=[523,659,784,659,587,698,880,698,440,523,659,523,392,523,659,784];step=0;timer=setInterval(()=>{if(!music||document.hidden)return;const f=notes[step++%notes.length];tone(f,.16,.018,'triangle');if(step%4===1)tone(f/2,.13,.012,'sine')},340)}
  function stop(){music=false;clearInterval(timer);timer=0;dock.classList.remove('playing');musicBtn.textContent='▶'}
  musicBtn.addEventListener('click',()=>{music?stop():start();pop()});soundBtn?.addEventListener('click',()=>musicBtn.click());
  sfxBtn.addEventListener('click',()=>{sfx=!sfx;sfxBtn.textContent=sfx?'🔔':'🔕';try{localStorage.setItem('zendee-sfx',sfx?'on':'off')}catch(e){};if(sfx)pop()});
  document.addEventListener('click',e=>{if(!sfx||e.target.closest('#soundDock,#soundBtn'))return;if(e.target.closest('a,button'))pop()});
  sfxBtn.textContent=sfx?'🔔':'🔕';
})();
