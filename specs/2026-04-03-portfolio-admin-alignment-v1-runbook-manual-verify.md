# Runbook Manual — Cierre Verify/QA (Portfolio Admin Alignment v1)

Fecha: 2026-04-03  
Proyecto: `rey_portfolio`  
Change: `portfolio-admin-alignment-v1`

## 1) Objetivo

Ejecutar en una sola pasada las validaciones manuales necesarias para pasar los casos actualmente en `BLOCKED` a `PASS/FAIL` con evidencia.

## 2) Precondiciones

1. Variables de entorno configuradas (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
2. Usuario admin activo en `public.admin_users`.
3. Acceso a correo para recibir Magic Link.
4. App levantada local/staging.

## 3) Comandos base (terminal 1)

```bash
npm run dev
```

URL esperada local: `http://localhost:3000`

## 4) Evidencia mínima a recolectar

- Capturas de pantalla para flujos UI.
- Respuestas HTTP (Postman/cURL/inspector) para 401/403/400/404/409.
- Registro breve en tabla QA (`PASS/FAIL`, fecha, evidencia).

## 5) Ejecución paso a paso (orden recomendado)

## Paso A — Verificación técnica rápida (V-08)

Ejecutar (terminal 2):

```bash
npm run lint
npx tsc --noEmit
```

Registrar resultado en verify report.

## Paso B — Flujo público proyectos (QA-01 / V-01)

1. Abrir `/`.
2. Ir a sección proyectos.
3. Confirmar que se muestran proyectos publicados.
4. Abrir un enlace de proyecto o repo.

**PASS si:** se renderiza listado y enlaces funcionan.

## Paso C — Fallback Home (QA-02 / V-07)

1. En entorno de prueba, simular fallo de proveedor (credenciales inválidas o bloqueo temporal).
2. Recargar `/`.

**PASS si:** aparece mensaje fallback y la página no crashea.

## Paso D — Login admin (QA-03)

1. Ir a `/admin/login`.
2. Ingresar email admin.
3. Enviar y abrir Magic Link del correo.
4. Confirmar ingreso a `/admin`.

**PASS si:** sesión activa y panel visible.

## Paso E — Crear proyecto (QA-04 / V-03)

1. `/admin` → “Nuevo proyecto”.
2. Completar campos válidos.
3. Guardar.
4. Confirmar aparición en tabla admin.

**PASS si:** proyecto creado y visible.

## Paso F — Validaciones negocio (QA-05 / V-04)

Probar tres escenarios:

- Título o descripción vacíos → esperar `400`.
- URL inválida → esperar `400`.
- Slug duplicado → esperar `409`.

**PASS si:** status y mensajes son consistentes.

## Paso G — Editar proyecto (QA-06 / V-05)

1. Elegir un proyecto existente.
2. Editar campos.
3. Guardar cambios.
4. Confirmar persistencia.

**PASS si:** cambios reflejados correctamente.

## Paso H — Publicar/despublicar (QA-07 / V-06)

1. En tabla admin, ejecutar toggle de publicación.
2. Confirmar cambio de estado en UI.

**PASS si:** estado cambia sin errores inesperados.

## Paso I — Seguridad API admin (QA-08 / V-02)

1. Probar endpoint admin sin sesión (esperar `401`).
2. Probar con usuario autenticado no-admin (esperar `403`).

**PASS si:** ambos códigos se respetan.

## Paso J — Cierre de RLS (V-09)

Confirmar que la política sigue vigente en migración:

- `supabase/migrations/20260217_001_projects_admin.sql`

**PASS si:** reglas de acceso por admin activo continúan consistentes.

## 6) Plantilla rápida de registro

Usar esta estructura por caso:

- Caso: QA-0X / V-0X
- Estado: PASS / FAIL
- Fecha:
- Evidencia: (ruta de captura o nota de respuesta HTTP)
- Observación:

## 7) Criterio de cierre final del change

Cerrar cuando:

1. QA-01..QA-08 tengan estado final (no BLOCKED).
2. V-01..V-09 tengan estado final con evidencia.
3. No existan fallos críticos abiertos en seguridad ni gestión de proyectos.
