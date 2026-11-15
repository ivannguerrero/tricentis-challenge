import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Flujo de Login', () => {

    test('TC-LOG-01: Login exitoso con credenciales válidas', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login('juliososa@hotmail.com', '12345678');

        // Validamos que el link con el email del usuario sea visible
        await expect(loginPage.welcomeMessage).toBeVisible({ timeout: 5000 });
    });

    test('TC-LOG-02: Login fallido por contraseña incorrecta', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login('juliososa@hotmail.com', 'WrongPassword!');

        // Validamos que aparezca el mensaje de error
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toContain('The credentials provided are incorrect');
    });

    test('TC-LOG-03: Validación de campos vacíos en Login', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login('', '');

        // Validamos que aparezca el mensaje de error de cuenta no encontrada
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toContain('No customer account found');
    });

});