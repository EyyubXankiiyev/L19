import React, { useEffect, useRef, useState } from 'react';
import { Arrow } from './components.jsx';
import { tx } from './i18n.js';

export default function QuickSearch({ d, t, lang, onClose }) {
  const ref = useRef(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const links = useRef([]);
  const entries = [
    ...d.research.map(([title, description], index) => ({ title, description, category: d.navResearch, href: '#research', index })),
    ...d.methods.map(([title, description], index) => ({ title, description, category: d.navMethods, href: '#methods', index })),
    ...(d.equipment || []).map(item => ({ title: item.name, description: item.description, category: d.navMethods, href: '#' + item.id })),
    ...d.resultsList.map(([title, description]) => ({ title, description, category: d.results, href: '#publications' })),
    { title: t.contact, description: t.contactText, category: t.institute, href: '#contact' },
  ];
  const results = entries.filter(item => `${item.title} ${item.description}`.toLocaleLowerCase(lang).includes(query.trim().toLocaleLowerCase(lang))).slice(0, 8);
  useEffect(() => { if (!ref.current.open) ref.current.showModal(); }, []);
  function go(item) {
    if (item.href === '#research') document.getElementById('research-tab-' + item.index)?.click();
    if (item.href === '#methods') document.getElementById('method-tab-' + item.index)?.click();
    if (item.href === '#publications') window.dispatchEvent(new CustomEvent('lab:find-study', { detail: item.title }));
    onClose();
    window.location.hash = item.href;
    requestAnimationFrame(() => document.querySelector(item.href)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  }
  return <dialog className="quick-search" ref={ref} aria-label={tx(lang, 'Saytda axtarış', 'Search the site', 'Поиск по сайту')} onClose={onClose} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="quick-search-input"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor"/><path d="m15 15 6 6" stroke="currentColor"/></svg><input autoFocus value={query} aria-label={tx(lang, 'Saytda axtarış', 'Search the site', 'Поиск по сайту')} placeholder={tx(lang, 'Nə araşdırmaq istəyirsiniz?', 'What would you like to explore?', 'Что вы хотите найти?')} onChange={e => { setQuery(e.target.value); setSelected(0); }} onKeyDown={event => { if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); links.current[0]?.focus(); } if (event.key === 'Enter' && results[0]) go(results[0]); }}/><button className="search-escape" onClick={onClose} aria-label={t.close}>ESC</button></div>
    <div className="quick-results" aria-live="polite"><p className="mono">{query ? tx(lang, 'NƏTİCƏLƏR', 'SEARCH RESULTS', 'РЕЗУЛЬТАТЫ ПОИСКА') : tx(lang, 'KƏŞF EDİN', 'EXPLORE THE LABORATORY', 'ИССЛЕДУЙТЕ ЛАБОРАТОРИЮ')}</p>{results.map((item, index) => <button ref={el => { links.current[index] = el; }} key={item.title} className={selected === index ? 'is-selected' : ''} onFocus={() => setSelected(index)} onClick={() => go(item)} onKeyDown={event => { const next = event.key === 'ArrowDown' ? (index + 1) % results.length : event.key === 'ArrowUp' ? (index + results.length - 1) % results.length : undefined; if (next !== undefined) { event.preventDefault(); links.current[next]?.focus(); } }}><span><small>{item.category}</small><strong>{item.title}</strong></span><Arrow/></button>)}{!results.length && <p className="quick-empty">{t.noResults}</p>}</div>
    <div className="quick-footer mono"><span>↑ ↓ {tx(lang, 'seçin', 'navigate', 'навигация')} <span>↵ {tx(lang, 'açın', 'open', 'открыть')}</span></span><span>LAB19 / {tx(lang, 'AXTARIŞ', 'SEARCH', 'ПОИСК')}</span></div>
  </dialog>;
}
