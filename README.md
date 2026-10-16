# Clínica NutriVida

## Sobre el proyecto

Clínica NutriVida es una aplicación web adaptada desde la tienda desarrollada en la primera evaluación. En esta versión, la aplicación se migró a **React, TypeScript, Vite y Bootstrap 5**, manteniendo sus funcionalidades principales y adaptándolas al contexto de una clínica nutricional.

El sistema incluye un catálogo de servicios, filtros, carrito, reservas, inicio de sesión, registro de usuarios, perfiles y paneles de gestión según el rol. También conserva las validaciones y reglas de negocio de la versión anterior.

## Tecnologías utilizadas

- **React:** desarrollo de interfaces mediante componentes.
- **TypeScript:** definición de tipos y detección de errores.
- **Vite:** entorno de desarrollo y compilación.
- **Bootstrap 5:** estilos y diseño adaptable a distintos dispositivos.
- **React Router:** navegación y protección de rutas.
- **LocalStorage:** almacenamiento de usuarios y datos de la aplicación en el navegador.

## Estructura del proyecto

El código está organizado por responsabilidades dentro de `src/`:

- **`pages/`**: páginas principales, como Inicio, Servicios, Carrito, Login, Registro, Perfil y los paneles de gestión.
- **`components/`**: componentes relacionados con la protección de rutas y el acceso según el rol.
- **`ui/`**: elementos reutilizables, como modales, campos de contraseña e indicadores de stock.
- **`layout/`**: elementos compartidos, como Navbar, Footer y Breadcrumb.
- **`contexts/`**: gestión del usuario conectado, el carrito y las notificaciones.
- **`services/`**: funciones para guardar y recuperar datos de LocalStorage.
- **`utils/`**: validaciones, permisos y formato de precios.
- **`types/`**: tipos e interfaces de TypeScript.
- **`constants/` y `data/`**: constantes y datos iniciales del catálogo.

## Roles y permisos

La aplicación cuenta con tres roles:

- **Administrador:** gestiona usuarios, productos y categorías, además de las funciones administrativas disponibles.
- **Recepcionista:** consulta productos, modifica el stock y crea usuarios con rol de cliente. No puede gestionar categorías, eliminar productos ni asignar roles de personal.
- **Cliente:** accede a las funciones disponibles para los usuarios de la aplicación.

El registro público crea cuentas de cliente y cada usuario puede editar su perfil sin modificar su propio rol.

## Decisiones de implementación

- **Componentes reutilizables:** se comparten elementos como los campos de contraseña, los modales de confirmación y los indicadores de stock.
- **Contextos de React:** se utilizan para compartir información de la sesión, el carrito y las notificaciones entre distintos componentes.
- **Rutas protegidas:** el acceso a las páginas se controla según el rol del usuario.
- **Validaciones:** los formularios comprueban datos como fechas de nacimiento, correos institucionales, contraseñas, precios y stock, mostrando mensajes en español.
- **Almacenamiento centralizado:** las operaciones de lectura y escritura de LocalStorage se gestionan desde `services/storage.ts`.

El rol `recepcionista` adapta el rol de vendedor de la versión original al contexto de la clínica, manteniendo las restricciones de permisos correspondientes.

## Cómo ejecutar el proyecto

Se necesita tener Node.js y npm instalados.

```bash
npm install
npm run dev
```

Para compilar el proyecto:

```bash
npm run build
```

