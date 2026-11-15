import { test, expect } from '@playwright/test';

test.describe('Pruebas de API', () => {

  test('TC-API-01: Validar endpoint de departamentos de Mercado Libre', async ({ request }) => {
    // GET al endpoint de Mercado Libre
    const response = await request.get('https://www.mercadolibre.com.ar/menu/departments');
    
    // Validamos que el status code sea 200 (OK)
    expect(response.status()).toBe(200);
    
    // Validamos que el content-type sea JSON
    expect(response.headers()['content-type']).toContain('application/json');
    
    // Parseamos el body
    const body = await response.json();
    
    // Validamos que la respuesta contenga la propiedad 'departments'
    expect(body).toHaveProperty('departments');
  });

});