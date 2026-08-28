const langKey='cjg-lang';
function setLanguage(lang){document.documentElement.lang=lang;document.querySelectorAll('[data-en]').forEach(el=>{el.textContent=el.dataset[lang]||el.dataset.en});document.querySelectorAll('.language-switch button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));localStorage.setItem(langKey,lang)}
document.addEventListener('DOMContentLoaded',()=>{const lang=localStorage.getItem(langKey)||'en';document.querySelectorAll('.language-switch button').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));setLanguage(lang)});
