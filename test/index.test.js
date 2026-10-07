import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mascararTexto, mascararObjeto, mascararJSON } from '../src/index.js';

test('mascara Bearer, token do GitHub e JWT soltos no texto', () => {
  assert.ok(!mascararTexto('Authorization: Bearer abc.def-123').includes('abc.def-123'));
  assert.ok(!mascararTexto('usei ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123').includes('ghp_'));
  const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36';
  assert.ok(!mascararTexto(`t=${jwt}`).includes('SflKxw'));
});

test('mascara número de cartão válido (Luhn), mas não um número qualquer', () => {
  assert.equal(mascararTexto('cartao 4111 1111 1111 1111 ok'), 'cartao *** ok');
  assert.ok(mascararTexto('pedido 1234567890123456 x').includes('1234567890123456')); // não passa no Luhn
});

test('mascara atribuição chave=valor quando a chave é sensível', () => {
  assert.equal(mascararTexto('user=rodrigo senha=segredo123'), 'user=rodrigo senha=***');
  assert.ok(mascararTexto('{"token":"xyz987","nome":"ana"}').includes('"token":"***"'));
  assert.ok(mascararTexto('{"token":"xyz987","nome":"ana"}').includes('"nome":"ana"'));
});

test('objeto: mascara por chave sensível, recursivo, sem mutar a entrada', () => {
  const entrada = { usuario: 'ana', senha: 'x', dados: { api_key: 'k', ok: 1 }, lista: [{ token: 't' }] };
  const saida = mascararObjeto(entrada);
  assert.equal(saida.usuario, 'ana');
  assert.equal(saida.senha, '***');
  assert.equal(saida.dados.api_key, '***');
  assert.equal(saida.dados.ok, 1);
  assert.equal(saida.lista[0].token, '***');
  assert.equal(entrada.senha, 'x'); // original intacto
});

test('não mascara campos parecidos mas inocentes', () => {
  const s = mascararObjeto({ autor: 'Rodrigo', descricao: 'token de evento', total: 10 });
  assert.equal(s.autor, 'Rodrigo');
  assert.equal(s.total, 10);
});

test('mascararJSON devolve string JSON já redigida; trata circular', () => {
  const o = { senha: 'x' }; o.self = o;
  const txt = mascararJSON(o);
  assert.ok(txt.includes('"senha":"***"'));
  assert.ok(txt.includes('[circular]'));
});
