/* ============================================================================
   mascarar-segredos — redige segredos de strings e objetos antes de logar.

   Log é o vazamento silencioso mais comum: um token no header, uma senha no
   corpo da requisição, um cartão num payload. Este módulo mascara isso ANTES de
   ir para o arquivo/console, por padrão de chave (senha, token, authorization…)
   e por padrão de valor (Bearer, prefixos de API key, cartão, CPF/CNPJ).

   Sem dependência.
   ============================================================================ */

const OCULTO = '***';

/** Nomes de campo cujo VALOR é sempre mascarado (case-insensitive, por substring). */
export const CHAVES_SENSIVEIS = Object.freeze([
  'senha', 'password', 'passwd', 'pwd',
  'secret', 'token', 'authorization',
  'apikey', 'api_key', 'access_token', 'refresh_token', 'client_secret',
  'cartao', 'cvv', 'cvc', 'private_key', 'credential',
  'cookie', 'set-cookie', 'cpf', 'cnpj',
]);

/* Valores que parecem segredo, mesmo soltos no meio do texto. */
const PADROES_VALOR = [
  /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,                 // Authorization: Bearer ...
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g,   // tokens do GitHub
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  /\bsk-[A-Za-z0-9]{20,}\b/g,                         // chaves estilo OpenAI
  /\bAKIA[0-9A-Z]{16}\b/g,                            // AWS access key id
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,                // tokens do Slack
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, // JWT
];

const digitos = (s) => s.replace(/\D/g, '');
const luhnOk = (num) => {
  let soma = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) { let d = +num[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } soma += d; alt = !alt; }
  return soma % 10 === 0;
};

/** Mascara segredos SOLTOS num texto (Bearer, prefixos de token, JWT, cartão). */
export function mascararTexto(texto) {
  let s = String(texto ?? '');
  // JSON estruturado preserva corretamente valores com espaços/aspas escapadas.
  if (/^\s*[\[{]/.test(s)) {
    try { const obj = JSON.parse(s); if (obj && typeof obj === 'object') return JSON.stringify(mascararObjeto(obj)); } catch { /* texto livre */ }
  }
  // Remove userinfo completo antes de tratar atribuições dentro de URLs.
  s = s.replace(/\b([a-z][a-z0-9+.-]*:\/\/)[^\s/@]+@/gi, '$1***@');
  s = s.replace(/([?&])([A-Za-z_][A-Za-z_0-9-]*)=([^\s&#]*)/g, (m, sep, key) => chaveSensivel(key) ? `${sep}${key}=***` : m);
  // Cabeçalhos podem ter múltiplos valores, espaços e cookies separados por ;.
  s = s.replace(/\b((?:authorization|proxy-authorization|cookie|set-cookie)[ \t]*:)[^\r\n]*/gi, '$1 ***');
  s = s.replace(/\bBasic\s+[A-Za-z0-9+/]+=*/gi, 'Basic ***');
  for (const re of PADROES_VALOR) s = s.replace(re, OCULTO);
  // número de cartão (13–19 dígitos, com ou sem separador) que passa no Luhn
  s = s.replace(/\b\d(?:[ -]?\d){12,18}\b/g, (m) => { const d = digitos(m); return (d.length >= 13 && d.length <= 19 && luhnOk(d)) ? OCULTO : m; });
  // atribuições "chave: valor" / "chave=valor" com chave sensível
  s = s.replace(/("?[A-Za-z_][A-Za-z_0-9-]*"?)\s*([:=])\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s,;}&#"']+)/g, (m, chave, sep, valor) => {
    const nome = chave.replace(/"/g, '').toLowerCase();
    const asp = /^["']/.test(valor) ? valor[0] : '';
    return CHAVES_SENSIVEIS.some((c) => nome.includes(c)) ? `${chave}${sep}${asp}${OCULTO}${asp}` : m;
  });
  return s;
}

const chaveSensivel = (k) => { const n = String(k).toLowerCase(); return CHAVES_SENSIVEIS.some((c) => n.includes(c)); };

/** Devolve uma CÓPIA do objeto com valores de chaves sensíveis mascarados (recursivo). */
export function mascararObjeto(obj, _visto = new WeakSet()) {
  if (typeof obj === 'function' || typeof obj === 'symbol') return `[${typeof obj}]`;
  if (obj == null || typeof obj !== 'object') return typeof obj === 'string' ? mascararTexto(obj) : obj;
  if (_visto.has(obj)) return '[circular]';
  _visto.add(obj);
  try {
    if (Array.isArray(obj)) return obj.map((v) => mascararObjeto(v, _visto));
    if (obj instanceof Date) return obj.toISOString();
    if (obj instanceof Map) return [...obj].map(([k, v]) => [mascararObjeto(k, _visto), chaveSensivel(k) ? OCULTO : mascararObjeto(v, _visto)]);
    if (obj instanceof Set) return [...obj].map((v) => mascararObjeto(v, _visto));
    const saida = {};
    for (const [k, descritor] of Object.entries(Object.getOwnPropertyDescriptors(obj))) {
      if (!descritor.enumerable) continue;
      const v = chaveSensivel(k) ? OCULTO : 'value' in descritor ? mascararObjeto(descritor.value, _visto) : '[accessor]';
      Object.defineProperty(saida, k, { value: v, enumerable: true, configurable: true, writable: true });
    }
    return saida;
  } finally { _visto.delete(obj); }
}

/** Açúcar: devolve JSON com os segredos mascarados. */
export function mascararJSON(obj, espaco = 0) { return JSON.stringify(mascararObjeto(obj), null, espaco); }

export default mascararObjeto;
