# Implementación del Módulo de Seguridad (/settings/security)

El objetivo es crear una pantalla de configuración de seguridad completa y responsiva que permita a los usuarios cambiar su contraseña, configurar Autenticación de Dos Factores (2FA) y vincular cuentas sociales (Google, Facebook, Apple).

## Open Questions

- ¿Deseas que los usuarios deban ingresar su contraseña actual antes de permitirles cambiarla o activar el 2FA? Supabase requiere sesión activa, pero pedir la contraseña actual aporta seguridad extra (aunque requiere validación manual). Por defecto, asumiremos la actualización directa ya que Supabase asume que la sesión activa es segura.
- ¿El diseño de los códigos QR para 2FA debe tener el estilo Dark/Light mode de GameClips o el estilo por defecto de Supabase Auth?

> [!IMPORTANT]
> **Configuraciones requeridas en Supabase Dashboard**
> Antes de que estas funciones operen correctamente, debes configurar tu proyecto en Supabase:
>
> **1. Habilitar MFA (2FA)**
>
> - Ve a `Authentication > Multi-Factor Authentication` (o Policies). Asegúrate de que TOTP esté habilitado (normalmente lo está por defecto).
>
> **2. Configurar Google**
>
> - Obtén Client ID y Client Secret desde Google Cloud Console.
> - En Supabase: `Authentication > Providers > Google`. Actívalo y pega las credenciales.
>
> **3. Configurar Facebook**
>
> - Crea una App en Meta for Developers y obtén el App ID y App Secret.
> - En Supabase: `Authentication > Providers > Facebook`. Actívalo y pega las credenciales.
>
> **4. Configurar Apple**
>
> - Genera tu Service ID y Private Key en Apple Developer.
> - En Supabase: `Authentication > Providers > Apple`. Actívalo y pega los datos.
>
> **Nota de Seguridad**: Para que `linkIdentity` funcione, asegúrate de habilitar **"Link identities to a single user"** en las opciones de Auth en Supabase.

## Proposed Changes

### 1. `src/lib/services/auth.service.ts`

Agregaremos los métodos oficiales de Supabase para manejar estas acciones:

- `updatePassword(newPassword)`
- `getMfaStatus()`
- `enrollMfa()` -> Devuelve un secreto y el QR (SVG).
- `verifyMfa(factorId, challengeId, code)`
- `unenrollMfa(factorId)`
- `getLinkedIdentities()`
- `linkIdentity(provider)`
- `unlinkIdentity(identityId)`

### 2. `src/routes/settings/security/+page.svelte`

- [NEW] Crearemos la vista de seguridad siguiendo el lenguaje visual de GameClips (cards con bordes, animaciones de entrada).
- **Sección de Contraseña**: Inputs para Nueva Contraseña y Confirmación.
- **Sección 2FA**:
  - Estado actual (Activado/Desactivado).
  - Flujo visual en modales o sub-secciones expandibles para escanear el QR y verificar el PIN.
- **Sección de Proveedores**:
  - Lista de Google, Facebook y Apple.
  - Botones que alternan entre "Vincular" y "Desvincular" según el estado en tiempo real.

### 3. `messages/en.json` & `messages/es.json`

- [MODIFY] Se agregarán todas las traducciones necesarias (textos de contraseñas, etiquetas de 2FA, nombres de proveedores, errores y validaciones).

## Verification Plan

1. Ejecutar las herramientas de linting y formateo para verificar sintaxis de Svelte y TypeScript.
2. Navegar visualmente en entorno de desarrollo a `/settings/security` y corroborar que todas las tarjetas se animan correctamente y coinciden con la estética de `/settings/profile`.
3. Simularemos que los métodos de Supabase se invocan correctamente capturando posibles errores en la consola.
