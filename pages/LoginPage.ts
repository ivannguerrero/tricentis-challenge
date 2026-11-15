import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly logoutButton: Locator;
    readonly welcomeMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locators de la página de login
        this.emailInput = page.locator('#Email');
        this.passwordInput = page.locator('#Password');
        this.loginButton = page.locator('input[value="Log in"]');
        this.errorMessage = page.locator('.validation-summary-errors');
        this.logoutButton = page.locator('.ico-logout');
        this.welcomeMessage = page.locator('a.account').filter({ hasText: 'juliososa@hotmail.com' });
    }

    // Ir a la página de login
    async goto(): Promise<void> {
        await this.page.goto('/login');
    }

    // Completar credenciales y hacer clic en login
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    // Verificar si el usuario está logueado
    async isLoggedIn(): Promise<boolean> {
        return await this.logoutButton.isVisible();
    }

    // Obtener el texto del mensaje de error
    async getErrorMessage(): Promise<string | null> {
        return await this.errorMessage.textContent();
    }
}