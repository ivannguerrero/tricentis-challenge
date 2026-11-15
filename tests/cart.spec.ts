import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Flujo de Carrito de Compras', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('juliososa@hotmail.com', '12345678');
  });

  test('TC-CART-01: Agregar un producto al carrito', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.gotoProductDetail();
    
    await cartPage.addToCart();
    
    // Verificamos que el contador del carrito ya no esté en (0)
    await expect(cartPage.cartQuantity).not.toContainText('(0)');
  });

  test('TC-CART-02: Eliminar un producto del carrito', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.gotoProductDetail();
    
    await cartPage.addToCart();
    await cartPage.goToCart();
    await page.waitForSelector('.cart-item-row', { state: 'visible' });
    await cartPage.removeProduct();
    
    // Validamos que el carrito esté vacío
    await expect(cartPage.emptyCartMessage).toContainText('Your Shopping Cart is empty!');
  });

});