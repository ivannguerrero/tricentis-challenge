Por qué Playwright me devuelve un error de 'strict mode violation' cuando busco un elemento con una clase CSS? ¿Cómo se soluciona correctamente?
Encontrados 15 resultados web
El error strict mode violation en Playwright no es un fallo de tu selector, sino una protección deliberada. Playwright está diseñado para ser "estricto": si un localizador coincide con más de un elemento en la página, lanza una excepción inmediata en lugar de adivinar cuál quieres y arriesgarse a hacer clic en el equivocado .

La solución correcta nunca es desactivar el modo estricto o usar .first() por defecto. La solución real es hacer que tu localizador apunte a un único elemento.

¿Por qué ocurre con una clase CSS?
Suele pasar por dos motivos:

El selector es demasiado genérico: Una clase como .btn-primary o .message probablemente se usa en varios botones o mensajes a lo largo de la página (cabecera, cuerpo, pie de página) .

Elementos ocultos o duplicados: Frameworks como React o Alpine.js a veces mantienen elementos ocultos en el DOM (por ejemplo, para transiciones) que coinciden con la misma clase, aunque el usuario solo vea uno .

Cómo solucionarlo correctamente (en orden de preferencia)
1. Acotar el localizador a un contenedor único (La mejor opción)
En lugar de buscar en toda la página, busca dentro de la sección específica que te interesa.

Incorrecto (busca en toda la página):

javascript
await page.locator('.btn-delete').click();
Correcto (busca solo dentro de la fila de la factura):

javascript
// Primero encuentra el contenedor único (la fila)
const row = page.getByRole('row', { name: 'Factura #4471' });
// Luego busca el botón dentro de esa fila
await row.locator('.btn-delete').click();
Esto es especialmente útil si tienes una lista y quieres interactuar con el botón de un elemento específico .

2. Filtrar por contenido o contexto
Si no puedes (o no quieres) acotar por contenedor, usa filtros para distinguir el elemento.

javascript
// Filtra el botón que contenga un texto específico
await page.locator('.btn-primary').filter({ hasText: 'Guardar' }).click();

// O filtra el que contenga un elemento hijo específico
await page.locator('.card').filter({ has: page.getByRole('heading', { name: 'Título único' }) }).click();
El filtrado por texto o por elementos hijos es más robusto que usar índices como .nth(0) porque no se rompe si el orden de la página cambia .

3. Usar un localizador semántico más específico
Playwright recomienda usar roles accesibles (getByRole) en lugar de clases CSS. Esto suele desambiguar automáticamente.

En lugar de:

javascript
page.locator('.submit-button')
Usa:

javascript
page.getByRole('button', { name: 'Enviar pedido' })
Si el nombre es ambiguo, puedes añadir { exact: true } para evitar coincidencias parciales (ej: "Verificado" vs "No verificado") .

4. Añadir un data-testid (Solución de raíz)
Si tienes control sobre el código de la aplicación, la solución más estable es añadir un atributo único para testing. Esto elimina la ambigüedad para siempre.

html
<button class="btn-primary" data-testid="submit-order-btn">Enviar</button>
javascript
await page.getByTestId('submit-order-btn').click();
Esta es la recomendación de Playwright para eliminar la ambigüedad en la fuente .

Lo que NO deberías hacer (a menos que sea estrictamente necesario)
.first() / .nth(): Playwright lo marca como "no recomendado" para estos casos. Es frágil porque depende del orden de los elementos; si la lista se reordena o se añade un elemento arriba, tu test hará clic en el lugar equivocado .

Desactivar el modo estricto (strict_selectors=False): Esto reproduce el problema que Playwright intenta evitar. Tu test podría pasar hoy porque hace clic en el elemento equivocado, y fallar de forma inexplicable en el futuro .

En resumen: usa el error como una señal para especificar mejor qué elemento quieres. Acotar por contenedor o usar roles semánticos suele resolver el problema de inmediato.

¿Cuál es la diferencia entre usar .isVisible() y expect(locator).toBeVisible() en Playwright? ¿Cuál es más recomendable para validar que un usuario se logueó correctamente?
Encontrados 12 resultados web
La diferencia fundamental es que expect(locator).toBeVisible() es la opción recomendada para validar el login, mientras que .isVisible() no debería usarse para aserciones de test.

🎯 La diferencia clave: Auto-espera (Auto-waiting)
Característica	expect(locator).toBeVisible()	locator.isVisible()
Comportamiento	Reintenta automáticamente hasta que el elemento sea visible o se agote el tiempo de espera (por defecto 5s) .	Devuelve un booleano instantáneo del estado actual, sin esperar .
Uso recomendado	Aserciones (Asserts) en tests. Verificar un resultado esperado.	Lógica condicional en el código (ej: if para cerrar un popup opcional).
Estabilidad	Alta. Tolera animaciones, renderizados asíncronos y tiempos de carga de red.	Baja. Si lo usas en un expect, el test puede fallar de forma intermitente (flaky) porque evalúa antes de que la UI esté lista .
✅ ¿Por qué expect(locator).toBeVisible() es lo correcto para validar el login?
Cuando un usuario hace login, la aplicación suele necesitar unos milisegundos para procesar la solicitud, recibir la respuesta y renderizar la nueva página o el mensaje de bienvenida.

Si usas isVisible() inmediatamente después de hacer clic en "Entrar", es muy probable que el elemento aún no esté en el DOM y obtengas false, haciendo que el test falle sin que la aplicación tenga un error real.

Al usar await expect(page.getByText('Bienvenido')).toBeVisible(), Playwright espera activamente a que ese texto aparezca en pantalla. Si aparece en 200ms, el test continúa al instante; si tarda 4 segundos, Playwright sigue esperando (hasta el límite) .

💡 Ejemplo práctico
❌ Incorrecto (Frágil):

javascript
// El test puede fallar si la página tarda en cargar
const loggedIn = await page.getByText('Mi Perfil').isVisible();
expect(loggedIn).toBe(true); 
✅ Correcto (Robusto):

javascript
// Playwright espera automáticamente a que el elemento sea visible
await expect(page.getByText('Mi Perfil')).toBeVisible(); 
Nota: Incluso puedes añadir un mensaje personalizado para depurar mejor: await expect(page.getByText('Mi Perfil'), 'El usuario debería estar logueado').toBeVisible(); .

⚠️ ¿Cuándo SÍ usar isVisible()?
Úsalo solo cuando necesites tomar una decisión en tiempo de ejecución (lógica de negocio del test), no para validar un resultado. Por ejemplo, si tienes un banner de cookies que a veces aparece:

javascript
// Si el banner está visible AHORA, ciérralo; si no, ignora.
const banner = page.getByRole('alert', { name: 'Cookies' });
if (await banner.isVisible()) {
    await banner.getByRole('button', { name: 'Aceptar' }).click();
}
En este caso, no quieres esperar 5 segundos a que aparezca un banner opcional; quieres saber si está ahí en ese momento para decidir el flujo .

Resumen
Para validar que un usuario se logueó correctamente, usa siempre await expect(...).toBeVisible(). Es la práctica estándar en Playwright porque elimina los falsos negativos causados por los tiempos de carga de la web.

En TypeScript, ¿cuál es la diferencia entre declarar una propiedad de una clase como readonly y declararla de forma normal?
La diferencia clave es que readonly en TypeScript solo restringe la reasignación en tiempo de compilación: impide que el código TypeScript vuelva a asignar un valor a esa propiedad después de inicializarla. No cambia el comportamiento en tiempo de ejecución (JavaScript), no hace la propiedad "inmutable" en el sentido profundo y no impide mutar el contenido de un objeto o array.

1. Qué impide exactamente readonly
typescript
class Usuario {
  readonly id: number;
  nombre: string;

  constructor(id: number, nombre: string) {
    this.id = id;      // ✅ Permitido: inicialización
    this.nombre = nombre;
  }

  cambiarId() {
    this.id = 99;      // ❌ Error de compilación: Cannot assign to 'id' because it is a read-only property
  }
}
Puntos importantes:

La asignación solo se permite en la declaración o en el constructor de la propia clase.

Después de eso, cualquier reasignación desde TypeScript es un error de compilación.

El error es estático: si compilas a JavaScript y ejecutas, el código reasignaría el valor sin problema (no hay Object.freeze ni equivalente).

2. No es inmutabilidad profunda
typescript
class Config {
  readonly opciones: string[] = [];
}

const c = new Config();
c.opciones = [];          // ❌ Error: no puedes reasignar la propiedad
c.opciones.push('a');     // ✅ Permitido: mutas el array, no la referencia
c.opciones[0] = 'b';      // ✅ Permitido
readonly protege la referencia, no el contenido. Si quieres inmutabilidad real del valor, necesitas Readonly<T>, ReadonlyArray<T> o Object.freeze.

typescript
class Config {
  readonly opciones: ReadonlyArray<string> = [];
}
// c.opciones.push(...) → ❌ Error en compilación
3. Diferencia con const
const aplica a variables (bindings).

readonly aplica a propiedades de clase, interfaces y tipos.

No puedes usar const para una propiedad de clase; para eso existe readonly.

4. Diferencia con propiedades normales
Aspecto	Propiedad normal	readonly
Reasignación tras el constructor	✅ Permitida	❌ Error de compilación
Inicialización en constructor	✅	✅
Cambio en runtime (JS)	Posible	Posible (no hay protección real)
Uso en interfaces/tipos	✅	✅ (readonly en interface)
Afecta al contenido de objetos/arrays	No	No (solo la referencia)
5. Casos prácticos donde readonly aporta valor
Identificadores inmutables: readonly id: string, readonly createdAt: Date.

Dependencias inyectadas: constructor(private readonly db: Database).

Configuración que no debe cambiarse tras construirse.

Modelos de dominio donde ciertos campos son de solo lectura por diseño.

6. Detalle importante: readonly y herencia
Una subclase no puede reasignar una propiedad readonly heredada:

typescript
class Base {
  readonly version = 1;
}

class Hija extends Base {
  cambiar() {
    this.version = 2; // ❌ Error
  }
}
Pero sí puede declarar una propiedad con el mismo nombre si la base no la tiene, o sobrescribirla en la declaración (con matices según useDefineForClassFields).

7. readonly en parámetros del constructor
El atajo constructor(private readonly x: T) declara y asigna la propiedad automáticamente, y la marca como readonly. Es muy común para dependencias.

typescript
class Servicio {
  constructor(private readonly http: HttpClient) {}
  // http no puede reasignarse después
}
Resumen
readonly = restricción de compilación que impide reasignar la propiedad tras su inicialización.

No es inmutabilidad real: el valor subyacente (objeto/array) puede mutarse, y en runtime no hay protección.

No cambia el JavaScript generado (salvo el borrado del modificador).

Úsalo para expresar intención, prevenir bugs de reasignación accidental y documentar contratos en clases e interfaces.

Combínalo con Readonly<T> / ReadonlyArray<T> si necesitas inmutabilidad también del contenido.

Para qué sirve exactamente usar export class en un archivo de Page Object? Qué pasaría si no lo exporto?
Encontrados 14 resultados web
Usar export class en un archivo de Page Object (PO) sirve para hacer que la clase sea accesible desde otros archivos de tu proyecto de pruebas. Si no la exportas, la clase queda encerrada en su propio archivo y no podrás importarla ni usarla en tus tests.

🎯 ¿Para qué sirve exactamente export class?
En TypeScript (y en JavaScript moderno), cada archivo que contiene un import o un export se considera un módulo con su propio ámbito aislado . Esto significa que las variables, funciones y clases definidas dentro de él son privadas por defecto.

Sin export: La clase LoginPage solo existe dentro de LoginPage.ts. El archivo de test (login.spec.ts) no "sabe" que existe.

Con export: Le dices a TypeScript que esa clase forma parte de la "interfaz pública" del archivo, permitiendo que otros archivos la importen usando import { LoginPage } from './pages/LoginPage';.

En el contexto del patrón Page Object, esto es fundamental porque separa la lógica de la página (selectores y métodos) de la lógica del test. El test importa la clase, la instancia (o recibe una instancia) y usa sus métodos para interactuar con la página .

❌ ¿Qué pasaría si no lo exportas?
Si omites la palabra export, ocurrirán dos cosas:

Error de compilación en el test: Cuando intentes hacer import { LoginPage } from './LoginPage'; en tu archivo de test, TypeScript te dará un error indicando que el módulo no tiene ningún miembro exportado con ese nombre (o que no se encuentra la clase) .

La clase es inútil fuera de su archivo: Aunque podrías instanciarla dentro del mismo archivo donde la declaraste, no podrías reutilizarla en ningún otro test. Esto rompe por completo el propósito del patrón Page Object, que es precisamente compartir y reutilizar la representación de una página en múltiples pruebas .

💡 Un matiz importante en Playwright
En Playwright, es común ver dos formas de exportar POs:

Exportar la clase (export class LoginPage): Es lo más estándar. Luego, en el test o en un fixture, haces new LoginPage(page).

Exportar una instancia ya creada (export default new LoginPage()): Se usa en algunos frameworks como WebdriverIO para simplificar el test, pero en Playwright es menos común porque necesitas pasarle el objeto page en el constructor .

En resumen: siempre debes usar export para que tu Page Object sea reutilizable y pueda ser importado por tus archivos de test. Sin él, el archivo es un callejón sin salida.

En playwright.config.ts, 
para qué sirve la propiedad fullyParallel y qué problemas puede traer en tests que comparten sesión?
Encontrados 12 resultados web
fullyParallel: true sirve para que Playwright ejecute todos los tests de todos los archivos en paralelo, a nivel de test individual, en lugar de agruparlos por archivo . El problema con tests que comparten sesión es que rompe el aislamiento entre ellos: si un test modifica un estado compartido (como localStorage, cookies o una cuenta de usuario), otro test que se ejecute al mismo tiempo puede leer ese estado contaminado y fallar de forma impredecible.

🎯 ¿Para qué sirve exactamente fullyParallel?
Por defecto, Playwright paraleliza a nivel de archivo: los tests dentro de un mismo archivo se ejecutan en orden secuencial dentro de un mismo worker. Al activar fullyParallel: true, Playwright pasa a paralelizar a nivel de test individual, incluso si están en el mismo archivo .

Esto mejora el rendimiento y, si usas sharding en CI, permite una distribución más equilibrada de la carga entre las distintas máquinas . Es útil cuando tienes muchos tests independientes entre sí.

⚠️ ¿Qué problemas trae con tests que comparten sesión?
El problema fundamental es que fullyParallel no crea un entorno aislado por test; simplemente los ejecuta concurrentemente. Si varios tests comparten un mismo recurso mutable, se producen colisiones.

Los síntomas típicos son:

Fugas de estado entre tests: Un test escribe en localStorage o modifica cookies, y otro test que se ejecuta después en el mismo worker hereda esos datos sin saberlo. Esto provoca fallos intermitentes que solo aparecen en CI o al cambiar el orden de ejecución .

Conflictos en el backend: Dos tests intentan modificar o eliminar el mismo registro de una base de datos compartida al mismo tiempo, generando errores 409 o 429, o resultados inesperados .

Dependencias de orden rotas: Si un test asumía que otro se ejecutaría antes para preparar la sesión, con fullyParallel esa garantía desaparece y el test falla por falta de estado .

💡 Cómo solucionarlo correctamente
La solución no es desactivar fullyParallel, sino eliminar la dependencia de estado compartido mutable:

Usa storageState para la autenticación: En lugar de que cada test haga login o dependa de una sesión global, guarda el estado de autenticación en un archivo (por ejemplo, auth.json) en un setup y haz que cada test cargue ese estado de forma independiente . Playwright está diseñado para que cada test tenga su propio contexto de navegador aislado.

Aísla los datos de prueba: Cada test debe crear sus propios datos (por ejemplo, un usuario único con un correo generado dinámicamente) en lugar de reutilizar un usuario fijo compartido .

Usa fixtures con el scope adecuado: Si necesitas compartir algo costoso (como un login), usa un fixture de tipo worker solo para recursos de solo lectura o que se puedan reiniciar de forma segura entre tests .

En resumen: fullyParallel es una optimización de rendimiento que asume que tus tests son independientes. Si comparten sesión o datos mutables, el problema no es la paralelización, sino el diseño del test; la solución pasa por aislar el estado, no por renunciar al paralelismo.

Configurar Playwright para que saque una captura de pantalla automática solo cuando un test falla
Encontrados 12 resultados web
Para configurar Playwright y capturar una pantalla automáticamente solo cuando un test falla, debes modificar tu archivo playwright.config.ts y añadir la opción screenshot: 'only-on-failure' dentro del bloque use.

⚙️ Configuración básica
Añade la siguiente línea en tu configuración. Esta es la forma más directa y recomendada, ya que no requiere código extra en tus tests .

typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Captura una screenshot solo cuando el test falla
    screenshot: 'only-on-failure',
  },
});
Con esto, Playwright adjuntará automáticamente la imagen al reporte del test (por ejemplo, en el reporte HTML) para que puedas ver el estado de la página en el momento del error.

📸 Opciones adicionales
Si necesitas más control sobre la captura, puedes usar la forma de objeto para, por ejemplo, capturar la página completa y no solo la ventana visible :

typescript
use: {
  screenshot: {
    mode: 'only-on-failure',
    fullPage: true,
  },
},
💡 ¿Y si usas reintentos?
Si tu configuración tiene retries (reintentos), la opción 'only-on-failure' capturará una imagen en cada intento fallido. Si solo quieres la captura del primer fallo (para evitar duplicados), puedes usar 'on-first-failure' (disponible desde la versión 1.49) .

typescript
use: {
  screenshot: 'on-first-failure',
},
En resumen, la opción screenshot: 'only-on-failure' es la solución estándar y más limpia para obtener evidencia visual únicamente de los tests que fallan.

Cuál es la mejor práctica para encontrar el selector de un botón que aparece en varias páginas? ¿Es mejor usar ID, clase o atributo?
Encontrados 15 resultados web
Para un botón que se repite en varias páginas, la mejor práctica no es elegir entre ID, clase o atributo de forma aislada, sino priorizar el selector que sea más estable y específico para ese botón en cada contexto. La recomendación general es usar primero un atributo dedicado a pruebas (data-testid) si puedes modificar el código, seguido de un ID único, y evitar las clases CSS genéricas.

🥇 Prioridad de selectores (de más a menos recomendable)
Atributo dedicado a pruebas (data-testid): Es la opción más robusta. Un atributo como data-testid="submit-order-btn" existe exclusivamente para testing, por lo que no se rompe si cambian los estilos (clases) o la estructura del layout. Playwright lo usa por defecto con page.getByTestId('submit-order-btn') .

ID único: Si el botón tiene un id que es estable y realmente único en la página (ej: id="checkout-button"), es una excelente opción. El problema es que los IDs a veces son autogenerados o cambian entre entornos, así que hay que verificar que sea confiable .

Rol + nombre accesible: Usar page.getByRole('button', { name: 'Finalizar compra' }) es muy resiliente porque se basa en cómo el usuario (y las tecnologías de asistencia) perciben el botón. Si el texto del botón es estable, esta es una opción muy sólida y semántica .

Clase CSS: Es la opción menos recomendable para un botón repetido. Una clase como .btn-primary probablemente se usa en múltiples botones de la página. A menos que la clase sea muy específica (ej: .checkout__submit), es frágil y propensa a violar el modo estricto de Playwright .

💡 La clave para un botón repetido: acotar el contexto
Como el botón aparece en varias páginas, un selector global (como un data-testid genérico o una clase) podría seguir coincidiendo con varios elementos si la página tiene más de un botón similar. La solución es acotar el localizador al contenedor único de esa página.

Por ejemplo, si en la página de checkout el botón está dentro de un formulario específico:

javascript
// En lugar de buscar el botón en toda la página:
// await page.getByTestId('submit-btn').click(); // ❌ Puede fallar si hay otro botón igual

// Acota la búsqueda al contenedor único de esa página:
const checkoutForm = page.locator('#checkout-form');
await checkoutForm.getByTestId('submit-btn').click(); // ✅
Esto combina lo mejor de ambos mundos: un atributo estable (data-testid) dentro de un contexto que sabes que es único para esa página en particular .

En resumen: si puedes, añade un data-testid único para el botón en cada página (ej: data-testid="checkout-submit"). Si no, usa el ID único si existe, o busca el botón por su rol y nombre accesible dentro de un contenedor que sepas que es exclusivo de esa página. Evita depender de clases CSS genéricas.

Por qué en un framework de automatización se separan las carpetas tests, pages y utils? 
Para qué sirven ?
La separación en carpetas tests, pages y utils responde al principio de separación de responsabilidades (Separation of Concerns). Cada carpeta tiene un rol distinto y bien definido, y mezclarlas produce tests frágiles, difíciles de mantener y con lógica duplicada.

📁 tests/ — Qué se prueba
Contiene los archivos de test (.spec.ts o .test.ts). Su única responsabilidad es describir el comportamiento esperado: qué pasos se ejecutan y qué se valida.

Qué va aquí: bloques test(), test.describe(), aserciones (expect), datos de prueba específicos del escenario.

Qué NO va aquí: selectores CSS, lógica de navegación repetida, funciones auxiliares de bajo nivel.

Beneficio: un test se lee como una especificación funcional. Si cambia la UI, el test casi no debería cambiar; solo cambia el Page Object.

typescript
// tests/login.spec.ts
test('un usuario válido puede iniciar sesión', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user@test.com', 'pass123');
  await expect(page.getByText('Mi Perfil')).toBeVisible();
});
📄 pages/ — Cómo se interactúa con la UI
Contiene los Page Objects: clases que encapsulan los selectores y las acciones de una página o componente.

Qué va aquí: localizadores (getByRole, getByTestId), métodos que representan acciones del usuario (login(), agregarAlCarrito(), abrirMenu()).

Qué NO va aquí: aserciones de negocio (aunque puede haber métodos que devuelvan estado), datos de prueba, lógica de test.

Beneficio: si un selector cambia (por ejemplo, el botón de login pasa de #submit a data-testid="login-btn"), solo se modifica un archivo, no los 50 tests que usan ese botón. Es el patrón Page Object Model (POM).

typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Contraseña').fill(password);
    await this.page.getByRole('button', { name: 'Entrar' }).click();
  }
}
🛠️ utils/ — Herramientas transversales
Contiene funciones auxiliares reutilizables que no pertenecen ni a un test concreto ni a una página concreta.

Qué va aquí: generadores de datos (generarEmailUnico()), helpers de fecha, wrappers de API, constantes globales, funciones de logging, helpers de espera, configuración de fixtures.

Qué NO va aquí: lógica de UI (eso va en pages/), pasos de test (eso va en tests/).

Beneficio: evita duplicar código en múltiples tests y Page Objects. Es el "cajón de herramientas" común.

typescript
// utils/data.ts
export function generarEmailUnico(): string {
  return `user_${Date.now()}@test.com`;
}
🔗 Cómo se relacionan
text
tests/  →  importa  →  pages/  →  puede importar  →  utils/
tests/  →  importa  →  utils/
El test orquesta el flujo y hace las aserciones.

El Page Object sabe dónde están los elementos y cómo interactuar con ellos.

Los utils proveen datos y funciones genéricas que ambos pueden usar.

✅ Ventajas concretas de esta separación
Problema sin separación	Solución con separación
Cambia un selector y hay que tocar 30 tests	Se toca solo el Page Object
Tests ilegibles llenos de page.locator(...)	Tests que se leen como pasos de negocio
Datos hardcodeados duplicados	Un utils/data.ts centralizado
Dificultad para onboarding de nuevos QA	Estructura predecible y estándar
Lógica de UI mezclada con aserciones	Cada capa tiene una responsabilidad clara
En resumen: tests dice qué se prueba, pages dice cómo se interactúa con la UI, y utils provee herramientas compartidas. Esta separación es la base de un framework de automatización mantenible y escalable.

Cuál es la diferencia entre poner los locators directamente en el archivo de test y ponerlos en un Page Object?
Encontrados 11 resultados web
La diferencia principal es que poner los locators directamente en el test acopla el test a los detalles técnicos de la UI, mientras que ponerlos en un Page Object los centraliza y los aísla. Esto convierte al test en una descripción legible del comportamiento del usuario y hace que el mantenimiento sea mucho más sencillo cuando la interfaz cambia.

🎯 La diferencia en la práctica
Aspecto	Locators en el archivo de test	Locators en un Page Object
Mantenimiento	Si cambia un selector, debes buscar y actualizar todos los tests que lo usan (pueden ser decenas) .	El cambio se hace en un solo lugar (el Page Object), y todos los tests se benefician .
Legibilidad	El test se llena de page.locator(...), page.getByRole(...), ocultando el flujo de negocio .	El test se lee como una historia de usuario: loginPage.login(...), cartPage.checkout() .
Reutilización	Cada test debe reescribir los mismos pasos (ej: login) con sus propios locators .	La lógica de interacción se escribe una vez y se reutiliza en todos los tests .
Riesgo de errores	Un selector mal escrito o desactualizado rompe múltiples tests de forma impredecible.	Los locators están encapsulados y verificados en un contexto controlado.
Separación de responsabilidades	Se mezcla "qué se prueba" con "cómo se interactúa con la UI".	El test define qué se prueba; el Page Object define cómo se interactúa .
💡 ¿Cuándo conviene cada uno?
La recomendación general de Playwright y las guías de buenas prácticas es usar Page Objects para cualquier página o componente que vayas a usar en más de un test . Sin embargo, hay un matiz importante:

Para un prototipo rápido o un test único y trivial (1 o 2 interacciones en un solo archivo), usar locators inline puede ser aceptable para no añadir ceremonia innecesaria .

En cuanto el mismo locator o flujo se repite en un segundo test, es el momento de extraerlo a un Page Object. La regla práctica es: si copias y pegas el mismo bloque de interacción dos veces, refactoriza .

📝 Ejemplo visual
❌ Con locators en el test (frágil y repetitivo):

typescript
// login.spec.ts
test('login', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[name="email"]').fill('user@test.com');
  await page.locator('input[name="password"]').fill('pass');
  await page.locator('button[type="submit"]').click();
});

// otro-test.spec.ts (duplicado)
test('otro flujo que requiere login', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[name="email"]').fill('user@test.com'); // repetido
  await page.locator('input[name="password"]').fill('pass');     // repetido
  await page.locator('button[type="submit"]').click();           // repetido
});
Si mañana el campo de email pasa de name="email" a data-testid="email-input", tendrás que tocar cada archivo de test.

✅ Con Page Object (robusto y limpio):

typescript
// pages/LoginPage.ts
export class LoginPage {
  readonly emailInput = this
Qué ventajas tiene usar POM?
Encontrados 13 resultados web
Usar el Patrón Page Object Model (POM) ofrece ventajas claras para la mantenibilidad, legibilidad y escalabilidad de tus pruebas automatizadas. La ventaja principal es que centraliza los selectores y las interacciones de la UI en un solo lugar, de modo que cuando la interfaz cambia, solo actualizas un archivo en lugar de decenas de tests.

🧩 Ventajas principales de POM
Mantenimiento centralizado
Esta es la ventaja más citada. Los selectores (IDs, clases, roles) y las acciones sobre una página viven en una clase dedicada. Si un botón cambia de selector, solo modificas el Page Object, y todos los tests que lo usan quedan corregidos automáticamente .

Reutilización sin duplicación (DRY)
Las acciones comunes (como login() o agregarAlCarrito()) se definen una vez en el Page Object y se reutilizan en múltiples tests. Esto elimina el código duplicado y reduce la superficie de error .

Tests más legibles
Los tests dejan de ser una lista de selectores CSS y pasan a leerse como pasos de negocio: await loginPage.login(user, pass). Esto facilita que cualquiera entienda qué se está probando sin conocer los detalles del DOM .

Separación de responsabilidades
El Page Object sabe cómo interactuar con la UI; el test sabe qué validar. Las aserciones se mantienen en el test, no en el Page Object, lo que evita mezclar lógica de interacción con lógica de verificación .

Escalabilidad
A medida que la aplicación crece, POM permite organizar los tests por páginas o componentes. Puedes crear Page Objects pequeños y componibles (una barra de navegación, un modal) en lugar de una clase monolítica .

⚠️ Cuándo POM no es la mejor opción
Si tu suite es muy pequeña (por ejemplo, 4–5 páginas) o estás haciendo una prueba de concepto rápida, la sobrecarga de crear y mantener clases puede no compensar. En esos casos, locators directos en el test pueden ser suficientes .

En resumen: POM es la práctica recomendada cuando buscas un framework mantenible y escalable, especialmente si la UI cambia con frecuencia o el equipo es grande.

Cuál es la diferencia entre dependencies y devDependencies en el archivo package.json?
Encontrados 14 resultados web
La diferencia fundamental entre dependencies y devDependencies en package.json es cuándo se necesitan los paquetes: dependencies son los que tu aplicación necesita para funcionar en producción, mientras que devDependencies solo se requieren durante el desarrollo y las pruebas .

🎯 dependencies: Lo que la app necesita para funcionar
Aquí van los paquetes esenciales para que tu aplicación funcione una vez desplegada. Si tu código los importa para ejecutar su lógica principal, deben estar aquí .

Ejemplos: Frameworks como React o Angular, librerías de utilidades como lodash o axios (si se usan en el cliente), y cualquier paquete que tu código llame directamente en el entorno de producción .

Instalación: Se añaden con npm install <paquete> (o npm i <paquete>) .

🛠️ devDependencies: Herramientas para construir y probar
Aquí se listan las herramientas que solo necesitas mientras desarrollas, compilas o ejecutas tests. No se incluyen en el bundle o despliegue final de producción .

Ejemplos: Frameworks de testing (Jest, Playwright, Vitest), linters (ESLint, Prettier), transpiladores (TypeScript, Babel), bundlers (Webpack, Vite) y generadores de documentación .

Instalación: Se añaden con npm install --save-dev <paquete> (o npm i -D <paquete>) .

💡 Un matiz importante en el entorno de desarrollo
Aunque la distinción es clara, hay un detalle práctico: cuando ejecutas npm install en la carpeta de tu proyecto (el entorno de desarrollo), npm instala tanto dependencies como devDependencies . La diferencia se nota al desplegar: en producción, normalmente se usa npm install --omit=dev (o --production) para instalar solo las dependencies, manteniendo el artefacto final ligero y seguro .

📝 Ejemplo en package.json
json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "playwright": "^1.40.0",
    "eslint": "^8.55.0"
  }
}
En resumen: usa dependencies para lo que la app necesita en ejecución y devDependencies para las herramientas que te ayudan a construirla y probarla.

Si tengo muchos datos de prueba (usuarios, productos, etc.), ¿es recomendable tenerlos en un archivo aparte o hardcodeados en el test?
La recomendación es tenerlos en un archivo aparte (o en un conjunto de archivos de datos/fixtures), no hardcodeados en el test. Hardcodear datos de prueba en los tests es una de las prácticas que más rápido degrada la mantenibilidad de una suite, especialmente cuando el volumen de datos crece.

🎯 Por qué separar los datos de prueba
Mantenibilidad centralizada
Si mañana cambia el formato de un email, el nombre de un producto o la estructura de un usuario, con datos centralizados actualizas un solo archivo. Con datos hardcodeados tendrías que buscar y reemplazar en decenas de tests, con riesgo de olvidar alguno.

Reutilización sin duplicación
Un mismo usuario válido, un producto de ejemplo o una dirección de envío se usan en muchos tests. Tenerlos en un archivo evita copiar y pegar el mismo objeto en cada spec, que es la fuente típica de inconsistencias (un test usa user@test.com y otro test@user.com para el mismo caso).

Legibilidad del test
El test queda enfocado en el flujo y las aserciones, no en bloques de datos. Se lee como una especificación de comportamiento:

typescript
// ✅ Legible
const user = usuarios.valido;
await loginPage.login(user.email, user.password);

// ❌ Ruidoso
await loginPage.login('juan.perez@example.com', 'Passw0rd!2024');
Datos dinámicos y únicos
Cuando los tests corren en paralelo (por ejemplo con fullyParallel), reutilizar un usuario fijo compartido provoca colisiones. Un archivo de datos puede exportar funciones generadoras que crean datos únicos por test (email con timestamp, SKU aleatorio), lo que es imposible si están hardcodeados.

Separación de entornos
Los datos de prueba suelen variar entre local, staging y CI (URLs, credenciales, IDs de productos). Un archivo de datos permite cambiar la fuente según el entorno sin tocar los tests.

📁 Cómo organizarlos
Una estructura habitual, alineada con la separación tests/pages/utils:

text
data/
  users.json          # usuarios estáticos (válido, inválido, admin)
  products.json       # catálogo de productos de prueba
  factories/
    userFactory.ts    # genera usuarios únicos por test
    productFactory.ts
Datos estáticos → archivos JSON o TS con constantes tipadas.

Datos dinámicos → funciones factory en utils/ o data/factories/ que reciben parámetros y devuelven objetos únicos.

typescript
// data/factories/userFactory.ts
export function crearUsuarioUnico() {
  const id = Date.now();
  return {
    email: `user_${id}@test.com`,
    password: 'Passw0rd!2024',
    nombre: `Usuario ${id}`,
  };
}
⚠️ Cuándo sí puede tener sentido hardcodear
Valores triviales y locales al test: un texto esperado en una aserción (expect(page.getByText('Bienvenido'))), un índice, un flag booleano. No hace falta extraerlos.

Datos que solo tienen sentido en ese test y no se reutilizan: por ejemplo, un string muy específico para validar un mensaje de error concreto. Aun así, si el test crece, conviene moverlo.

Prototipos rápidos o PoC: para validar una idea, hardcodear es aceptable; pero antes de que la suite crezca, refactoriza.

✅ Regla práctica
Si el mismo dato aparece en dos o más tests, o si el dato es costoso de construir (un usuario con rol, un producto con variantes), extráelo. Si es un valor único y trivial de una aserción, déjalo inline.

En resumen: para un volumen grande de usuarios, productos, etc., sí es recomendable tenerlos en archivos aparte (estáticos en JSON/TS y dinámicos en factories). Hardcodearlos escala mal, duplica información y rompe el aislamiento entre tests cuando se ejecutan en paralelo.