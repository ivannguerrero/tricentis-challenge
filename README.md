# QA Automation Challenge - Tricentis Demo Web Shop

Este proyecto contiene la resolución del challenge técnico de QA Manual con Automation. Incluye la documentación de pruebas, el framework de automatización con Playwright y TypeScript, y las pruebas de API.

## Tecnologías utilizadas

- **Playwright**: Framework de automatización de pruebas.
- **TypeScript**: Lenguaje de programación.
- **Node.js**: Entorno de ejecución.
- **Mercado Libre API**: Endpoint público para pruebas de API.

## Requisitos previos

- **Node.js** (v18 o superior)
- **Git**

## Instalación

1. Cloná el repositorio:
   git clone https://github.com/ivannguerrero/tricentis-challenge.git

2. Navegá a la carpeta:
   cd tricentis-challenge

3. Instalá las dependencias:
   npm install

4. Instalá los navegadores:
   npx playwright install

## Cómo ejecutar las pruebas

- Todos los tests: npx playwright test
- Un archivo específico: npx playwright test tests/login.spec.ts
- Modo visual: npx playwright test --headed
- Un test por nombre: npx playwright test -g "TC-LOG-01"
- Ver reporte HTML: npx playwright show-report

## Estructura del proyecto

docs/ pages/ tests/ utils/ playwright.config.ts tsconfig.json package.json README.md

## Documentación adicional

En la carpeta docs/ se encuentra:
- Test_Plan.md
- Test_Cases.md
- Test_Suites.md
- Bug_Report.md
- API_Testing_Steps.md
- API_Test_Case.md
- AI_Chat_Log.md

## Navegadores soportados

- Chromium (Chrome)
- Firefox

## Contacto

**Ivan Nicolas Guerrero**
- Email: ivanguerrero@outlook.com
- LinkedIn: [Ivan Nicolas Guerrero](https://linkedin.com/in/ivannguerrero/)
