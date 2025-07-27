# LetParley LocalStorage Documentation

## 📋 Overview

Este documento describe todos los datos que LetParley almacena en `localStorage` del navegador para mantener la sesión del usuario y su estado de la aplicación.

## 🔑 Claves de LocalStorage

### 1. **`letparley_session_token`**

- **Descripción**: Token de sesión JWT para autenticación con la API
- **Tipo**: `string`
- **Origen**: Respuesta de `/lpmobile/verifycode` tras verificación exitosa
- **Usado por**: Todas las llamadas autenticadas a la API
- **Ejemplo**: `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
- **Limpieza**: Se elimina en `signOut()` o sesión expirada

### 2. **`letparley_user_email`**

- **Descripción**: Email del usuario autenticado
- **Tipo**: `string`
- **Origen**: Email ingresado durante el login
- **Usado por**: Verificación de términos, contexto de usuario
- **Ejemplo**: `"usuario@empresa.com"`
- **Limpieza**: Se elimina en `signOut()`

### 3. **`letparley_selected_business_id`**

- **Descripción**: ID del negocio actualmente seleccionado
- **Tipo**: `string` (convertido desde `number`)
- **Origen**: Selección en página SelectBusiness
- **Usado por**: Dashboard, conversaciones, todas las operaciones del negocio
- **Ejemplo**: `"123"`
- **Limpieza**: Se elimina en `signOut()` o cambio de negocio

### 4. **`letparley_user_id`**

- **Descripción**: ID único del usuario en el sistema
- **Tipo**: `string`
- **Origen**: Respuesta de verificación exitosa (opcional)
- **Usado por**: Operaciones específicas de usuario
- **Ejemplo**: `"user_456"`
- **Limpieza**: Se elimina en `signOut()`

### 5. **`letparley_is_new_user`**

- **Descripción**: Flag que indica si es la primera vez que el usuario ingresa
- **Tipo**: `string` ("true" o "false")
- **Origen**: Respuesta de `/lpmobile/verifycode`
- **Usado por**: Mostrar mensajes de bienvenida diferenciados
- **Ejemplo**: `"true"` o `"false"`
- **Limpieza**: Se elimina en `signOut()`

## 🔄 Flujo de Datos

### Durante el Login:

1. Usuario ingresa email → Se almacena temporalmente en `verificationEmail` (context only)
2. Código verificado exitosamente → Se almacenan:
   - `letparley_session_token`
   - `letparley_user_email`
   - `letparley_user_id` (si disponible)
   - `letparley_is_new_user`

### Durante Selección de Negocio:

1. Usuario selecciona negocio → Se almacena:
   - `letparley_selected_business_id`

### Durante Logout:

1. Se eliminan TODOS los datos de localStorage:
   - `letparley_session_token`
   - `letparley_user_email`
   - `letparley_selected_business_id`
   - `letparley_user_id`
   - `letparley_is_new_user`

## 📊 Estados de Autenticación

### 🔴 **No Autenticado**

```javascript
localStorage = {}; // Sin datos de LetParley
```

- **Redirección**: `/letparley/auth/login`

### 🟡 **Parcialmente Autenticado**

```javascript
localStorage = {
  letparley_session_token: 'xxx',
  letparley_user_email: 'usuario@empresa.com',
  letparley_user_id: '456',
  letparley_is_new_user: 'false',
  // Sin letparley_selected_business_id
};
```

- **Redirección**: `/letparley/select-business`

### 🟢 **Completamente Autenticado**

```javascript
localStorage = {
  letparley_session_token: 'xxx',
  letparley_user_email: 'usuario@empresa.com',
  letparley_selected_business_id: '123',
  letparley_user_id: '456',
  letparley_is_new_user: 'false',
};
```

- **Acceso**: Toda la aplicación disponible

## 🛡️ Seguridad y Validación

### Validaciones al Cargar:

1. **Token existe y no está vacío**: `token && token.trim().length > 0`
2. **Email válido**: Formato email básico
3. **Business ID numérico**: Se convierte a string para almacenamiento
4. **Manejo de errores**: Si hay error leyendo localStorage, se resetea a estado seguro

### Limpieza Automática:

- **401 Unauthorized**: Auto-signout y limpieza de datos
- **Token expirado**: Detección en respuestas de API
- **Navegación manual**: Verificación en cada carga de página

## 🔧 Funciones de Utilidad

### `AuthStorage.loadAll()`

```javascript
{
  sessionToken: string | null,
  userEmail: string | null,
  selectedBusinessId: string | null,
  userId: string | null,
  isNewUser: boolean,
  isAuthenticated: boolean
}
```

### `AuthStorage.clearAll()`

- Elimina todas las claves de LetParley del localStorage

## 📝 Consideraciones Técnicas

### Compatibilidad:

- **Navegadores**: Todos los navegadores modernos
- **Incógnito**: Funciona pero se pierde al cerrar
- **Dispositivos**: Se mantiene por dispositivo/navegador

### Limitaciones:

- **Tamaño**: ~5-10MB por dominio (más que suficiente)
- **Persistencia**: Hasta que usuario limpie datos o expire
- **Sincronización**: No se sincroniza entre dispositivos

### Mejores Prácticas Implementadas:

- ✅ Prefijo `letparley_` para evitar colisiones
- ✅ Validación de datos al cargar
- ✅ Limpieza automática en errores
- ✅ Estado de loading durante verificación
- ✅ Fallbacks seguros en caso de errores

## 🐛 Debugging

### Para verificar estado actual:

```javascript
// En DevTools Console
Object.keys(localStorage)
  .filter((key) => key.startsWith('letparley_'))
  .reduce((obj, key) => {
    obj[key] = localStorage.getItem(key);
    return obj;
  }, {});
```

### Para limpiar manualmente:

```javascript
// En DevTools Console
Object.keys(localStorage)
  .filter((key) => key.startsWith('letparley_'))
  .forEach((key) => localStorage.removeItem(key));
```
