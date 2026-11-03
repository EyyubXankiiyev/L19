export function tx(lang, az, en, ru) {
  return lang === 'ru' ? ru : lang === 'az' ? az : en;
}
