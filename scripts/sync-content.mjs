import { readFile, writeFile } from 'node:fs/promises';

const source = new URL('../backend/content.json', import.meta.url);
const data = JSON.parse(await readFile(source, 'utf8'));
for (const language of ['az', 'en', 'ru']) {
  for (const key of ['research', 'methods', 'resultsList', 'projectsList', 'papersList']) {
    if (!Array.isArray(data[language]?.[key])) throw new Error(`Invalid content: ${language}.${key}`);
  }
}
await writeFile(new URL('../src/content.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
console.log('Trilingual content snapshot synchronized.');
