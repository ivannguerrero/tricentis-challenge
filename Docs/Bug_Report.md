# Bug Report

## Información General
- **ID del Defecto:** BUG-001
- **Título:** El cálculo de envío (Estimate Shipping) devuelve $0.00 al usar el estado Illinois y código postal 10001.
- **Módulo:** Carrito de Compras / Checkout (Shipping Estimate)
- **Severidad:** Alta (High) - Afecta la lógica de negocio y el cálculo de costos.
- **Prioridad:** Alta (High) - Impacta directamente en la conversión y la experiencia de compra.
- **Estado:** Abierto (Open)

## Entorno
- **URL:** http://demowebshop.tricentis.com/cart
- **Navegador:** Google Chrome (última versión estable).
- **Sistema Operativo:** Windows 11.
- **Resolución:** 1920x1080.

## Pasos para Reproducir
1. Ingresar a la página principal y agregar el producto "14.1-inch Laptop" al carrito.
2. Ir al carrito de compras (`http://demowebshop.tricentis.com/cart`).
3. En la sección "Estimate Shipping", seleccionar País: **United States**.
4. Seleccionar Estado: **Illinois**.
5. Ingresar el código postal: **10001**.
6. Hacer clic en el botón "Estimate".

## Resultado Esperado
El sistema debería calcular el costo de envío en función de la ubicación (Illinois, CP 10001) y el peso del producto ("14.1-inch Laptop"), mostrando un monto mayor a $0.00 en el resumen del carrito. El subtotal debería actualizarse sumando el costo de envío correspondiente.

## Resultado Actual
El sistema no realiza el cálculo. Tanto el costo de envío como el total general se muestran en **$0.00**, a pesar de haber ingresado una ubicación válida (United States, Illinois, 10001). No se refleja ningún cambio en el precio ni se muestra un mensaje de error que explique la falta de cálculo.

## Impacto
**Crítico para el negocio.** El cliente no puede conocer el costo real de su compra, lo que genera desconfianza y abandono del carrito. Además, el sistema no está aplicando las reglas de negocio correspondientes al cálculo de envío por ubicación, lo que podría derivar en pérdidas económicas si el envío no se cobra correctamente.

## Evidencia
![Captura de pantalla del bug](evidencias/bug_shipping_0.jpg)