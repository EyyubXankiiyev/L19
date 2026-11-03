import React, { useState } from 'react';
import { tx } from './i18n.js';

const equipmentGroup = {
  'equipment-1': 'sem',
  'equipment-2': 'other',
  'equipment-3': 'thermal',
  'equipment-4': 'radiation',
  'equipment-5': 'other',
  'equipment-6': 'other',
  'equipment-7': 'other',
};

const equipmentPhoto = {
  'equipment-1': ['lab-sem.jpg', 'ZEISS SIGMA VP scanning electron microscope'],
  'equipment-2': ['lab-xrf.jpg', 'Rigaku ZSX Primus IV X-ray fluorescence spectrometer'],
  'equipment-4': ['lab-gamma.jpg', 'CANBERRA-1125 gamma spectrometry equipment'],
};

const filterOptions = {
  az: [
    ['all', 'Bütün avadanlıqlar'], ['radiation', 'Şüalanma'], ['sem', 'SEM / EDS'],
    ['thermal', 'Termiki analiz'], ['other', 'Digər üsullar'],
  ],
  en: [
    ['all', 'All equipment'], ['radiation', 'Radiation'], ['sem', 'SEM / EDS'],
    ['thermal', 'Thermal analysis'], ['other', 'Other methods'],
  ],
  ru: [
    ['all', 'Всё оборудование'], ['radiation', 'Облучение'], ['sem', 'СЭМ / ЭДС'],
    ['thermal', 'Термический анализ'], ['other', 'Другие методы'],
  ],
};

function EquipmentMark({ item, lang }) {
  const label = item.name.includes('DTA') ? 'ΔT' : item.name.includes('Tensile') ? 'F →' : item.name.includes('MULTISKAN') ? 'λ' : '∿';
  return <div className="equipment-technical-mark" role="img" aria-label={tx(lang, 'Avadanlıq fotoşəkli mövcud deyil', 'Equipment photograph unavailable', 'Фотография оборудования отсутствует')}><span>{label}</span></div>;
}

export default function Equipment({ d, lang }) {
  const [selected, setSelected] = useState('all');
  const equipment = d.equipment || [];
  const options = filterOptions[lang];
  const availableOptions = options.filter(([key]) => key === 'all' || equipment.some(item => equipmentGroup[item.id] === key));
  const items = selected === 'all' ? equipment : equipment.filter(item => equipmentGroup[item.id] === selected);

  if (!equipment.length) return <p className="equipment-note">{d.equipmentNote}</p>;
  return <section className="equipment-catalog" id="equipment-catalog" aria-labelledby="equipment-title">
    <div className="equipment-catalog-heading">
      <div><p className="section-kicker">{tx(lang, '01 / İNFRASTRUKTUR', '01 / INFRASTRUCTURE', '01 / ИНФРАСТРУКТУРА')}</p><h2 id="equipment-title">{tx(lang, 'Laboratoriya avadanlıqları', 'Laboratory equipment', 'Оборудование лаборатории')}</h2></div>
      <p>{tx(lang, 'Materialların sintezi, şüalanma emalı, struktur və fiziki-kimyəvi xarakteristikası üçün istifadə olunan avadanlıqlar.', 'Equipment for material synthesis, radiation processing, structural and physicochemical characterization.', 'Оборудование для синтеза материалов, радиационной обработки, структурной и физико-химической характеризации.')}</p>
    </div>
    <div className="equipment-filters" role="group" aria-label={tx(lang, 'Avadanlığı kateqoriyaya görə süzgəcdən keçir', 'Filter equipment by category', 'Фильтр оборудования по категории')}>
      {availableOptions.map(([key, label]) => <button key={key} type="button" aria-pressed={selected === key} onClick={() => setSelected(key)}>{label}{key === 'all' && <span>{d.equipment.length}</span>}</button>)}
    </div>
    <div className="equipment-grid" aria-live="polite">
      {items.map((item, index) => {
        const photo = equipmentPhoto[item.id];
        return <article id={item.id} key={item.id} className={'equipment-card' + (photo ? ' has-photo' : ' text-only')}>
          {photo ? <div className="equipment-card-photo"><img src={'/images/' + photo[0]} alt={photo[1]} loading="lazy"/></div> : <EquipmentMark item={item} lang={lang}/>}
          <div className="equipment-card-body">
            <div className="equipment-card-meta"><span>{tx(lang, 'AVADANLIQ', 'EQUIPMENT', 'ОБОРУДОВАНИЕ')}</span><span>{String(d.equipment.indexOf(item) + 1).padStart(2, '0')}</span></div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
        </article>;
      })}
    </div>
  </section>;
}

export function Preparation({ d, lang }) {
  const description = d.preparation.replace(/\s*\((?:(?:səh\.?|стр\.?)\s*|pp?\.?)?11\s*[–-]\s*14\)\.?$/i, '').trim();
  const steps = lang === 'az' ? [
    'Kimyəvi sintez və modifikasiya', 'Qarışdırma', 'Qurutma və sentrifuqada ayırma', 'Preslənmə və nümunələrin formalaşdırılması',
  ] : lang === 'ru' ? [
    'Химический синтез и модификация', 'Смешивание', 'Сушка и разделение на центрифуге', 'Прессование и формование образцов',
  ] : [
    'Chemical synthesis and modification', 'Mixing', 'Drying and centrifuge separation', 'Pressing and sample formation',
  ];
  return <section className="preparation-section" aria-labelledby="preparation-title">
    <div className="preparation-copy"><p className="section-kicker">{tx(lang, '02 / NÜMUNƏ HAZIRLIĞI', '02 / SAMPLE PREPARATION', '02 / ПОДГОТОВКА ОБРАЗЦОВ')}</p><h2 id="preparation-title">{tx(lang, 'Sintez və nümunə hazırlığı', 'Synthesis and sample preparation', 'Синтез и подготовка образцов')}</h2><p>{description}</p></div>
    <ol className="preparation-steps">{steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>)}</ol>
  </section>;
}
