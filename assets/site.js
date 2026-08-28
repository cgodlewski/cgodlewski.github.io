const langKey='cjg-lang';

function setLanguage(lang){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-en]').forEach(el=>{el.textContent=el.dataset[lang]||el.dataset.en});
  document.querySelectorAll('.language-switch button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  localStorage.setItem(langKey,lang);
}

function addConferenceLink(){
  const nav=document.querySelector('nav');
  if(!nav || nav.querySelector('[href*="conferences"]')) return;
  const archive=[...nav.querySelectorAll('a')].find(link=>link.getAttribute('href')?.includes('archives'));
  const link=document.createElement('a');
  link.href='../conferences/';
  link.dataset.en='Conferences';
  link.dataset.fr='Conférences';
  link.textContent='Conferences';
  nav.insertBefore(link,archive||null);
}

document.addEventListener('DOMContentLoaded',()=>{
  addConferenceLink();
  const lang=localStorage.getItem(langKey)||'en';
  document.querySelectorAll('.language-switch button').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
  setLanguage(lang);
});
