# Casos de Prueba

## Flujo de Login

| ID | Título | Precondiciones | Pasos | Datos de Prueba | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-LOG-01** | Login exitoso con credenciales válidas | Usuario registrado. | 1. Ir al Login.<br>2. Ingresar email y contraseña válidos.<br>3. Clic en "Log in". | Email: `test_user@example.com`<br>Pass: `Password123!` | Redirige al home y muestra el mensaje "Welcome to our store". |
| **TC-LOG-02** | Login fallido por contraseña incorrecta | Usuario registrado. | 1. Ir al Login.<br>2. Ingresar email válido y contraseña incorrecta.<br>3. Clic en "Log in". | Email: `test_user@example.com`<br>Pass: `WrongPass!` | Muestra el error "The credentials provided are incorrect". No permite el ingreso. |
| **TC-LOG-03** | Validación de campos vacíos en Login | Ninguna. | 1. Ir al Login.<br>2. Dejar email y contraseña vacíos.<br>3. Clic en "Log in". | Email: (vacío)<br>Pass: (vacío) | Muestra el mensaje "Please enter your email" y no permite el envío. |

## Flujo de Carrito de Compras

| ID | Título | Precondiciones | Pasos | Datos de Prueba | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-CART-01** | Agregar producto al carrito desde el home | Usuario logueado. | 1. Ir al home.<br>2. Seleccionar un producto.<br>3. Clic en "Add to cart".<br>4. Ir al carrito. | Producto: "Build your own computer" | El producto aparece en el carrito con cantidad 1 y el precio correcto. |
| **TC-CART-02** | Agregar múltiples unidades de un producto | Usuario logueado. | 1. Ir a la página de un producto.<br>2. Cambiar cantidad a 3.<br>3. Clic en "Add to cart".<br>4. Ir al carrito. | Producto: "14.1-inch Laptop"<br>Cantidad: 3 | El carrito muestra el producto con cantidad 3 y el subtotal multiplicado correctamente. |
| **TC-CART-03** | Eliminar un producto del carrito | Tener al menos 1 producto en el carrito. | 1. Ir al carrito.<br>2. Marcar el checkbox del producto.<br>3. Clic en "Update shopping cart". | Producto: "Build your own computer" | El producto desaparece y el carrito queda vacío con el mensaje "Your Shopping Cart is empty!". |