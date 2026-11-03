import React from 'react';
import { Arrow } from './components.jsx';
import { tx } from './i18n.js';

const gallery = [
  { src: '/images/lab-synthesis.jpg', az: 'Laboratoriyada nümunə hazırlığı', en: 'Sample preparation in the laboratory', ru: 'Подготовка образцов в лаборатории' },
  { src: '/images/lab-xrf.jpg', az: 'Rentgen-flüoresans spektrometri', en: 'X-ray fluorescence spectrometer', ru: 'Рентгенофлуоресцентный спектрометр' },
  { src: '/images/lab-sem.jpg', az: 'ZEISS elektron mikroskopu', en: 'ZEISS electron microscope', ru: 'Электронный микроскоп ZEISS' },
];

function ResearchGlyph({ type }) {
  const paths = type === 0 ? <><circle cx="12" cy="12" r="3"/><circle cx="5" cy="7" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="7" cy="19" r="2"/><path d="m7 8 3 2m4 0 3-2m-7 6-2 3m6-3 1 3"/></> : type === 1 ? <><path d="M12 3 20 7v5c0 5-3.4 7.5-8 9-4.6-1.5-8-4-8-9V7l8-4Z"/><path d="m8.5 12 2.1 2.1 4.7-4.7"/></> : <><circle cx="12" cy="12" r="3"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8"/></>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{paths}</svg>;
}

export default function About({ d, lang }) {
  return <section className="section about" id="about">
    <div className="site-width about-layout">
      <div className="about-intro">
        <p className="section-kicker">01 / {tx(lang, 'LABORATORİYA HAQQINDA', 'ABOUT THE LABORATORY', 'О ЛАБОРАТОРИИ')}</p>
        <h2>{tx(lang, 'Laboratoriya haqqında', 'About the laboratory', 'О лаборатории')}</h2>
        <p className="about-lead">{d.aboutText}</p>
        <p className="about-description">{d.aboutText2}</p>
        <a className="about-more" href="#research">{tx(lang, 'Daha ətraflı', 'Learn more', 'Подробнее')} <span aria-hidden="true"><Arrow width={14} height={14}/> </span></a>
      </div>
      <div className="about-gallery" aria-label={tx(lang, 'Laboratoriya işindən görüntülər', 'Laboratory work imagery', 'Фотографии работы лаборатории')}>
        {gallery.map((image) => <figure key={image.src}>
          <img src={image.src} alt={tx(lang, image.az, image.en, image.ru)} loading="lazy"/>
        </figure>)}
      </div>
    </div>
    <div className="site-width about-directions">
      <p className="section-kicker">{tx(lang, 'ELMİ FƏALİYYƏT İSTİQAMƏTLƏRİ', 'SCIENTIFIC RESEARCH DIRECTIONS', 'НАПРАВЛЕНИЯ НАУЧНОЙ ДЕЯТЕЛЬНОСТИ')}</p>
      <div>{d.research.slice(0, 3).map(([title, description], index) => <a href="#research" key={title} className="about-direction" onClick={() => document.getElementById(`research-tab-${index}`)?.click()}>
        <ResearchGlyph type={index}/>
        <span><strong>{title}</strong><small>{description}</small></span>
        <b aria-hidden="true"><Arrow width={14} height={14}/> </b>
      </a>)}</div>
    </div>
  </section>;
}
