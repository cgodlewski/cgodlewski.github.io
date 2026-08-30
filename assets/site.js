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

document.addEventListener('DOMContentLoaded',()=>{
  addConferenceLink();
  const lang=localStorage.getItem(langKey)||'en';
  document.querySelectorAll('.language-switch button').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
  setLanguage(lang);
});
