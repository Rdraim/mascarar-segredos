// Exemplo sintético / Synthetic example. No production access.
import { mascararObjeto, mascararTexto } from '../src/index.js';
console.log(mascararObjeto({ senha: 'synthetic', evento: 'example' }));
console.log(mascararTexto('https://example:synthetic@example.test/path?token=synthetic&ok=true'));
