# mascarar-segredos

[Brazilian Portuguese](README.md) · [Voluntary support](SUPPORT.md)

Best-effort secret redaction for text, JSON and structured objects before logging.

## Start here

Version 1.2.0 also redacts URL userinfo, Basic authentication and complete
Authorization/Cookie/Set-Cookie header lines. Safe query parameters remain
available for diagnostics. The exported sensitive-key list is immutable.
This is not universal anonymization: personal data in unrecognized fields can
remain. Minimize collected data and test your application's log formats.

Run `node examples/uso.mjs` for synthetic examples. Input `toJSON` functions
are neutralized rather than executed while redacting or serializing.

Requires Git and Node.js 22+ for tests. No runtime dependencies. Download the actual repository rather than an unverified same-name npm package.

```sh
git clone https://github.com/techrodrigo21-ux/mascarar-segredos.git
cd mascarar-segredos
npm test
node tools/check-public-content.mjs
```

These imports work from the cloned repository root. To use the module in another project, install a pinned Git tag (v1.2.0) or copy the module while retaining the MIT license. This documentation does not claim an npm registry release.

```js
import { mascararObjeto, mascararTexto, mascararJSON } from './src/index.js';
console.log(mascararObjeto({ usuario: 'example', senha: 'synthetic' }));
console.log(mascararTexto('password="synthetic example"'));
console.log(mascararJSON({ token: 'synthetic' }));
```

## API

`mascararTexto(texto)`; `mascararObjeto(obj)`; `mascararJSON(obj, espaco)`; `CHAVES_SENSIVEIS`.

Public function and option names remain in Portuguese for compatibility.

## Behavior and limits

Redacts sensitive key names and selected known value patterns, including cookies and CPF/CNPJ fields. Valid JSON text is reserialized; Maps/Sets become arrays, dates become ISO strings, getters are not executed, and cycles become `[circular]`. This is heuristic: it does not anonymize every personal identifier or detect every standalone secret. Prefer allowlisted log fields. Apply input-size limits before logging. BigInt requires application-specific serialization.

## Maintenance

These standalone modules are inspired by work on Nexus, Rodrigo Rodrigues's independent project. They contain no private database, deployment configuration, logs, credentials or user records. Coordinated maintenance means reviewing related changes in the same release cycle, not automatically copying private source files.

## Security and compatibility

Quoted values with spaces, cookies, shared references and accessor/prototype safety.

[Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Voluntary support](SUPPORT.md)

MIT © Rodrigo Rodrigues
