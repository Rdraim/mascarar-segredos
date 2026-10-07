# mascarar-segredos

Redige **segredos** de strings e objetos **antes de logar**. Sem dependência.

Log é o vazamento silencioso mais comum: um token no header, uma senha no corpo
da requisição, um cartão num payload — tudo indo parar no arquivo de log em
claro. Este módulo mascara isso na hora de registrar, por **padrão de chave**
(`senha`, `token`, `authorization`…) e por **padrão de valor** (Bearer, prefixos
de token de API, JWT, número de cartão válido por Luhn).

## Instalação

```bash
npm install mascarar-segredos
```

## Uso

```js
import { mascararObjeto, mascararTexto, mascararJSON } from 'mascarar-segredos';

// objeto (ex.: antes de logar o corpo/headers de uma requisição)
mascararObjeto({ usuario: 'ana', senha: 'x', dados: { api_key: 'k' } });
// → { usuario: 'ana', senha: '***', dados: { api_key: '***' } }

// texto solto (ex.: uma linha de log já montada)
mascararTexto('Authorization: Bearer abc.def-123');  // 'Authorization: ***'
mascararTexto('cartao 4111 1111 1111 1111');          // 'cartao ***'

// JSON pronto p/ o log
logger.info(mascararJSON(req.body));
```

Integrando num logger:

```js
const log = (nivel, msg, dados) => console[nivel](msg, mascararObjeto(dados));
```

## O que é mascarado

- **Por chave** (valor vira `***`): `senha`, `password`, `pwd`, `secret`, `token`,
  `authorization`, `api_key`, `access_token`, `client_secret`, `cartao`, `cvv`,
  `private_key`, `credential`… (ajuste em `CHAVES_SENSIVEIS`).
- **Por valor**: `Bearer …`, tokens do GitHub (`ghp_…`, `github_pat_…`), chaves
  `sk-…`, AWS `AKIA…`, tokens do Slack `xox…`, **JWT**, e número de **cartão**
  (13–19 dígitos que passam no Luhn).

> Defesa em profundidade, não bala de prata: prefira **não coletar** o segredo no
> log em primeiro lugar. Use isto como rede de segurança e revise os padrões para
> o seu domínio.

## Testes

```bash
npm test
```

## Licença

MIT © Rodrigo Rodrigues
