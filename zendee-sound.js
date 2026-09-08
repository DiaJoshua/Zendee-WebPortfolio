/* Sound is opt-in. Off means all music and effects are silent. */
(() => {
  'use strict';
  const button=document.getElementById('soundBtn');
  if(!button)return;
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(!AudioContext){button.disabled=true;button.title='Sound unavailable in this browser';button.setAttribute('aria-label',button.title);return;}
  let context=null,master=null,playing=false,timer=null,generation=0,step=0,lastEffect=0;
  const melody=[523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,440,523.25,659.25,523.25,392,523.25,659.25,783.99];
  function sync(){button.textContent=playing?'♫':'♪';button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'Turn sound off':'Turn sound on');button.title=playing?'Sound on':'Sound off';}
  function note(frequency,duration=.35,volume=.035){
    if(!playing||document.hidden||context?.state!=='running')return;
    const start=context.currentTime,oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type='sine';oscillator.frequency.value=frequency;
    gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    oscillator.connect(gain);gain.connect(master);oscillator.start(start);oscillator.stop(start+duration+.02);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  }
  function tick(){clearTimeout(timer);timer=null;if(!playing||document.hidden)return;note(melody[step++%melody.length]);timer=setTimeout(tick,700);}
  function stop(){generation++;playing=false;clearTimeout(timer);timer=null;if(master&&context){master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(0,context.currentTime);}sync();}
  button.addEventListener('click',async()=>{
    if(playing){stop();return;}
    const request=++generation;
    playing=true;sync();
    try{
      if(!context){context=new AudioContext();master=context.createGain();master.gain.value=0;master.connect(context.destination);}
      if(context.state!=='running')await context.resume();
      if(request!==generation||!playing)return;
      if(context.state!=='running'){stop();return;}
      master.gain.setValueAtTime(.45,context.currentTime);tick();
    }catch{stop();button.title='Sound could not start. Try again.';}
  });
  document.addEventListener('click',event=>{
    if(!playing||!context||event.target.closest('#soundBtn')||!event.target.closest('button,a'))return;
    const now=performance.now();if(now-lastEffect<120)return;lastEffect=now;note(880,.08,.016);
  },{passive:true});
  document.addEventListener('visibilitychange',()=>{
    clearTimeout(timer);timer=null;
    if(document.hidden){if(master&&context)master.gain.setValueAtTime(0,context.currentTime);}
    else if(playing&&context?.state==='running'){master.gain.setValueAtTime(.45,context.currentTime);tick();}
  });
  addEventListener('pagehide',stop);
  sync();
})();
