# QA Matrix — Portfolio Admin Alignment v1

Fecha: 2026-04-03  
Proyecto: `rey_portfolio`  
Change: `portfolio-admin-alignment-v1`

## 1) Objetivo

Definir y ejecutar validación manual de los 5 flujos críticos del sistema para cumplir el quality gate v1 del change SDD.

## 2) Alcance de validación

1. Visualización pública de proyectos.
2. Login admin por Magic Link.
3. Creación de proyecto desde admin.
4. Edición de proyecto existente.
5. Publicar/despublicar proyecto.

## 3) Precondiciones generales

- Variables de entorno configuradas para Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Al menos un usuario activo en `public.admin_users`.
- Al menos un proyecto existente para validar edición y publish toggle.
- Aplicación ejecutándose en entorno local o staging.

## 4) Casos de prueba manual

## QA-01 — Ver proyectos públicos (happy path)

**Objetivo:** validar que Home renderiza proyectos publicados.

**Pasos:**
1. Abrir `/`.
2. Ir a sección “Proyectos”.
3. Verificar que cada card muestra título, descripción y stack.
4. Abrir el enlace principal de una card (projectUrl o repoUrl).

**Resultado esperado:**
- Se listan proyectos visibles sin error de render.
- Enlaces abren destino esperado.

**Evidencia sugerida:**
- Captura de sección de proyectos.

## QA-02 — Ver fallback público ante error de carga

**Objetivo:** validar resiliencia de Home cuando falla la carga.

**Pasos:**
1. Simular error de acceso a proveedor (por ejemplo, credenciales inválidas en entorno de prueba).
2. Abrir `/`.
3. Ir a sección “Proyectos”.

**Resultado esperado:**
- Aparece mensaje de fallback (“No se pudieron cargar los proyectos…” o equivalente).
- La página no crashea.

**Evidencia sugerida:**
- Captura del mensaje fallback + consola/terminal del error controlado.

## QA-03 — Login admin por Magic Link

**Objetivo:** validar autenticación admin.

**Pasos:**
1. Abrir `/admin/login`.
2. Ingresar correo admin válido.
3. Enviar formulario.
4. Abrir enlace Magic Link recibido.
5. Verificar redirección a `/admin`.

**Resultado esperado:**
- Se muestra mensaje de envío exitoso.
- Al abrir el enlace, sesión activa y acceso al panel admin.

**Evidencia sugerida:**
- Captura del panel admin con sesión iniciada.

## QA-04 — Crear proyecto desde admin

**Objetivo:** validar alta de proyecto y persistencia.

**Pasos:**
1. En `/admin`, click en “Nuevo proyecto”.
2. Completar campos requeridos (título, descripción, stack).
3. Completar links válidos (si aplica).
4. Guardar.
5. Volver a listado y confirmar aparición del nuevo proyecto.

**Resultado esperado:**
- Proyecto creado correctamente.
- Visible en tabla admin con datos consistentes.

**Evidencia sugerida:**
- Captura de tabla con nuevo registro.

## QA-05 — Validación de errores en creación

**Objetivo:** validar reglas de negocio y códigos de error.

**Escenario A (400):** título o descripción vacíos.  
**Escenario B (400):** URL inválida.  
**Escenario C (409):** slug duplicado.

**Resultado esperado:**
- Se rechaza operación sin persistir datos.
- Mensaje de error visible y consistente.

**Evidencia sugerida:**
- Captura de mensaje de error por escenario.

## QA-06 — Editar proyecto existente

**Objetivo:** validar actualización de campos.

**Pasos:**
1. En `/admin`, click “Editar” sobre un proyecto.
2. Modificar título, descripción o stack.
3. Guardar cambios.
4. Confirmar en listado o reingresando al formulario.

**Resultado esperado:**
- Cambios persistidos correctamente.

**Evidencia sugerida:**
- Captura antes/después o registro en tabla.

## QA-07 — Publicar / despublicar proyecto

**Objetivo:** validar cambio de visibilidad.

**Pasos:**
1. En tabla admin, identificar estado actual (“Publicado”/“Oculto”).
2. Click en botón de toggle.
3. Esperar actualización y refresco de vista.

**Resultado esperado:**
- Estado cambia correctamente.
- No aparecen errores no controlados.

**Evidencia sugerida:**
- Captura del estado antes/después.

## QA-08 — Seguridad de API admin (401/403)

**Objetivo:** validar protección de endpoints admin.

**Pasos:**
1. Probar endpoint admin sin sesión activa.
2. Probar endpoint admin con sesión autenticada no-admin (si aplica entorno).

**Resultado esperado:**
- Sin sesión: `401 Unauthorized`.
- Sin rol admin activo: `403 Forbidden`.

**Evidencia sugerida:**
- Respuesta HTTP (captura de cliente API/cURL/Postman).

## 5) Registro de ejecución

| Caso | Estado (PASS/FAIL/BLOCKED) | Fecha | Ejecutó | Evidencia |
|---|---|---|---|---|
| QA-01 | BLOCKED | 2026-04-03 | AI Agent | Requiere app en runtime + validación visual manual |
| QA-02 | BLOCKED | 2026-04-03 | AI Agent | Requiere simulación de falla de proveedor en entorno controlado |
| QA-03 | BLOCKED | 2026-04-03 | AI Agent | Requiere acceso a correo real para Magic Link |
| QA-04 | BLOCKED | 2026-04-03 | AI Agent | Requiere persistencia real en Supabase |
| QA-05 | BLOCKED | 2026-04-03 | AI Agent | Requiere pruebas runtime de validaciones HTTP |
| QA-06 | BLOCKED | 2026-04-03 | AI Agent | Requiere edición real sobre datos existentes |
| QA-07 | BLOCKED | 2026-04-03 | AI Agent | Requiere flujo UI activo en entorno de ejecución |
| QA-08 | BLOCKED | 2026-04-03 | AI Agent | Requiere pruebas 401/403 con perfiles distintos |

## 6) Criterio de aprobación QA v1

Se aprueba QA v1 cuando:

- QA-01, QA-03, QA-04, QA-06 y QA-07 están en **PASS**.
- QA-02 y QA-08 están en **PASS** o con excepción documentada y plan de remediación.
- No hay defectos críticos abiertos en seguridad de acceso ni en creación/edición/publicación.
