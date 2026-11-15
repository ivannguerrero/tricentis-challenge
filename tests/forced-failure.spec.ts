import { test, expect } from '@playwright/test';

test.describe('Test de Falla Forzada', () => {

    test('TC-FORCED-01: Test diseñado para fallar y validar captura de pantalla', async ({ page }) => {
        // Navegamos a la página principal
        await page.goto('/');

        // Buscamos un elemento que NO existe para forzar la falla y Playwright va a tomar una captura
        await expect(page.locator('#elemento-que-no-existe')).toBeVisible({ timeout: 2000 });
    });

});