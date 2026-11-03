import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import initialContent from './content.json';
import { Arrow, Research, Publications, downloadOverview } from './components.jsx';
import Hero from './Hero.jsx';
import About from './About.jsx';
import QuickSearch from './QuickSearch.jsx';
import MethodExplorer from './MethodExplorer.jsx';
import Equipment, { Preparation } from './Equipment.jsx';
import { ui } from './ui.js';
import { asset, tx } from './i18n.js';

function initialLanguage() {
  try { const saved = localStorage.getItem('lab19-language'); return ['az', 'en', 'ru'].includes(saved) ? saved : 'az'; }
  catch { return 'az'; }
}

function Heading({ title, description }) {
  return <div className="section-heading"><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

function Brand({ lang, institute }) {
  return <a className="brand" href="#home" aria-label={tx(lang, 'Laboratoriya 19 — Ana səhifə', 'Laboratory 19 — Home', 'Лаборатория 19 — Главная')}>
    <img className="laboratory-logo" src="/laboratory-logo.svg" alt="" width="360" height="280"/>
    <span className="brand-affiliation"><strong>{institute}</strong><small>{tx(lang, 'Laboratoriya 19', 'Laboratory 19', 'Лаборатория 19')}</small></span>
  </a>;
}

function languageControlLabel(current, code) {
  const names = { az: ['Azərbaycan dili', 'Azerbaijani', 'Азербайджанский'], ru: ['Rus dili', 'Russian', 'Русский'], en: ['İngilis dili', 'English', 'Английский'] };
  if (current === code) return names[code][current === 'az' ? 0 : current === 'en' ? 1 : 2];
  const switches = {
    az: ['Azərbaycan dilinə keç', 'Switch to Azerbaijani', 'Переключить на азербайджанский'],
    ru: ['Rus dilinə keç', 'Switch to Russian', 'Переключить на русский'],
    en: ['İngilis dilinə keç', 'Switch to English', 'Переключить на английский'],
  };
  return tx(current, switches[code][0], switches[code][1], switches[code][2]);
}

export default function App() {
  const [lang, setLang] = useState(initialLanguage);
  const [content, setContent] = useState(initialContent);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [darkHeader, setDarkHeader] = useState(true);
  const menuRef = useRef(null);
  const languageControlRef = useRef(null);
  const languageTriggerRef = useRef(null);
  const navigationRef = useRef(null);
  const [activeDotX, setActiveDotX] = useState(0);
  const d = content[lang];
  const t = ui[lang];

  useEffect(() => {
    const controller = new AbortController();
    if (import.meta.env.BASE_URL !== '/') return () => {};
    fetch('/api/content', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Content unavailable'); return response.json(); })
      .then(data => {
        const valid = ['az', 'en', 'ru'].every(language => data[language] && ['research', 'methods', 'resultsList', 'projectsList', 'papersList'].every(key => Array.isArray(data[language][key])));
        if (valid) setContent(data);
      }).catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.laboratory;
    document.querySelector('meta[name="description"]')?.setAttribute('content', d.intro);
    try { localStorage.setItem('lab19-language', lang); } catch {}
  }, [lang, d.intro, t.laboratory]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id === 'mission' ? 'home' : entry.target.id);
    }), { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = [...document.querySelectorAll('main .section')];
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sections.forEach(section => section.classList.add('is-in-view'));
      return;
    }
    document.documentElement.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    sections.forEach(section => revealObserver.observe(section));
    return () => {
      revealObserver.disconnect();
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);

  useEffect(() => {
    const heroes = [...document.querySelectorAll('.cinematic-hero, .research-page-hero, .methods-page-hero')];
    const updateHeaderTheme = () => {
      const headerEdge = 88;
      setDarkHeader(heroes.some(hero => {
        const rect = hero.getBoundingClientRect();
        return rect.top <= headerEdge + 10 && rect.bottom > headerEdge - 10;
      }));
    };
    updateHeaderTheme();
    window.addEventListener('scroll', updateHeaderTheme, { passive: true });
    window.addEventListener('resize', updateHeaderTheme);
    return () => { window.removeEventListener('scroll', updateHeaderTheme); window.removeEventListener('resize', updateHeaderTheme); };
  }, []);

  useLayoutEffect(() => {
    const nav = navigationRef.current;
    if (!nav) return;
    const positionDot = () => {
      const currentLink = nav.querySelector('a[aria-current="location"]');
      if (!currentLink) return;
      const navRect = nav.getBoundingClientRect();
      const linkRect = currentLink.getBoundingClientRect();
      setActiveDotX(linkRect.left - navRect.left + linkRect.width / 2 - 2);
    };
    positionDot();
    window.addEventListener('resize', positionDot);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(positionDot) : null;
    observer?.observe(nav);
    return () => { window.removeEventListener('resize', positionDot); observer?.disconnect(); };
  }, [active, lang, menuOpen]);

  useEffect(() => {
    function keydown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(value => !value); }
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuRef.current?.focus(); }
      if (event.key === 'Escape' && languageOpen) { setLanguageOpen(false); languageTriggerRef.current?.focus(); }
    }
    function pointerdown(event) {
      if (languageOpen && !languageControlRef.current?.contains(event.target)) setLanguageOpen(false);
    }
    const desktop = matchMedia('(min-width: 851px)');
    const closeMenu = event => { if (event.matches) setMenuOpen(false); };
    document.addEventListener('keydown', keydown);
    document.addEventListener('pointerdown', pointerdown);
    desktop.addEventListener('change', closeMenu);
    return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('pointerdown', pointerdown); desktop.removeEventListener('change', closeMenu); };
  }, [menuOpen, languageOpen]);

  const navigation = [
    ['home', tx(lang, 'Ana səhifə', 'Home', 'Главная')], ['about', d.navAbout], ['research', d.navResearch], ['methods', d.navMethods],
    ['publications', d.navPublications], ['projects', d.projects], ['team', d.navTeam], ['contact', t.contact],
  ];

  const activityText = lang === 'az' ? {
    ...t,
    workTitle: 'Elmi fəaliyyət',
    all: 'Hamısı',
    search: 'Mövzu və ya açar sözlə axtarın…',
    searchLabel: 'Elmi materiallarda axtarış',
    clear: 'Axtarışı təmizlə',
    count: 'material',
    researchType: 'Tədqiqat mövzusu',
    projectType: 'Layihə / patent',
    paperType: 'Nəşr',
    read: 'Ətraflı bax',
    noResults: 'Uyğun material tapılmadı.',
    noResultsText: 'Başqa açar söz sınayın və ya axtarışı təmizləyin.',
    papersPending: 'Nəşrlər siyahısı hazırlanır.',
    papersNote: 'Təsdiqlənmiş məqalələr, konfrans materialları və DOI keçidləri təqdim olunduqca burada yerləşdiriləcək.',
    details: 'Tədqiqat haqqında',
    related: 'Tədqiqat istiqamətləri'
  } : t;
  const listedPatents = d.projectsList.filter(([title]) => /^Patent/i.test(title)).length;
  const listedProjects = d.projectsList.length - listedPatents;
  const applicationMatch = d.patentNote?.match(/(\d+)\s+(?:additional\s+)?patent applications|ayrıca\s+(\d+)\s+patent ərizəsi/i);
  const patentApplicationCount = Number(applicationMatch?.[1] || applicationMatch?.[2] || 0);
  const workflow = lang === 'az'
    ? [['01', 'Nümunələrin hazırlanması', 'Sintez və modifikasiya'], ['02', 'Şüalanma və modifikasiya', 'Materialların emalı'], ['03', 'Struktur və xassələrin xarakterizasiyası', 'Fiziki-kimyəvi təhlil']]
    : lang === 'ru'
      ? [['01', 'Подготовка образцов', 'Синтез и модификация'], ['02', 'Облучение и модификация', 'Обработка материалов'], ['03', 'Характеризация структуры и свойств', 'Физико-химический анализ']]
      : [['01', 'Preparation', 'Synthesis and modification'], ['02', 'Irradiation', 'Material processing'], ['03', 'Characterization', 'Structure and properties']];

  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className={'site-header ' + (darkHeader ? 'is-on-dark' : 'is-on-light')}>
      <div className="site-width header-inner">
        <Brand lang={lang} institute={t.institute}/>
          <div className="navigation-row"><nav ref={navigationRef} id="main-navigation" className={menuOpen ? 'is-open' : ''} aria-label={tx(lang, 'Əsas naviqasiya', 'Main navigation', 'Основная навигация')} onClick={event => { if (event.target.closest('a')) setMenuOpen(false); }}>
            {navigation.map(([id, label]) => <a href={'#' + id} key={id} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
            <span className="nav-active-dot" aria-hidden="true" style={{ '--dot-x': `${activeDotX}px` }}/>
        </nav></div>
        <div className="header-actions">
          <button className="header-search" onClick={() => setSearchOpen(true)} aria-label={tx(lang, 'Saytda axtarış', 'Search the site', 'Поиск по сайту')}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5" stroke="currentColor"/><path d="m15 15 6 6" stroke="currentColor"/></svg><span>{tx(lang, 'Axtarış', 'Search', 'Поиск')}</span>
          </button>
          <div ref={languageControlRef} className={`language-switch${languageOpen ? ' is-open' : ''}`} role="group" aria-label={tx(lang, 'Dil seçimi', 'Choose language', 'Выбор языка')}>
            <button ref={languageTriggerRef} className="language-trigger" type="button" aria-expanded={languageOpen} aria-haspopup="true" aria-label="Choose language" onClick={() => setLanguageOpen(value => !value)}>
              {lang.toUpperCase()}<svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="language-options">
            {[ ["az", "AZ"], ["ru", "RU"], ["en", "EN"] ].map(([code, label]) => <button type="button" key={code} className={lang === code ? 'current' : ''} aria-pressed={lang === code} aria-label={languageControlLabel(lang, code)} onClick={() => { setLang(code); setLanguageOpen(false); }}>{label}</button>)}
            </div>
          </div>
          <button className="menu-toggle" ref={menuRef} aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? t.close : t.menu} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : <><span/><span/></>}</button>
        </div>
      </div>
    </header>
    <main id="main">
      <Hero lang={lang}/>
      <div className="document-layout">
        <About d={d} lang={lang}/>
        <section className="section research" id="research">
          <div className="research-page-hero">
            <img className="research-page-hero-photo" src="/images/lab-synthesis.jpg" alt="" loading="lazy"/>
            <div className="research-page-hero-shade"/>
            <img className="research-page-hero-network" src="/images/polymer-nanocomposite-network.webp" alt="" aria-hidden="true" loading="lazy"/>
            <div className="site-width research-page-hero-inner">
              <p className="research-breadcrumb"><a href="#home">{tx(lang, 'Ana səhifə', 'Home', 'Главная')}</a><span>/</span>{d.navResearch}</p>
              <h2>{lang === 'az' ? <>Tədqiqat<br/><span>istiqamətləri</span></> : lang === 'ru' ? <>Направления<br/><span>исследований</span></> : <>Research<br/><span>directions</span></>}</h2>
              <p className="research-page-intro">{tx(lang, 'Laboratoriyanın əsas tədqiqat mövzuları aşağıdakı istiqamətlər üzrə qruplaşdırılıb.', 'The laboratory’s main research themes are grouped into the directions below.', 'Основные темы исследований лаборатории объединены в направления, представленные ниже.')}</p>
            </div>
          </div>
          <div className="research-content"><div className="site-width"><Research d={d} t={t} lang={lang}/></div></div>
        </section>
        <section className="section methods" id="methods">
          <div className="methods-page-hero">
            <img className="methods-page-hero-image" src="/images/lab-sem.jpg" alt="" loading="lazy"/>
            <div className="methods-page-hero-shade"/>
            <div className="site-width methods-page-hero-inner">
              <p className="methods-page-eyebrow">{tx(lang, 'LABORATORİYA 19 · İNFRASTRUKTUR', 'LABORATORY 19 · INFRASTRUCTURE', 'ЛАБОРАТОРИЯ 19 · ИНФРАСТРУКТУРА')}</p>
              <h2>{lang === 'az' ? <>Metodlar və <span>avadanlıqlar</span></> : lang === 'ru' ? <>Методы и <span>оборудование</span></> : <>Methods and <span>equipment</span></>}</h2>
              <p>{tx(lang, 'Tədqiqatlarda istifadə olunan şüalanma, struktur və fiziki-kimyəvi analiz üsulları.', 'Radiation, structural and physicochemical analysis methods used in our research.', 'Методы облучения, структурного и физико-химического анализа, применяемые в исследованиях.')}</p>
            </div>
          </div>
          <div className="methods-page-content"><div className="site-width">
            <Equipment d={d} lang={lang}/>
            <div className="methods-block">
              <p className="section-kicker">{tx(lang, 'ELMİ METODLAR', 'SCIENTIFIC METHODS', 'НАУЧНЫЕ МЕТОДЫ')}</p>
              <h2>{tx(lang, 'Tədqiqat və analiz metodları', 'Research and analysis methods', 'Методы исследований и анализа')}</h2>
              <MethodExplorer d={d} t={t} lang={lang}/>
            </div>
            <Preparation d={d} lang={lang}/>
          </div></div>
        </section>
                <section className="section scientific-work" id="publications">
          <div className="activity-hero">
            <div className="activity-hero-inner site-width">
              <div className="activity-hero-copy">
                <p className="activity-eyebrow">{tx(lang, 'ELMİ FƏALİYYƏT · LABORATORİYA 19', 'SCIENTIFIC ACTIVITY · LABORATORY 19', 'НАУЧНАЯ ДЕЯТЕЛЬНОСТЬ · ЛАБОРАТОРИЯ 19')}</p>
                <h2>{tx(lang, 'Tədqiqatlar, layihələr və nəşrlər', 'Research, projects and publications', 'Исследования, проекты и публикации')}</h2>
              </div>
              <p className="activity-hero-description">{tx(lang, 'Laboratoriyanın elmi tədqiqatları, layihələri, patentləri və nəşrləri üzrə əsas nəticələr.', 'Key results from the laboratory’s research, projects, patents and publications.', 'Основные результаты исследований, проектов, патентной и публикационной деятельности лаборатории.')}</p>
            </div>
          </div>
          <div className="site-width activity-content">
            <dl className="activity-metrics" aria-label={tx(lang, 'Hesabat dövrünün göstəriciləri', 'Reporting period metrics', 'Показатели за отчётный период')}>
              {d.metrics?.map(([value, label]) => {
                const [headline, ...context] = label.split(' · ');
                return <div key={label}><dt>{headline}</dt><dd>{value}</dd><small>{context.join(' · ')}</small></div>;
              })}
            </dl>
            <div className="research-to-results" aria-label={tx(lang, 'Elmi fəaliyyət mərhələləri', 'Scientific activity workflow', 'Этапы научной работы')}>
              {workflow.map((step, index) => <React.Fragment key={step[0]}><div><span>{step[0]}</span><strong>{step[1]}</strong><small>{step[2]}</small></div>{index < workflow.length - 1 && <i aria-hidden="true"><Arrow width={14} height={14}/></i>}</React.Fragment>)}
            </div>
            <p className="selected-records-note">{lang === 'az' ? `Seçilmiş qeydlər: ${d.resultsList.length} tədqiqat · ${d.projectsList.length} layihə və patent · ${d.papersList.length} nəşr. Göstəricilər müvafiq hesabat dövrlərinin ümumi saylarını göstərir.` : lang === 'ru' ? `В списке: исследований — ${d.resultsList.length}, проектов и патентов — ${d.projectsList.length}, публикаций — ${d.papersList.length}. Показатели выше отражают итоги соответствующих отчётных периодов.` : `Selected entries: ${d.resultsList.length} research items · ${d.projectsList.length} projects and patents · ${d.papersList.length} publication. Metrics above report period totals.`}</p>
            <Publications d={d} t={activityText} lang={lang}/>
          </div>
        </section>
        <section className="section projects-section" id="projects">
          <div className="site-width">
            <p className="section-kicker">{tx(lang, 'LAYİHƏ VƏ PATENT PORTFELİ', 'PROJECT AND PATENT PORTFOLIO', 'ПРОЕКТЫ И ПАТЕНТЫ')}</p>
            <Heading title={d.projects} description={tx(lang, 'Layihələr, patentlər və patent müraciətləri ayrıca qruplaşdırılıb.', 'Projects, patents and patent applications are reported separately.', 'Проекты, патенты и патентные заявки представлены отдельно.')}/>
            <div className="portfolio-summary">
              <div><span>{tx(lang, 'Siyahıdakı layihə və patentlər', 'Listed projects and patents', 'Проекты и патенты в списке')}</span><strong>{d.projectsList.length}</strong><small>{listedProjects} {tx(lang, 'layihə', 'projects', 'проекта')} · {listedPatents} {tx(lang, 'patent və ixtira', 'patents and inventions', 'патентов и изобретений')}</small></div>
              <div><span>{tx(lang, 'Əlavə patent müraciətləri', 'Additional patent applications', 'Дополнительные патентные заявки')}</span><strong>{patentApplicationCount}</strong><small>{tx(lang, 'Hesabatda qeyd olunub; fərdi qeydlər siyahıya daxil edilməyib.', 'Reported in the source; individual application records are not itemized.', 'Указаны в источнике; сведения по отдельным заявкам не приведены.')}</small></div>
              <a href="#publications" onClick={() => window.dispatchEvent(new CustomEvent('lab:open-activity-type', { detail: 'projects' }))}>{tx(lang, 'Layihə və patent qeydlərinə keçid', 'Browse project and patent records', 'Перейти к проектам и патентам')} <Arrow width={16} height={16}/></a>
            </div>
          </div>
        </section>
        {d.news?.length > 0 && <section className="section news-section" id="news"><div className="site-width"><Heading title={t.newsTitle}/>{d.news.map((item, index) => <article className="news-item" key={index}><time dateTime={item.date}>{item.date}</time><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>}
        <section className="section team" id="team">
          <div className="site-width">
            <p className="section-kicker">{d.teamEyebrow}</p>
            <Heading title={t.teamTitle} description={d.teamDescription || t.teamDescription}/>
            {(() => {
              const staff = d.staff || [];
              const total = staff.reduce((sum, [, count]) => sum + Number(count || 0), 0);
              const technical = staff.filter(([role]) => /texnolo|laborant|mühəndis|technolog|laboratory assistant|engineer|технолог|лаборант|инженер/i.test(role)).reduce((sum, [, count]) => sum + Number(count || 0), 0);
              const scientific = total - technical;
              const maxCount = Math.max(1, ...staff.map(([, count]) => Number(count || 0)));
              return <>
                <div className="team-overview">
                  <aside className="team-lead-card">
                    <span className="team-card-kicker">{tx(lang, 'LABORATORİYA MÜDİRİ', 'LABORATORY HEAD', 'РУКОВОДИТЕЛЬ ЛАБОРАТОРИИ')}</span>
                    <div className="team-lead-mark" aria-hidden="true"><span>19</span><i/><i/><i/></div>
                    <h3>Rəna Xankişiyeva</h3>
                    <p>{tx(lang, 'Radiasiya kimyası və polimer materialları üzrə tədqiqatlara rəhbərlik edir.', 'Leads research in radiation chemistry and polymer materials.', 'Руководит исследованиями в области радиационной химии и полимерных материалов.')}</p>
                    <div className="team-stat-grid">
                      <div><strong>{total}</strong><span>{tx(lang, 'əməkdaş', 'team members', 'сотрудников')}</span></div>
                      <div><strong>{scientific}</strong><span>{tx(lang, 'elmi heyət', 'research staff', 'научных сотрудников')}</span></div>
                      <div><strong>{technical}</strong><span>{tx(lang, 'texniki heyət', 'technical staff', 'технических специалистов')}</span></div>
                    </div>
                  </aside>
                  <div className="team-roles">
                    <div className="team-roles-heading">
                      <div><span className="team-card-kicker">{tx(lang, 'HEYƏTİN TƏRKİBİ', 'TEAM STRUCTURE', 'СТРУКТУРА КОМАНДЫ')}</span><h3>{tx(lang, 'Elmi və texniki heyət', 'Scientific and technical staff', 'Научный и технический персонал')}</h3></div>
                      <span className="team-role-count">{String(staff.length).padStart(2, '0')} {tx(lang, 'vəzifə', 'roles', 'должностей')}</span>
                    </div>
                    <dl className="staff-list">
                      {staff.map(([role, count], index) => <div key={role}>
                        <dt><span className="staff-role-index">{String(index + 1).padStart(2, '0')}</span><span>{role}</span></dt>
                        <dd><span className="staff-role-track" aria-hidden="true"><i style={{ width: `${Math.max(12, Number(count) / maxCount * 100)}%` }}/></span><strong>{count}</strong></dd>
                      </div>)}
                    </dl>
                  </div>
                </div>
                <div className="team-download-row">
                  <span>{tx(lang, 'Heyət bölgüsü rəsmi məlumat materialındakı vəzifə saylarına əsaslanır.', 'Role counts are based on the official institutional information.', 'Распределение сотрудников основано на официальных данных о штатных должностях.')}</span>
                  <div><button className="download-link team-download" aria-label={tx(lang, 'Komanda məlumatını endir', 'Download team overview', 'Скачать сведения о команде')} onClick={() => downloadOverview(d, t, lang)}>{t.download}<span aria-hidden="true"> ↓</span></button><small className="download-format">{t.downloadLabel}</small></div>
                </div>
              </>;
            })()}
          </div>
        </section>
        <section className="section contact" id="contact">
          <div className="site-width">
            <p className="section-kicker">{d.contactEyebrow || tx(lang, 'ƏLAQƏ VƏ ƏMƏKDAŞLIQ', 'CONTACT & COLLABORATION', 'КОНТАКТЫ И СОТРУДНИЧЕСТВО')}</p>
            <div className="contact-intro"><Heading title={t.contactTitle} description={t.contactText}/><aside className="contact-status"><span className="contact-status-dot"/><div><strong>{t.contactPending}</strong><p>{t.contactNote}</p></div></aside></div>
            <div className="partnerships">
              <section className="partnership-group"><div className="partnership-heading"><span>{tx(lang, 'SƏNAYE ƏLAQƏLƏRİ', 'INDUSTRY PARTNERSHIPS', 'ПАРТНЁРСТВО С ПРОМЫШЛЕННОСТЬЮ')}</span><h3>{tx(lang, 'Birgə görülən işlər', 'Current collaboration', 'Текущие проекты сотрудничества')}</h3></div><div className="partnership-grid">{d.partnerships?.map(([name, description], index) => <article key={name}><span className="partnership-index">{String(index + 1).padStart(2, '0')}</span><div><h4>{name}</h4><p>{description}</p></div></article>)}</div></section>
              <section className="opportunity-group"><div className="partnership-heading"><span>{tx(lang, 'ELMİ ƏMƏKDAŞLIQ', 'SCIENTIFIC COLLABORATION', 'НАУЧНОЕ СОТРУДНИЧЕСТВО')}</span><h3>{tx(lang, 'Əməkdaşlıq istiqamətləri', 'Areas of collaboration', 'Направления сотрудничества')}</h3></div><div className="opportunity-list">{d.opportunities?.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{title}</h4><p>{description}</p></div></article>)}</div></section>
            </div>
            <div className="contact-bottom"><span>{t.institute} · {t.laboratory}</span><button className="download-link" onClick={() => downloadOverview(d, t, lang)}>{t.download}<Arrow down width={15} height={15}/></button><small className="download-format">{t.downloadLabel}</small></div>
          </div>
        </section>
      </div>
    </main>
    <footer>
      <div className="site-width footer-main">
        <a className="footer-brand" href="#home"><img src="/laboratory-logo.svg" alt=""/><span><strong>{t.institute}</strong><small>{tx(lang, 'Laboratoriya 19', 'Laboratory 19', 'Лаборатория 19')}</small></span></a>
        <p className="footer-lab-name">{t.laboratory}</p>
        <nav className="footer-links" aria-label={tx(lang, 'Alt menyu', 'Footer navigation', 'Навигация внизу страницы')}><a href="#about">{d.navAbout}</a><a href="#research">{d.navResearch}</a><a href="#methods">{d.navMethods}</a><a href="#publications">{d.navPublications}</a></nav>
        <a className="footer-backtop" href="#home"><span>{t.backTop}</span><i><Arrow width={16} height={16}/></i></a>
      </div>
      <div className="site-width footer-bottom"><span>{t.institute} · {t.laboratory}</span><span>Laboratory 19</span></div>
    </footer>
    {searchOpen && <QuickSearch d={d} t={t} lang={lang} onClose={() => setSearchOpen(false)}/>} 
  </>;
}
