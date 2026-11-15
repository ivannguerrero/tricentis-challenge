import { Page, Locator } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly genderMale: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly registerButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locators de la página de registro
        this.genderMale = page.locator('#gender-male');
        this.firstNameInput = page.locator('#FirstName');
        this.lastNameInput = page.locator('#LastName');
        this.emailInput = page.locator('#Email');
        this.passwordInput = page.locator('#Password');
        this.confirmPasswordInput = page.locator('#ConfirmPassword');
        this.registerButton = page.locator('#register-button');
        this.successMessage = page.locator('.result');
    }

    // Ir a la página de registro
    async goto(): Promise<void> {
        await this.page.goto('/register');
    }

    // Completar el formulario de registro
    async register(firstName: string, lastName: string, email: string, password: string): Promise<void> {
        await this.genderMale.check();
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
        await this.registerButton.click();
    }
}