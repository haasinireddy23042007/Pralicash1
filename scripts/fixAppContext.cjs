const fs = require('fs');
const sections = JSON.parse(fs.readFileSync('sections_content.json', 'utf8'));

const mockDb = sections.find(x => x.t === 'MOCK DATABASE').c;

const tFunc = `
export function t(translations, lang, key) {
  const dict = translations[lang] || translations["en"];
  const en = translations["en"];
  return dict[key] || en[key] || key;
}
`;

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

if (!content.includes('INITIAL_DB')) {
  // Prepend mock DB and tFunc
  content = tFunc + "\\nexport " + mockDb + "\\n" + content;
  fs.writeFileSync('src/context/AppContext.jsx', content);
  console.log('Injected INITIAL_DB and t() into AppContext.jsx');
} else {
  console.log('Already injected.');
}
