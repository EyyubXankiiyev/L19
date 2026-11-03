export function tx(lang, az, en, ru) {
  return lang === 'ru' ? ru : lang === 'az' ? az : en;
}
export const asset = path => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
