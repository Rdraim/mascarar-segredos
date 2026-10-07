import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mascararTexto, mascararJSON, CHAVES_SENSIVEIS } from '../src/index.js';

test('URLs preservam host e parâmetros seguros sem credenciais', () => {
  assert.equal(mascararTexto('falha https://example:synthetic@db.example.test/app?token=secret&retry=true'),
    'falha https://***@db.example.test/app?token=***&retry=true');
  assert.equal(mascararTexto('https://example.test/?password=synthetic#section'), 'https://example.test/?password=***#section');
});
test('serialização não executa toJSON da entrada', () => {
  const o = { senha: 'synthetic', toJSON() { throw Error('not called'); } };
  assert.equal(mascararJSON(o), '{"senha":"***","toJSON":"[function]"}');
});
test('cabeçalhos completos e Basic não deixam valores residuais', () => {
  assert.equal(mascararTexto('Cookie: session=synthetic; other=another\nSet-Cookie: session=synthetic; Path=/\nAuthorization: Basic c3ludGhldGlj\nX-Request-ID: demo'),
    'Cookie:***\nSet-Cookie:***\nAuthorization:***\nX-Request-ID: demo');
  assert.equal(mascararTexto('auth Basic c3ludGhldGlj'), 'auth Basic ***');
  assert.equal(mascararTexto('request Cookie: session=synthetic; other=another'), 'request Cookie:***');
});
test('padrões exportados não podem ser removidos pelo consumidor', () => {
  assert.throws(() => CHAVES_SENSIVEIS.pop(), TypeError);
  assert.equal(mascararTexto('password=synthetic'), 'password=***');
});
