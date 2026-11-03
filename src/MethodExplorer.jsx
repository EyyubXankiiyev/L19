import React, { useRef, useState } from 'react';
import { tx } from './i18n.js';

const explanations = {
  az: [
    ['Şüalanma ilə modifikasiya', 'Qamma və ultrabənövşəyi şüalanma materialların quruluşunda və xassələrində baş verən dəyişiklikləri araşdırmaq üçün istifadə olunur.', ['Qamma şüalanması', 'Ultrabənövşəyi şüalanma', 'Radiasiya emalı']],
    ['Kimyəvi bağlardan kristal quruluşa', 'FTIR molekulyar titrəyişləri və funksional qrupları, XRD isə kristal quruluş və faza xüsusiyyətlərini öyrənməyə imkan verir.', ['Funksional qruplar', 'Kristal quruluş', 'Faza tərkibi']],
    ['Səth və element tərkibi', 'SEM səthin morfologiyasının təsvirini, EDS isə nümunənin element tərkibi haqqında məlumatı verir.', ['Səth morfologiyası', 'Mikroquruluş', 'Element analizi']],
    ['Temperatur altında davranış', 'DSC istilik keçidlərini, TGA temperaturdan asılı kütlə dəyişmələrini araşdırmaq üçün tətbiq edilir.', ['İstilik keçidləri', 'Kütlə dəyişməsi', 'Termiki davranış']],
    ['Deformasiya və elastiklik', 'Dartılma və vulkanizasiya ölçmələri elastomer kompozitlərin mexaniki davranışını və emal xüsusiyyətlərini qiymətləndirməyə kömək edir.', ['Dartılma xassələri', 'Vulkanizasiya', 'Elastomer davranışı']],
    ['Bir-birini tamamlayan analizlər', 'Dinamik-mexaniki, elektrokimyəvi, pozitron, rentgen-flüoressensiya və lüminessensiya üsulları müxtəlif xassələr haqqında əlavə məlumat verir.', ['DMA · EIS', 'PALS/DBS · XRF', 'TL/OSL']],
  ],
  en: [
    ['Modification through irradiation', 'Gamma and ultraviolet irradiation are used to investigate changes in material structure and properties.', ['Gamma irradiation', 'Ultraviolet irradiation', 'Radiation processing']],
    ['From chemical bonds to crystal structure', 'FTIR investigates molecular vibrations and functional groups, while XRD provides information about crystal structure and phases.', ['Functional groups', 'Crystal structure', 'Phase composition']],
    ['Surface and elemental composition', 'SEM reveals surface morphology, while EDS provides information about the elemental composition of a sample.', ['Surface morphology', 'Microstructure', 'Elemental analysis']],
    ['Behavior under temperature', 'DSC investigates thermal transitions; TGA examines changes in sample mass as a function of temperature.', ['Thermal transitions', 'Mass changes', 'Thermal behavior']],
    ['Deformation and elasticity', 'Tensile and vulcanization measurements help evaluate the mechanical behavior and processing properties of elastomer composites.', ['Tensile properties', 'Vulcanization', 'Elastomer behavior']],
    ['Complementary analytical approaches', 'Dynamic mechanical, electrochemical, positron, X-ray fluorescence and luminescence methods offer complementary information on material properties.', ['DMA · EIS', 'PALS/DBS · XRF', 'TL/OSL']],
  ],
  ru: [
    ['Модификация облучением', 'Гамма- и ультрафиолетовое излучение применяют для изучения изменений структуры и свойств материалов.', ['Гамма-облучение', 'Ультрафиолетовое излучение', 'Радиационная обработка']],
    ['От химических связей к кристаллической структуре', 'ИК-Фурье-спектроскопия выявляет колебания молекул и функциональные группы, а рентгеновская дифракция — кристаллическую структуру и фазы.', ['Функциональные группы', 'Кристаллическая структура', 'Фазовый состав']],
    ['Поверхность и элементный состав', 'СЭМ показывает морфологию поверхности, а ЭДС позволяет определить элементный состав образца.', ['Морфология поверхности', 'Микроструктура', 'Элементный анализ']],
    ['Поведение при нагревании', 'ДСК используют для изучения тепловых переходов, а ТГА — для измерения изменения массы образца в зависимости от температуры.', ['Тепловые переходы', 'Изменение массы', 'Термические свойства']],
    ['Деформация и эластичность', 'Испытания на растяжение и вулканизацию помогают оценить механические свойства и технологичность эластомерных композитов.', ['Свойства при растяжении', 'Вулканизация', 'Поведение эластомеров']],
    ['Дополнительные методы анализа', 'Динамико-механические, электрохимические, позитронные, рентгенофлуоресцентные и люминесцентные методы дают дополнительные сведения о свойствах материалов.', ['ДМА · ЭИС', 'ПАС/ОПС · РФА', 'ТЛ/ОСЛ']],
  ],
};

export default function MethodExplorer({ d, t, lang }) {
  const [selected, setSelected] = useState(0);
  const refs = useRef([]);
  const detail = explanations[lang][selected];
  const equipmentIds = { 2: ['equipment-1'], 3: ['equipment-3'], 4: ['equipment-5'], 5: ['equipment-2', 'equipment-6'] };
  const relatedEquipment = (equipmentIds[selected] || []).map(id => d.equipment?.find(item => item.id === id)).filter(Boolean);
  return <><div className="instrument-explorer"><div className="instrument-menu" role="tablist" aria-label={d.navMethods} aria-orientation="horizontal">
    {d.methods.map(([title], index) => <button key={title} ref={el => { refs.current[index] = el; }} role="tab" id={'method-tab-' + index} aria-controls="method-detail" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => { const next = event.key === 'ArrowRight' ? (index + 1) % 6 : event.key === 'ArrowLeft' ? (index + 5) % 6 : event.key === 'Home' ? 0 : event.key === 'End' ? 5 : undefined; if (next !== undefined) { event.preventDefault(); setSelected(next); refs.current[next].focus(); } }}>{title}</button>)}
  </div><div id="method-detail" className="instrument-detail" role="tabpanel" tabIndex={0} aria-labelledby={'method-tab-' + selected}>
      <div className="instrument-detail-copy"><span className="mono">{tx(lang, 'METODUN TƏTBİQİ', 'METHOD IN PRACTICE', 'ПРИМЕНЕНИЕ МЕТОДА')}</span><h3>{detail[0]}</h3><p>{detail[1]}</p>
      <div className="instrument-applications"><strong>{tx(lang, 'Tətbiq istiqamətləri', 'Applications', 'Области применения')}</strong><ul>{detail[2].map(tag => <li key={tag}>{tag}</li>)}</ul></div>
      {relatedEquipment.length > 0 && <div className="related-equipment"><strong>{tx(lang, 'Əlaqəli avadanlıq', 'Related equipment', 'Связанное оборудование')}</strong>{relatedEquipment.map(item => <a href={'#' + item.id} key={item.id}>{item.name}<span aria-hidden="true">↗</span></a>)}</div>}
    </div>
    {selected === 2 && <figure className="instrument-detail-visual"><img src="/images/lab-sem.jpg" alt={tx(lang, 'ZEISS SIGMA VP elektron mikroskopu', 'ZEISS SIGMA VP scanning electron microscope', 'Сканирующий электронный микроскоп ZEISS SIGMA VP')} loading="lazy"/><figcaption>{tx(lang, 'SEM · səth morfologiyası', 'SEM · surface morphology', 'СЭМ · морфология поверхности')}</figcaption></figure>}
  </div></div>{!d.equipment?.length && <p className="equipment-note"><span>ⓘ</span>{t.equipment}</p>}</>;
}
