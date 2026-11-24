
const translatable = [...document.querySelectorAll('[data-en], [data-en-label]')].map(element => ({
  element,
  spanishText: element.textContent,
  spanishLabel: element.getAttribute('aria-label')
}));
const languages = document.querySelectorAll('[data-language]');
function setLanguage(language) {
  const english = language === 'en';
  document.documentElement.lang = language;
  document.title = english ? document.body.dataset.titleEn : document.body.dataset.titleEs;
  for (const link of document.querySelectorAll('a[href]')) {
    const target = new URL(link.href);
    if (target.origin !== location.origin || !target.pathname.endsWith('.html')) continue;
    if (english) target.searchParams.set('lang', 'en');
    else target.searchParams.delete('lang');
    link.href = target.href;
  }
  for (const {element, spanishText, spanishLabel} of translatable) {
    if (element.dataset.en) element.textContent = english ? element.dataset.en : spanishText;
    if (element.dataset.enLabel) element.setAttribute('aria-label', english ? element.dataset.enLabel : spanishLabel);
  }
  for (const button of languages) {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  }
}
for (const button of languages) {
  button.addEventListener('click', () => {
    const url = new URL(location.href);
    if (button.dataset.language === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    if (location.protocol !== 'file:') history.replaceState(null, '', url);
    setLanguage(button.dataset.language);
  });
}
setLanguage(new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'es');
