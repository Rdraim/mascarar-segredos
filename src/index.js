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
export const CHAVES_SENSIVEIS = [
  'senha', 'password', 'passwd', 'pwd',
  'secret', 'token', 'authorization',
  'apikey', 'api_key', 'access_token', 'refresh_token', 'client_secret',
  'cartao', 'cvv', 'cvc', 'private_key', 'credential',
];

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
  for (const re of PADROES_VALOR) s = s.replace(re, OCULTO);
  // número de cartão (13–19 dígitos, com ou sem separador) que passa no Luhn
  s = s.replace(/\b\d(?:[ -]?\d){12,18}\b/g, (m) => { const d = digitos(m); return (d.length >= 13 && d.length <= 19 && luhnOk(d)) ? OCULTO : m; });
  // atribuições "chave: valor" / "chave=valor" com chave sensível
  s = s.replace(/("?[A-Za-z_]+"?)\s*([:=])\s*("?)([^\s,;}"']+)\3/g, (m, chave, sep, asp, valor) => {
    const nome = chave.replace(/"/g, '').toLowerCase();
    return CHAVES_SENSIVEIS.some((c) => nome.includes(c)) ? `${chave}${sep}${asp}${OCULTO}${asp}` : m;
  });
  return s;
}

const chaveSensivel = (k) => { const n = String(k).toLowerCase(); return CHAVES_SENSIVEIS.some((c) => n.includes(c)); };

/** Devolve uma CÓPIA do objeto com valores de chaves sensíveis mascarados (recursivo). */
export function mascararObjeto(obj, _visto = new WeakSet()) {
  if (obj == null || typeof obj !== 'object') return typeof obj === 'string' ? mascararTexto(obj) : obj;
  if (_visto.has(obj)) return '[circular]';
  _visto.add(obj);
  if (Array.isArray(obj)) return obj.map((v) => mascararObjeto(v, _visto));
  const saida = {};
  for (const [k, v] of Object.entries(obj)) {
    if (chaveSensivel(k)) saida[k] = OCULTO;
    else saida[k] = mascararObjeto(v, _visto);
  }
  return saida;
}

/** Açúcar: devolve JSON com os segredos mascarados. */
export function mascararJSON(obj, espaco = 0) { return JSON.stringify(mascararObjeto(obj), null, espaco); }

export default mascararObjeto;
