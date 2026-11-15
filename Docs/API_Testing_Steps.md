# Pasos para llevar a cabo Pruebas de API

Cuando encaro pruebas de API, mi proceso siempre arranca mucho antes de abrir Postman o la herramienta que use. Todo empieza entendiendo qué es lo que tengo que probar y cómo funciona el servicio.

**1. Entender el requerimiento y el contrato**
Lo primero es juntarme con la documentación (Swagger, OpenAPI o lo que haya) y ver qué endpoints existen. Necesito saber qué método usa cada uno (GET, POST, PUT, DELETE), qué headers pide (por ejemplo, si requiere token de autenticación) y qué estructura tiene el body. Si no hay documentación, me toca revisar el código o preguntarle al dev.

**2. Armar los casos de prueba**
Con el contrato claro, diseño qué voy a probar. No me quedo solo con el camino feliz (que el endpoint devuelva 200 OK). Pienso en los escenarios de error: ¿qué pasa si mando un JSON mal formado (400)? ¿Si me olvido el token (401)? ¿Si el recurso no existe (404)? También defino qué campos del JSON de respuesta son obligatorios y qué tipos de datos espero.

**3. Preparar el entorno**
Antes de ejecutar, armo las variables de entorno para no hardcodear la URL base ni los tokens (eso es fundamental para que las pruebas sean reutilizables). Si voy a crear un usuario, genero un email único en el momento para no chocar con datos existentes.

**4. Ejecutar y validar**
Acá sí abro Postman (o directamente escribo el script en Playwright si estoy automatizando). Mando la petición, miro el status code, el tiempo de respuesta y el body. Si voy a automatizar, escribo las aserciones en la pestaña "Tests" de Postman o con `expect()` en el código para que no tenga que revisar todo a ojo cada vez.

**5. Documentar y reportar**
Si el endpoint funciona, dejo registro de la evidencia (request y response). Si falla, armo el Bug Report con el endpoint exacto, los parámetros que usé y la diferencia entre lo que esperaba y lo que recibí. Al final, lo que busco es tener una colección de pruebas que pueda correr en cada release para asegurarme de que nada se rompió.