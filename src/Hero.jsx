import React from 'react';
import { Arrow } from './components.jsx';
import { tx } from './i18n.js';

export default function Hero({ lang }) {
  const az = lang === 'az';
  const ru = lang === 'ru';
  return <>
    <section className="cinematic-hero introduction" id="home">
      <img className="cinematic-hero-image" src="/images/molecular-hero-v3.png" alt="" fetchPriority="high"/>
      <div className="cinematic-hero-shade"/>
      <div className="site-width cinematic-hero-content">
        <p className="hero-eyebrow">{tx(lang, 'FİZİKA İNSTİTUTU · LABORATORİYA 19', 'INSTITUTE OF PHYSICS · LABORATORY 19', 'ИНСТИТУТ ФИЗИКИ · ЛАБОРАТОРИЯ 19')}</p>
        <h1>{az ? <><span>Radiasiya</span> kimyası ilə<br/>yeni funksional<br/><span>materialların</span> tədqiqi</> : ru ? <><span>Радиационная</span> химия<br/>и новые функциональные<br/><span>материалы</span></> : <>Radiation chemistry for<br/>advanced functional<br/><span>materials</span></>}</h1>
        <p className="hero-description">{tx(lang, 'Polimer və kompozit materialların radiasiya təsiri altında çevrilmələrini, xassələrini və tətbiq imkanlarını araşdırırıq.', 'We study radiation-induced transformations, properties and applications of polymers, composites and functional materials.', 'Мы изучаем изменения свойств полимеров, композитов и функциональных материалов под воздействием радиации, а также возможности их применения.')}</p>
        <a className="hero-cta" href="#research">{tx(lang, 'Tədqiqat istiqamətləri', 'Research directions', 'Направления исследований')}<b aria-hidden="true"><Arrow width={14} height={14}/> </b></a>
      </div>
    </section>
    <section className="mission-section" id="mission">
      <div className="site-width mission-grid">
        <div><p className="section-kicker">{tx(lang, 'LABORATORİYANIN MİSSİYASI', 'LABORATORY MISSION', 'МИССИЯ ЛАБОРАТОРИИ')}</p><h2>{az ? <>Laboratoriya 19 polimer və kompozit materialların <em>radiasiya təsiri altında</em> davranışını araşdırır.</> : ru ? <>Лаборатория 19 изучает поведение полимерных и композитных материалов <em>под воздействием радиации.</em></> : <>Laboratory 19 studies the behavior of polymer and composite materials <em>under radiation exposure.</em></>}</h2></div>
        <div className="mission-copy"><p>{tx(lang, 'Materialların struktur, fiziki-kimyəvi xassələrində radiasiya təsirindən yaranan dəyişiklikləri öyrənir, yeni funksional materialların hazırlanması və tətbiq imkanlarını tədqiq edirik.', 'We investigate radiation-induced changes in material structure and physicochemical properties, and study the preparation and applications of new functional materials.', 'Мы изучаем вызванные радиацией изменения структуры и физико-химических свойств материалов, а также создание и применение новых функциональных материалов.')}</p><a href="#about">{tx(lang, 'Laboratoriya haqqında', 'About the laboratory', 'О лаборатории')} <span><Arrow width={14} height={14}/> </span></a></div>
        <img className="mission-network" src="/images/polymer-nanocomposite-network.webp" alt={tx(lang, 'Çarpaz bağlarla birləşmiş polimer nanokompozit şəbəkəsi və nanohissəciklər', 'Crosslinked polymer nanocomposite network with nanoscale filler particles', 'Сетка полимерного нанокомпозита с поперечными связями и наночастицами')} width="768" height="512" loading="lazy"/>
      </div>
    </section>
  </>;
}
