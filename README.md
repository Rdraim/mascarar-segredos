<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# mascarar-segredos

## Segurança e compatibilidade

Valores entre aspas com espaços, cookies, referências compartilhadas e proteção contra getters/protótipos.

Mascara por chave sensível e alguns padrões conhecidos de valores. Inclui cookies e campos CPF/CNPJ. JSON válido é reserializado; Map/Set viram arrays, datas viram ISO, getters não são executados e ciclos viram `[circular]`. É heurístico: não anonimiza todos os dados pessoais e não detecta todo segredo solto. Prefira logs com lista explícita de campos permitidos. Não transforme uma entrada arbitrária enorme em log: aplique limites na aplicação. BigInt exige serialização específica.

Baixe pelo GitHub; não é necessário instalar um pacote homônimo do npm. Para consumir em outro projeto, use uma revisão Git fixada (tag v1.2.0) ou copie o módulo e preserve a licença. Os exemplos abaixo usam importação local após o clone. Node.js 22 ou superior para os testes.

Redige **segredos** de strings e objetos **antes de logar**. Sem dependência.

Log é o vazamento silencioso mais comum: um token no header, uma senha no corpo
da requisição, um cartão num payload — tudo indo parar no arquivo de log em
claro. Este módulo mascara isso na hora de registrar, por **padrão de chave**
(`senha`, `token`, `authorization`…) e por **padrão de valor** (Bearer, prefixos
de token de API, JWT, número de cartão válido por Luhn).

## Instalação

```bash
git clone https://github.com/techrodrigo21-ux/mascarar-segredos.git
cd mascarar-segredos
npm test
```

## Uso

```js
import { mascararObjeto, mascararTexto, mascararJSON } from './src/index.js';

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
  `private_key`, `credential`… (`CHAVES_SENSIVEIS` é uma lista imutável).
- **Por valor**: `Bearer …`, tokens do GitHub (`ghp_…`, `github_pat_…`), chaves
  `sk-…`, AWS `AKIA…`, tokens do Slack `xox…`, **JWT**, e número de **cartão**
  (13–19 dígitos que passam no Luhn).

> Defesa em profundidade, não bala de prata: prefira **não coletar** o segredo no
> log em primeiro lugar. Use isto como rede de segurança e revise os padrões para
> o seu domínio.

## Testes

Exemplo executável: `node examples/uso.mjs`. A serialização também neutraliza
funções `toJSON` da entrada, evitando executar código durante a redação.

Credenciais em URLs (`protocolo://usuario:senha@host`), autenticação Basic e
cabeçalhos completos Authorization/Cookie/Set-Cookie também são mascarados.
Parâmetros seguros após um segredo na URL continuam disponíveis no diagnóstico.
Não é anonimização universal: valores pessoais em campos não reconhecidos podem
permanecer. Sempre minimize os dados coletados e teste seus formatos de log.


```bash
npm test
```

## Licença

MIT © Rodrigo Rodrigues

## Manutenção e apoio

Código independente inspirado em problemas resolvidos no Nexus, projeto de Rodrigo Rodrigues. Não inclui banco, configuração privada, logs, dados de usuários ou credenciais. Evolução coordenada significa revisar mudanças relacionadas no mesmo ciclo; não há cópia automática de arquivos privados.

[Como contribuir](CONTRIBUTING.md) · [Segurança](SECURITY.md)

---

<p align="center">
  <img src="assets/support/banner-pt-br.svg" width="960" alt="Código aberto. Um café faz diferença. Apoie o trabalho de Rodrigo Rodrigues.">
</p>

## ☕ Me pague um café

Este projeto te ajudou a resolver um problema, aprender algo novo ou dar os primeiros passos no desenvolvimento? Se você sentir vontade de apoiar meu trabalho, um café é uma forma carinhosa de agradecer.

Sou **Rodrigo Rodrigues**, criador do **Nexus** e destes projetos de código aberto. Seu apoio me ajuda a dedicar tempo para melhorar o código, escrever exemplos mais claros e continuar compartilhando o que aprendo.

**Contribua com o valor que fizer sentido para você. O apoio é totalmente voluntário — o projeto continua gratuito sob a licença MIT.**

<p>
  <a href="#apoie-com-pix"><img src="assets/support/pix-pt-br.svg" width="190" height="44" alt="Apoiar com Pix"></a>
  <a href="https://github.com/techrodrigo21-ux/mascarar-segredos/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou"><img src="assets/support/comment-pt-br.svg" width="210" height="44" alt="Deixar um comentário"></a>
</p>

### Apoie com Pix

No aplicativo do seu banco, escaneie o QR Code ou copie a chave Pix abaixo. Escolha o valor e confira os dados do destinatário antes de confirmar.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="QR Code Pix original fornecido por Rodrigo Rodrigues; a chave em texto abaixo é uma alternativa.">
</p>

**Chave Pix**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Você também pode apoiar compartilhando o projeto, relatando um problema, melhorando a documentação ou deixando um comentário.

### Seu comentário também faz diferença

[Conte como o projeto te ajudou](https://github.com/techrodrigo21-ux/mascarar-segredos/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou). Vou gostar de saber o que você criou, o que aprendeu e o que poderia ficar mais claro para quem está começando.

O comentário é bem-vindo com ou sem doação. Preserve sua privacidade: não publique comprovantes, dados pessoais, credenciais ou informações de usuários nas Issues.

---

**Obrigado por apoiar meu trabalho e me ajudar a continuar criando e compartilhando. ❤️**
