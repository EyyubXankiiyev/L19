import React, { useEffect, useRef, useState } from 'react';
import { tx } from './i18n.js';

export function Arrow({ down = false, ...props }) {
  return <svg className="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}><path d={down ? 'M12 4v16m-6-6 6 6 6-6' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ResearchGlyph({ index }) {
  const shapes = [
    <><path d="m12 3 7.5 4.5v9L12 21l-7.5-4.5v-9L12 3Z"/><path d="m12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/><circle cx="12" cy="3" r="1.5"/><circle cx="19.5" cy="7.5" r="1.5"/><circle cx="4.5" cy="16.5" r="1.5"/></>,
    <><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    <><path d="M20 4c-8.8 0-14 4.2-14 10.3A5.7 5.7 0 0 0 11.7 20C17.8 20 20 12 20 4Z"/><path d="M4 21c3-5 6.5-8.5 12-12"/></>,
    <><circle cx="12" cy="12" r="9"/><path d="M12 5v8l5 3"/><path d="m5 5 2 2M17 17l2 2"/></>,
    <><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8m8.6 8.6 2.8 2.8M2 12h4m12 0h4M4.9 19.1l2.8-2.8m8.6-8.6 2.8-2.8"/><circle cx="12" cy="12" r="4"/></>,
    <><path d="M9 3h6m-5 0v6l-5.5 9.4A2.4 2.4 0 0 0 6.6 22h10.8a2.4 2.4 0 0 0 2.1-3.6L14 9V3"/><path d="M8 15h8"/></>,
  ];
  return <svg className="research-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[index % shapes.length]}</svg>;
}

export function Research({ d, t, lang }) {
  const [selected, setSelected] = useState(0);
  const refs = useRef([]);
  function navigate(event, index) {
    const next = { ArrowDown: (index + 1) % d.research.length, ArrowUp: (index + d.research.length - 1) % d.research.length, Home: 0, End: d.research.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault(); setSelected(next); refs.current[next].focus();
  }
  const topics = lang === 'az' ? [
    ['NBR/HNBR kompozitlər', 'Radiasiya vulkanizasiyası ilə hazırlanmış elastomer kompozitlərin xassələri.', 'lab-synthesis.jpg', 'NBR və HNBR kompozitlərinin hazırlanması'],
    ['Polimer nanokompozitlər', 'Nanohissəciklərin polimer matrisdə paylanması və strukturun öyrənilməsi.', 'material-study.png', 'Polimer nanokompozit şəbəkəsinin mikroyapısı'],
    ['Fiziki-kimyəvi xassələr', 'FTIR, SEM, TGA və DSC üsulları ilə materialların kompleks xarakteristikası.', 'lab-sem.jpg', 'Laboratoriyada SEM xarakterizasiyası'],
  ] : lang === 'ru' ? [
    ['Композиты NBR/HNBR', 'Свойства эластомерных композитов, полученных радиационной вулканизацией.', 'lab-synthesis.jpg', 'Получение композитов NBR и HNBR'],
    ['Полимерные нанокомпозиты', 'Распределение нанонаполнителей в полимерной матрице и исследование структуры.', 'material-study.png', 'Микроструктура сетки полимерного нанокомпозита'],
    ['Физико-химическая характеризация', 'Комплексный анализ материалов методами ИК-Фурье, СЭМ, ТГА и ДСК.', 'lab-sem.jpg', 'СЭМ-анализ в лаборатории'],
  ] : [
    ['NBR/HNBR composites', 'Properties of elastomer composites prepared through radiation vulcanization.', 'lab-synthesis.jpg', 'Preparation of NBR and HNBR composites'],
    ['Polymer nanocomposites', 'Distribution of nanoscale fillers in polymer matrices and structure analysis.', 'material-study.png', 'Polymer nanocomposite network microstructure'],
    ['Physicochemical characterization', 'Integrated material analysis using FTIR, SEM, TGA and DSC methods.', 'lab-sem.jpg', 'SEM characterization in the laboratory'],
  ];
  const directionLabel = tx(lang, 'TƏDQİQAT İSTİQAMƏTİ', 'RESEARCH DIRECTION', 'НАПРАВЛЕНИЕ ИССЛЕДОВАНИЙ');
  return <div className="research-explorer">
    <nav className="research-navigation" role="tablist" aria-label={t.researchPanel} aria-orientation="vertical">
      {d.research.map(([title], index) => <button key={index} id={'research-tab-' + index} role="tab" aria-selected={selected === index} aria-controls="research-panel" tabIndex={selected === index ? 0 : -1} ref={el => { refs.current[index] = el; }} onClick={() => setSelected(index)} onKeyDown={e => navigate(e, index)}>
        <ResearchGlyph index={index}/><span className="research-nav-number">{String(index + 1).padStart(2, '0')}</span><span className="research-nav-title">{title}</span><Arrow width={15} height={15}/>
      </button>)}
    </nav>
    <div className="research-main">
      <div className={'research-panel research-panel-' + selected} id="research-panel" role="tabpanel" aria-labelledby={'research-tab-' + selected} tabIndex={0}>
        <div className="research-panel-copy"><span className="research-detail-kicker">{String(selected + 1).padStart(2, '0')} / {directionLabel}</span><h2>{d.research[selected][0]}</h2><p>{d.research[selected][1]}</p></div>
        <img className="research-detail-network" src="/images/polymer-nanocomposite-network.webp" alt="" aria-hidden="true" loading="lazy"/>
        <ul className="research-focus-list">{(t.topics[selected] || []).slice(0, 3).map(topic => <li key={topic}>{topic}</li>)}</ul>
      </div>
      <div className="research-featured">
        <div className="research-featured-image"><img src="/images/material-study.png" alt={tx(lang, 'Polimer nanokompozitin lifli mikroyapısı', 'Fibrous microstructure of a polymer nanocomposite', 'Волокнистая микроструктура полимерного нанокомпозита')} loading="lazy"/></div>
        <div className="research-featured-copy"><span>{tx(lang, 'SEÇİLMİŞ TƏDQİQAT', 'FEATURED RESEARCH', 'ИЗБРАННОЕ ИССЛЕДОВАНИЕ')}</span><a href="#publications">{tx(lang, 'Əlaqəli tədqiqatlara baxın', 'Explore related research', 'Смотреть связанные исследования')} <Arrow width={16} height={16}/></a><p>{tx(lang, 'Layihələr, nəşrlər və nəticələr haqqında ətraflı məlumat.', 'Learn more about related projects, publications and results.', 'Подробнее о связанных проектах, публикациях и результатах.')}</p><a className="research-featured-arrow" href="#publications" aria-label={tx(lang, 'Nəticələrə keç', 'Go to results', 'Перейти к результатам')}><Arrow width={17} height={17}/></a></div>
      </div>
      <div className="research-topics-heading"><h3>{tx(lang, 'Seçilmiş tədqiqat mövzuları', 'Selected research topics', 'Избранные темы исследований')}</h3><a href="#publications">{tx(lang, 'Daha çox nəticə', 'More results', 'Больше результатов')} <Arrow width={15} height={15}/></a></div>
      <div className="research-topic-cards">{topics.map(([title, description, image, alt], index) => <a className="research-topic-card" href="#publications" key={title}>
        <span className={'research-topic-image research-topic-image-' + index}><img src={'/images/' + image} alt={alt} loading="lazy"/></span>
        <span className="research-topic-copy"><strong>{title}</strong><small>{description}</small><span className="research-topic-link">{tx(lang, 'Ətraflı bax', 'Explore', 'Подробнее')} <Arrow width={14} height={14}/></span></span>
      </a>)}</div>
    </div>
  </div>;
}

function MaterialDialog({ item, t, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element.open) element.showModal();
  }, []);
  return <dialog className="material-dialog" ref={dialog} aria-labelledby="dialog-title" onClose={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }}>
    <div className="dialog-top"><span>{t.details}</span><button className="icon-button" autoFocus aria-label={t.close} onClick={onClose}>×</button></div>
    <span className="category-label">{item.type === 'results' ? t.researchType : item.type === 'projects' ? t.projectType : t.paperType}</span>
    <h2 id="dialog-title">{item.title}</h2><p>{item.description}</p>
    <a href="#research" className="text-link" onClick={onClose}>{t.related} <Arrow width={14} height={14}/> </a>
  </dialog>;
}

export function Publications({ d, t, lang }) {
  const [selected, setSelected] = useState('all');
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const refs = useRef([]);
  const tabs = ['all', 'results', 'projects', 'papers'];
  const all = ['results', 'projects', 'papers'].flatMap(type => d[type + 'List'].map(([title, description], index) => {
    const isUnnumberedPatent = type === 'projects' && title === 'Patent' && /patent nömrəsi|patent number|номер патента/i.test(description);
    const isIncompletePaper = type === 'papers' && /tam məqalə başlığı|full article title|полное название статьи/i.test(description);
    const displayTitle = isIncompletePaper ? title.replace(/\s*[—–-]\s*(təqdimatda istinad|cited in (?:the )?presentation|ссылка в презентации).*$/i, '') : title;
    const displayDescription = description
      .replace(/\s*(?:Tam məqalə başlığı təqdimatda verilməyib|The full article title is not supplied in the presentation)[^.]*\.?/gi, '')
      .replace(/\s*(?:Полное название статьи в презентации не приведено)[^.]*\.?/gi, '')
      .replace(/\s*(?:Təqdimatda patent nömrəsi göstərilməyib|The presentation does not provide a patent number)\.?/gi, '')
      .replace(/\s*(?:В презентации номер патента не указан)\.?/gi, '')
      .replace(/\s*\((?:səh\.?|p\.)\s*\d+\)/gi, '')
      .replace(/\s*·\s*(?:12 oktyabr 2026 təqdimatına əsasən|based on the 12 October 2026 presentation|по состоянию на 12 октября 2026 года)\.?/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    const status = isUnnumberedPatent
      ? tx(lang, 'Patent nömrəsi dəqiqləşdirilir', 'Patent number pending verification', 'Номер патента уточняется')
      : isIncompletePaper
        ? tx(lang, 'Tam məqalə adı dəqiqləşdirilir', 'Full article title pending verification', 'Полное название статьи уточняется')
        : '';
    return { title, displayTitle, description, displayDescription, status, type, index };
  }));
  const normalized = query.trim().toLocaleLowerCase(lang);
  const items = all.filter(item => (selected === 'all' || selected === item.type) && (item.displayTitle + ' ' + item.displayDescription).toLocaleLowerCase(lang).includes(normalized));
  const visibleItems = expanded || normalized ? items : items.slice(0, 5);
  useEffect(() => { setExpanded(false); }, [selected, query]);
  useEffect(() => { setOpened(null); }, [lang]);
  useEffect(() => {
    function showStudy(event) {
      setSelected('results');
      setQuery(event.detail || '');
      document.getElementById('publications')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    function showType(event) {
      setSelected(event.detail || 'all');
      setQuery('');
      document.getElementById('publications')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    window.addEventListener('lab:find-study', showStudy);
    window.addEventListener('lab:open-activity-type', showType);
    return () => {
      window.removeEventListener('lab:find-study', showStudy);
      window.removeEventListener('lab:open-activity-type', showType);
    };
  }, []);
  function navigate(event, index) {
    const next = { ArrowRight: (index + 1) % 4, ArrowLeft: (index + 3) % 4, Home: 0, End: 3 }[event.key];
    if (next === undefined) return;
    event.preventDefault(); setSelected(tabs[next]); refs.current[next].focus();
  }
  return <>
    <div className="work-toolbar">
      <div className="tabs" role="tablist" aria-label={t.workTitle}>{tabs.map((tab, index) => <button key={tab} ref={el => { refs.current[index] = el; }} role="tab" id={'tab-' + tab} aria-controls="materials" aria-selected={selected === tab} tabIndex={selected === tab ? 0 : -1} onClick={() => setSelected(tab)} onKeyDown={e => navigate(e, index)}>{tab === 'all' ? t.all : d[tab]}<span>{tab === 'all' ? all.length : all.filter(item => item.type === tab).length}</span></button>)}</div>
      <div className="work-search-cluster">
        <div className="search-field"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor"/><path d="m15 15 6 6" stroke="currentColor"/></svg><input type="search" aria-label={t.searchLabel} placeholder={t.search} value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label={t.clear} onClick={() => setQuery('')}>×</button>}</div>
        <div className="results-count mono" aria-live="polite">{items.length} {t.count}</div>
      </div>
    </div>
    <div className="materials-grid" id="materials" role="tabpanel" aria-labelledby={'tab-' + selected} tabIndex={0}>
      {visibleItems.map(item => <article className={'material-card ' + item.type} key={item.type + item.index}>
        <span className="material-number">{String(all.findIndex(entry => entry.type === item.type && entry.index === item.index) + 1).padStart(2, '0')}</span>
        <div className="material-copy">
          <span className="category-label">{item.type === 'results' ? t.researchType : item.type === 'projects' ? t.projectType : t.paperType}</span>
          {item.status && <span className="record-status">{item.status}</span>}
          <h3><button onClick={() => setOpened(item)}>{item.displayTitle}</button></h3>
          <p>{item.displayDescription}</p>
        </div>
        <button className="card-link" onClick={() => setOpened(item)}>{t.read}<span aria-hidden="true"> <Arrow width={14} height={14}/> </span></button>
      </article>)}
      {!items.length && <div className="empty-results"><h3>{selected === 'papers' && !query ? t.papersPending : t.noResults}</h3><p>{selected === 'papers' && !query ? t.papersNote : t.noResultsText}</p>{query && <button className="text-link" onClick={() => setQuery('')}>{t.clear}</button>}</div>}
    </div>
    {!normalized && items.length > 5 && <button className="show-materials" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="materials">{expanded ? tx(lang, 'Daha az göstər', 'Show fewer', 'Свернуть') : tx(lang, `Bütün materialları göstər (${items.length})`, `Show all materials (${items.length})`, `Показать все материалы (${items.length})`)}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button>}
    {opened && <MaterialDialog item={{ ...opened, title: opened.displayTitle, description: opened.displayDescription }} t={t} onClose={() => setOpened(null)} />}
  </>;
}

export function downloadOverview(d, t, lang) {
  const sections = [t.laboratory, t.ministry, t.institute, t.draft, '', d.intro, '', d.aboutText, d.aboutText2, '', d.navResearch, ...d.research.map(([a, b]) => a + '\n' + b), '', d.navMethods, ...d.methods.map(([a, b]) => a + ': ' + b), '', d.results, ...d.resultsList.map(([a, b]) => a + '\n' + b), '', d.projects, ...d.projectsList.map(([a, b]) => a + '\n' + b), '', d.resultNote, d.equipmentNote, t.teamNote, t.contactNote];
  sections.push('', d.sourceNote, ...(d.metrics || []).map(([value, label]) => value + ': ' + label), '', ...(d.equipment || []).map(item => item.name + '\n' + item.description), d.preparation, '', d.teamDescription, ...(d.staff || []).map(([role, count]) => role + ': ' + count), '', ...(d.partnerships || []).map(([name, description]) => name + '\n' + description), ...(d.opportunities || []).map(([title, description]) => title + '\n' + description), '', d.papers, ...d.papersList.map(([title, description]) => title + '\n' + description));
  const url = URL.createObjectURL(new Blob(['\uFEFF' + sections.filter(value => value !== undefined && value !== t.teamNote).join('\n\n')], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `laboratory-19-${lang}.txt`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
