import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Directorio donde Playwright va a buscar los archivos de test (.spec.ts)
    testDir: './tests',

    // Ejecuta los tests en paralelo para que la suite sea más rápida
    fullyParallel: false,

    // Evita que se suban tests con .only a un repositorio
    forbidOnly: !!process.env.CI,

    // Reintenta los tests fallidos solo en CI (2 intentos), en local no reintenta
    retries: process.env.CI ? 2 : 0,

    // Limita la cantidad de workers en CI para no saturar el servidor
    workers: process.env.CI ? 1 : undefined,

    // Configura el reporte HTML interactivo (Punto 5 del challenge)
    reporter: [['html', { open: 'never' }]],

    // Configuraciones globales para todos los tests
    use: {
        // URL base para no repetirla en cada test (usamos la del challenge)
        baseURL: 'http://demowebshop.tricentis.com',

        // Guarda un trace (registro de acciones) solo si el test falla y se reintenta
        trace: 'on-first-retry',

        // Captura de pantalla automática SOLO cuando un test falla (Requisito del Punto 2)
        screenshot: 'only-on-failure',
    },

    // Configuración de los navegadores (Requisito de correr en Chrome y otro más)
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
    ],
});