# Estrategia de Suites: Smoke y Regresión

## Suite de Smoke
Contiene las pruebas críticas del "Happy Path". Si estas fallan, la aplicación no está apta para seguir probándose.

**Casos incluidos:** TC-LOG-01 (Login exitoso) y TC-CART-01 (Agregar producto).
**Justificación:** Representan los flujos mínimos de negocio. Sin ellos, el usuario no puede operar en la plataforma.

## Suite de Regresión
Contiene las pruebas que validan la lógica del negocio, los casos border y las validaciones de error. Se ejecuta después de cada cambio o Pull Request.

**Casos incluidos:** TC-LOG-02 (Contraseña incorrecta), TC-LOG-03 (Campos vacíos), TC-CART-02 (Múltiples unidades) y TC-CART-03 (Eliminar producto).
**Justificación:** El Happy Path ya está cubierto en Smoke. Para regresión se seleccionaron los escenarios de error y variaciones, ya que son los más propensos a romperse silenciosamente cuando se modifica el código, sin afectar el flujo principal.