# Caso de Prueba de API Documentado

## Información del Caso
- **ID:** TC-API-01
- **Título:** Validar que el endpoint de departamentos de Mercado Libre devuelva la estructura correcta.
- **Endpoint:** `GET https://www.mercadolibre.com.ar/menu/departments`
- **Herramienta:** Playwright (APIRequestContext) / Postman.

## Precondiciones
- Conexión a internet activa.
- No se requiere autenticación (el endpoint es público).

## Pasos de Ejecución
1. Realizar una petición HTTP GET a la URL `https://www.mercadolibre.com.ar/menu/departments`.
2. Capturar la respuesta del servidor.
3. Validar el código de estado (Status Code).
4. Validar el encabezado `Content-Type`.
5. Parsear el cuerpo de la respuesta a formato JSON.
6. Validar que el JSON contenga la propiedad `departments`.

## Datos de Prueba
- **Método:** GET
- **Headers:** N/A.
- **Body:** N/A.

## Resultado Esperado
1. El servidor debe devolver un **Status Code 200 OK**.
2. El header `Content-Type` debe incluir `application/json`.
3. El cuerpo de la respuesta debe ser un objeto JSON válido.
4. El objeto JSON debe tener la propiedad `departments` (y no debe estar vacía).

## Resultado Actual
*(Se completa después de ejecutar el test. Si pasa, se indica "OK - Coincide con lo esperado").*

## Ejemplo de la validación (Fragmento de código)
```typescript
import { test, expect } from '@playwright/test';

test('Validar endpoint de departamentos de Mercado Libre', async ({ request }) => {
  const response = await request.get('https://www.mercadolibre.com.ar/menu/departments');
  
  // Validar status code
  expect(response.status()).toBe(200);
  
  // Validar content-type
  expect(response.headers()['content-type']).toContain('application/json');
  
  // Parsear el body
  const body = await response.json();
  
  // Validar que exista la propiedad 'departments'
  expect(body).toHaveProperty('departments');
});