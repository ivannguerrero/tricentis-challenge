import { test, expect } from '@playwright/test';

test.describe('Forced Failure Test', () => {

  test('TC-FORCED-01: Test diseñado para fallar y validar captura de pantalla', async ({ page }) => {
    // Navegamos a la página principal
    await page.goto('/');
    
    // Escribimos algo en el buscador para que quede evidencia visual
    await page.locator('#small-searchterms').fill('producto inexistente');
    
    // Hacemos clic en el botón de buscar
    await page.locator('input[value="Search"]').click();
    
    // Ahora buscamos un elemento que NO existe para forzar la falla
    await expect(page.locator('#elemento-que-no-existe')).toBeVisible({ timeout: 2000 });
  });

});