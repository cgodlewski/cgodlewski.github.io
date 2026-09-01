const langKey='cjg-lang';

function setLanguage(lang){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-en]').forEach(el=>{el.textContent=el.dataset[lang]||el.dataset.en});
  document.querySelectorAll('.language-switch button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  localStorage.setItem(langKey,lang);
}

function addConferenceLink(){
  const nav=document.querySelector('nav');
  if(!nav) return;
  const labels={Home:['Home','Accueil'],Publications:['Publications','Publications'],Conferences:['Conferences','Conférences'],Archive:['Archive','Archives'],Links:['Links','Liens']};
  const links=[...nav.querySelectorAll('a')];
  links.forEach(link=>{
    const label=link.dataset.en||link.textContent.trim();
    if(!labels[label]) return;
    [link.dataset.en,link.dataset.fr]=labels[label];
  });
  if(links.some(link=>link.dataset.en==='Conferences'||link.getAttribute('href')?.includes('conferences'))) return;
  const archive=links.find(link=>link.dataset.en==='Archive'||link.getAttribute('href')?.includes('archives'));
  const link=document.createElement('a');
  link.href='../conferences/';
  link.dataset.en='Conferences';
  link.dataset.fr='Conférences';
  link.textContent='Conferences';
  nav.insertBefore(link,archive||null);
}

function setupArchiveAudio(){
  const hero=document.querySelector('.hero');
  const trigger=document.querySelector('.hero-archive-trigger');
  const audio=document.querySelector('#hero-polonaise');
  const status=document.querySelector('.hero-audio-status');
  const pauseButton=document.querySelector('.hero-audio-stop');
  if(!hero||!trigger||!audio||!status||!pauseButton) return;
  const sync=()=>{
    const playing=!audio.paused&&!audio.ended;
    trigger.setAttribute('aria-pressed',String(playing));
    status.hidden=!playing;
  };
  const toggle=()=>{
    if(audio.paused||audio.ended) audio.play().catch(()=>{});
    else audio.pause();
  };
  trigger.addEventListener('click',toggle);
  hero.addEventListener('click',event=>{
    if(event.target===trigger||event.target.closest('a,button')) return;
    const area=trigger.getBoundingClientRect();
    if(event.clientX>=area.left&&event.clientX<=area.right&&event.clientY>=area.top&&event.clientY<=area.bottom) toggle();
  });
  pauseButton.addEventListener('click',()=>audio.pause());
  audio.addEventListener('play',sync);
  audio.addEventListener('pause',sync);
  audio.addEventListener('ended',sync);
}

document.addEventListener('DOMContentLoaded',()=>{
  addConferenceLink();
  setupArchiveAudio();
  const lang=localStorage.getItem(langKey)||'en';
  document.querySelectorAll('.language-switch button').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
  setLanguage(lang);
});
