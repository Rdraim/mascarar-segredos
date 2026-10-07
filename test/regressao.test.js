import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mascararTexto, mascararObjeto } from '../src/index.js';
test('valores com espaços, cookies e objetos compartilhados', () => {
  assert.ok(!mascararTexto('password="fixture with spaces"').includes('with spaces'));
  assert.equal(mascararObjeto({ cookie: 'fixture', cpf: 'synthetic' }).cookie, '***');
  const compartilhado = { senha: 'fixture' };
  const o = mascararObjeto({ a: compartilhado, b: compartilhado });
  assert.equal(o.a.senha, '***'); assert.equal(o.b.senha, '***');
});
test('não invoca getters nem muda protótipo a partir de __proto__', () => {
  const o = { get valor() { throw new Error('não invocar'); } };
  assert.equal(mascararObjeto(o).valor, '[accessor]');
  const proto = mascararObjeto(JSON.parse('{"__proto__":{"senha":"fixture"}}'));
  assert.ok(Object.hasOwn(proto, '__proto__'));
  assert.equal(Object.getPrototypeOf(proto), Object.prototype);
  assert.equal(proto.__proto__.senha, '***');
});
