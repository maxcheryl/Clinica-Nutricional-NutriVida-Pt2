/**
 * Constantes globales: claves de localStorage, límites de validación,
 * umbrales de UI y catálogos de opciones de formularios.
 */

// ============ PERSISTENCIA (claves de localStorage) ============
export const CLAVE_USUARIOS = 'nutrivida_usuarios'
export const CLAVE_SESION = 'usuarioLogueado'
export const CLAVE_INTENTOS = 'nutrivida_intentos'
export const CLAVE_CARRITO = 'nutrivida_carrito'
export const CLAVE_RESERVADOS = 'nutrivida_reservados'
export const CLAVE_PRODUCTOS = 'nutrivida_productos'
export const CLAVE_CATEGORIAS = 'nutrivida_categorias'

// ============ LÍMITES DE VALIDACIÓN Y UMBRALES ============
/** Intentos fallidos de login antes de bloquear la cuenta. */
export const MAX_INTENTOS = 3

// Filtros del slider del catálogo público (rango acotado a los precios sembrados).
export const PRECIO_MIN = 10000
export const PRECIO_MAX = 170000
/** Desde esta cantidad de cupos libres se muestra el badge "Pocos cupos". */
export const UMBRAL_POCOS_CUPOS = 2
/** Edad máxima permitida al crear/editar usuarios. */
export const EDAD_MAXIMA = 120
// Límites al crear/editar productos en los paneles (a PRECIO_MIN/MAX va el catálogo).
export const PRECIO_MINIMO = 1000
export const PRECIO_MAXIMO = 10000000
export const STOCK_MAXIMO = 1000
/** Imagen usada cuando un producto no tiene imagen propia. */
export const IMAGEN_DEFECTO = '/assets/img/servicioDefault.jpg'

// ============ AUTENTICACIÓN ============
/** Dominio de correo exigido en todos los formularios de usuario. */
export const DOMINIO_CORREO = '@duocuc.cl'

export const ADMIN_INICIAL_CORREO = 'admin@duocuc.cl'
export const ADMIN_INICIAL_PASSWORD = 'Admin12345'

// ============ OPCIONES DE FORMULARIOS ============
/** Roles disponibles en el sistema (a través de la sesión y los paneles). */
export const OPCIONES_ROL = [
  { valor: 'administrador', etiqueta: 'Administrador' },
  { valor: 'recepcionista', etiqueta: 'Recepcionista' },
  { valor: 'cliente', etiqueta: 'Cliente' },
] as const

export const OPCIONES_GENERO = [
  { valor: 'Mujer', etiqueta: 'Mujer' },
  { valor: 'Hombre', etiqueta: 'Hombre' },
  { valor: 'Otro', etiqueta: 'Otro' },
  { valor: 'NoDice', etiqueta: 'Prefiero no decir' },
] as const

export const OPCIONES_REGION = [
  { valor: 'Arica', etiqueta: 'Arica y Parinacota' },
  { valor: 'Tarapaca', etiqueta: 'Tarapacá' },
  { valor: 'Antofagasta', etiqueta: 'Antofagasta' },
  { valor: 'Atacama', etiqueta: 'Atacama' },
  { valor: 'Coquimbo', etiqueta: 'Coquimbo' },
  { valor: 'Valparaiso', etiqueta: 'Valparaíso' },
  { valor: 'Metropolitana', etiqueta: 'Metropolitana de Santiago' },
  { valor: "O'Higgins", etiqueta: 'Libertador General Bernardo O\u2019Higgins' },
  { valor: 'Maule', etiqueta: 'Maule' },
  { valor: 'Nuble', etiqueta: 'Ñuble' },
  { valor: 'Biobio', etiqueta: 'Biobío' },
  { valor: 'Araucania', etiqueta: 'La Araucanía' },
  { valor: 'Rios', etiqueta: 'Los Ríos' },
  { valor: 'Lagos', etiqueta: 'Los Lagos' },
  { valor: 'Aysen', etiqueta: 'Aysén del General Carlos Ibáñez del Campo' },
  { valor: 'Magallanes', etiqueta: 'Magallanes y de la Antártica Chilena' },
] as const
