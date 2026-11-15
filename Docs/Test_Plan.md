# Test Plan - Tricentis Demo Web Shop

## 1. Overview (Resumen)
Este plan define la estrategia para probar las funcionalidades de Registro, Login y Carrito de Compras en la Demo Web Shop. La idea es combinar testing manual y automatización con Playwright y TypeScript para validar los flujos principales del usuario.

## 2. Bounds (Alcance)
**Dentro del alcance:** Registro de nuevos usuarios, Login (válido e inválido) y Carrito de Compras (agregar y eliminar productos).
**Fuera del alcance:** Checkout, pasarela de pagos, Wishlist y recuperación de contraseña.

## 3. Quality Risks (Riesgos)
- **Entorno:** Al ser una demo pública, la base de datos puede reiniciarse, haciendo que los usuarios creados desaparezcan durante las pruebas.
- **UI:** Cambios en los selectores o en el diseño que puedan romper los scripts de automatización y generar falsos positivos (flaky tests).

## 4. Schedule (Cronograma)
- **Día 1:** Análisis de la plataforma, redacción del Test Plan, diseño de casos de prueba y Bug Report.
- **Día 2:** Desarrollo del framework con Playwright y TypeScript, y ejecución de los tests.
- **Día 3:** Configuración de reportes, test de falla forzada, pruebas de API y redacción del README.

## 5. Entry and Exit Criteria (Criterios de Entrada y Salida)
- **Entrada:** El entorno debe estar operativo y accesible.
- **Salida:** Los 6 casos automatizados deben ejecutarse correctamente (excepto el test de falla forzada, que debe fallar para validar la captura de pantalla).

## 6. Test Configurations (Entornos)
- **Navegadores:** Google Chrome y Mozilla Firefox (última versión estable).
- **Sistema Operativo:** Windows / MacOS.
- **Resolución:** 1920x1080.

## 7. Test Execution (Ejecución)
Las pruebas se ejecutan manualmente para validar la lógica de negocio y de forma automatizada con Playwright y TypeScript para las pruebas de regresión.