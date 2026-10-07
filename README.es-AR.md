<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# mascarar-segredos

<!-- public-badges:start -->
[![license](assets/support/badge-license.svg)](LICENSE) [![CI](assets/support/badge-ci.svg)](https://github.com/Rdraim/mascarar-segredos/actions) [![release](assets/support/badge-release.svg)](https://github.com/Rdraim/mascarar-segredos/releases)
<!-- public-badges:end -->

Ocultamiento heurístico de secretos en texto, JSON y objetos estructurados antes de escribir logs.

## Empezá acá

Necesitás Git y Node.js 22+ para las pruebas. Sin dependencias de ejecución. Descargá este repositorio; no instales un paquete homónimo sin verificar del registro npm.

```sh
git clone https://github.com/Rdraim/mascarar-segredos.git
cd mascarar-segredos
npm test
node tools/check-public-content.mjs
```

Las importaciones del ejemplo funcionan desde la raíz del repositorio clonado. Para usar el módulo en otro proyecto, fijá una revisión Git (tag v1.2.1) o copiá el módulo conservando la licencia MIT. Esta documentación no afirma que exista una publicación en el registro npm.

```js
import { mascararObjeto, mascararTexto, mascararJSON } from './src/index.js';
console.log(mascararObjeto({ usuario: 'ejemplo', senha: 'sintético' }));
console.log(mascararTexto('password="ejemplo sintético"'));
console.log(mascararJSON({ token: 'sintético' }));
```

## API

`mascararTexto(texto)`; `mascararObjeto(obj)`; `mascararJSON(obj, espaco)`; `CHAVES_SENSIVEIS`.

Los nombres públicos de funciones y opciones se mantienen en portugués por compatibilidad.

## Comportamiento y límites

Oculta nombres de campos sensibles y patrones conocidos, incluidos cookies y campos CPF/CNPJ. El texto JSON válido se serializa de nuevo; Maps/Sets se convierten en arrays, las fechas en cadenas ISO y los ciclos en `[circular]`. No ejecuta getters. Es heurístico: no anonimiza todos los identificadores personales ni detecta todos los secretos aislados. Preferí campos de log expresamente permitidos. Limitá el tamaño de entrada antes de registrar. BigInt requiere serialización específica en la aplicación.

## Seguridad y compatibilidad

Valores entre comillas con espacios, cookies, referencias compartidas y seguridad de accesores/prototipos.

## Uso práctico — 1.2.0

La versión 1.2.0 también oculta credenciales en URL, autenticación Basic y líneas completas Authorization/Cookie/Set-Cookie. Conserva parámetros de consulta seguros para diagnóstico. La lista exportada de claves sensibles es inmutable. No es anonimización universal: pueden quedar datos personales en campos no reconocidos. Minimizá lo que recopilás y verificá los formatos reales de tus logs. Las funciones `toJSON` se neutralizan sin ejecutarlas al ocultar o serializar.

Ejemplo ejecutable con datos sintéticos: `node examples/uso.mjs`.

## Mantenimiento

Estos módulos independientes se inspiran en problemas resueltos en Nexus, proyecto de Rodrigo Rodrigues. No incluyen bases privadas, configuración de despliegue, logs, credenciales ni registros de usuarios. El mantenimiento coordinado consiste en revisar cambios relacionados en el mismo ciclo; no copia automáticamente archivos privados.

[Cómo contribuir](CONTRIBUTING.es-AR.md) · [Seguridad](SECURITY.es-AR.md)

MIT © Rodrigo Rodrigues

---

<p align="center">
  <img src="assets/support/banner-es-ar.svg" width="960" alt="Código abierto. Un café suma. Apoyá el trabajo de Rodrigo Rodrigues.">
</p>

## ☕ Invitame un café

¿Este proyecto te ayudó a resolver un problema, aprender algo nuevo o dar tus primeros pasos en desarrollo? Si querés apoyar mi trabajo, un café es una linda forma de agradecer.

Soy **Rodrigo Rodrigues**, creador de **Nexus** y de estos proyectos de código abierto. Tu aporte me ayuda a dedicar tiempo a mejorar el código, escribir ejemplos más claros y seguir compartiendo lo que aprendo.

**Aportá el monto que tenga sentido para vos. El apoyo es totalmente voluntario; el proyecto sigue siendo gratuito bajo la licencia MIT.**

[Apoyá con Pix](#apoyá-con-pix) · [Dejá un comentario](https://github.com/Rdraim/mascarar-segredos/issues/new?title=Comentario%3A%20este%20proyecto%20me%20ayud%C3%B3)

### Apoyá con Pix

En la app de tu banco, escaneá el QR o copiá la clave Pix de abajo. Elegí el monto y revisá los datos del destinatario antes de confirmar.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="QR Pix original proporcionado por Rodrigo Rodrigues; también podés usar la clave de texto de abajo.">
</p>

**Clave Pix**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Pix es el sistema de pagos de Brasil. Si tu banco no lo admite, también podés ayudar compartiendo el proyecto, reportando un problema, mejorando la documentación o dejando un comentario.

### Tu comentario también suma

[Contame cómo te ayudó el proyecto](https://github.com/Rdraim/mascarar-segredos/issues/new?title=Comentario%3A%20este%20proyecto%20me%20ayud%C3%B3). Me gustaría saber qué creaste, qué aprendiste y qué podría ser más claro para quienes recién empiezan.

Los comentarios son bienvenidos con o sin donación. Cuidá tu privacidad: no publiques comprobantes de pago, datos personales, credenciales ni información privada de usuarios en las Issues.

**Gracias por apoyar mi trabajo y ayudarme a seguir creando y compartiendo. ❤️**
