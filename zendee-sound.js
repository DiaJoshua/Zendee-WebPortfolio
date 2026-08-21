(()=>{
  const soundBtn=document.getElementById('soundBtn');
  if(!soundBtn)return;
  const AC=window.AudioContext||window.webkitAudioContext;
  let ctx=null,playing=false,timer=0,step=0;
  const audio=()=>{if(!AC)return null;if(!ctx)ctx=new AC();if(ctx.state==='suspended')ctx.resume();return ctx};
  function tone(freq,dur=.14,vol=.016,type='triangle',delay=0){if(!audio())return;const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+dur+.03)}
  const notes=[523,659,784,659,587,698,880,698,440,523,659,523,392,523,659,784];
  function sync(){soundBtn.textContent=playing?'⏸':'♪';soundBtn.classList.toggle('playing',playing);soundBtn.setAttribute('aria-label',playing?'Pause berry bounce':'Play berry bounce')}
  function start(){if(playing||!audio())return;playing=true;step=0;sync();tone(784,.11,.014,'sine');timer=setInterval(()=>{if(!playing||document.hidden)return;const f=notes[step++%notes.length];tone(f,.16,.012,'triangle');if(step%4===1)tone(f/2,.13,.007,'sine')},420)}
  function stop(){playing=false;clearInterval(timer);timer=0;sync()}
  soundBtn.addEventListener('click',()=>playing?stop():start());
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing){clearInterval(timer);timer=0}else if(!document.hidden&&playing&&!timer){timer=setInterval(()=>{const f=notes[step++%notes.length];tone(f,.16,.012,'triangle')},420)}});
  sync();
})();
