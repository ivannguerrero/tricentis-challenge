import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('Flujo de Registro', () => {

    test('TC-REG-01: Registro exitoso con datos válidos', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();

        // Generamos un email único para evitar duplicados
        const uniqueEmail = `test_${Date.now()}@example.com`;

        await registerPage.register('John', 'Doe', uniqueEmail, 'Password123!');

        // Validamos que aparezca el mensaje de éxito
        await expect(registerPage.successMessage).toContainText('Your registration completed');
    });

    test('TC-REG-02: Registro fallido por email duplicado', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();

        // Usamos un email que ya existe (el mismo que usamos para el login)
        await registerPage.register('John', 'Doe', 'juliososa@hotmail.com', 'Password123!');

        // Validamos que aparezca el mensaje de error
        const errorMessage = page.locator('.validation-summary-errors');
        await expect(errorMessage).toContainText('The specified email already exists');
    });

});