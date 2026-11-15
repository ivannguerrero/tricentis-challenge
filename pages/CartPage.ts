import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly addToCartButton: Locator;
    readonly cartLink: Locator;
    readonly cartQuantity: Locator;
    readonly removeCheckbox: Locator;
    readonly updateCartButton: Locator;
    readonly emptyCartMessage: Locator;
    readonly successNotification: Locator;

    constructor(page: Page) {
        this.page = page;
        // Botón de "Add to cart" en la página de detalle del producto
        this.addToCartButton = page.locator('input[value="Add to cart"]').first();
        this.cartLink = page.locator('.header-links a.ico-cart').first();
        this.cartQuantity = page.locator('.cart-qty');
        // Checkbox de eliminar dentro de la fila del carrito
        this.removeCheckbox = page.locator('input[name^="removefromcart"]').first();
        this.updateCartButton = page.locator('input[name="updatecart"]');
        this.emptyCartMessage = page.locator('.order-summary-content');
        // Notificación de éxito
        this.successNotification = page.locator('.bar-notification.success');
    }

    // Ir directo a la página de detalle del producto "14.1-inch Laptop"
    async gotoProductDetail(): Promise<void> {
        await this.page.goto('/141-inch-laptop');
    }

    // Agregar el producto y esperar la notificación
    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
        await this.successNotification.waitFor({ state: 'visible' });
    }

    // Ir al carrito y esperar a que cargue la página
    async goToCart(): Promise<void> {
        await this.cartLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    // Eliminar el producto del carrito
    async removeProduct(): Promise<void> {
        await this.removeCheckbox.check();
        await this.updateCartButton.click();
    }
}