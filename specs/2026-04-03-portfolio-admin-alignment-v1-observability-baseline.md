# Observability Baseline v1 — Portfolio Admin

Fecha: 2026-04-03  
Proyecto: `rey_portfolio`  
Change: `portfolio-admin-alignment-v1`

## 1) Objetivo

Definir un estándar mínimo de logging para errores en API y autenticación, útil para diagnóstico rápido sin exponer datos sensibles.

## 2) Alcance

- Rutas API bajo `src/app/api/**/route.ts`.
- Flujos de autenticación admin (`/admin/login`, `/auth/callback`, logout y control de acceso).
- Errores de negocio y errores inesperados.

## 3) Formato mínimo de log (error)

Cada error relevante debe registrar estos campos:

- `timestamp`: fecha/hora ISO (`new Date().toISOString()`).
- `layer`: `api` | `auth` | `app`.
- `route`: path lógico (`/api/admin/projects/:id`, `/auth/callback`, etc.).
- `method`: `GET` | `POST` | `PATCH` | `DELETE` (si aplica).
- `status`: código HTTP esperado/retornado (`400`, `401`, `403`, `404`, `409`, `500`).
- `errorCode`: código interno estable (ej: `PROJECT_NOT_FOUND`, `UNAUTHORIZED`, `VALIDATION_ERROR`).
- `message`: mensaje técnico breve y accionable.
- `requestId`: identificador de correlación (si existe).

## 4) Ejemplo recomendado

```ts
console.error("[api-error]", {
  timestamp: new Date().toISOString(),
  layer: "api",
  route: "/api/admin/projects/:id",
  method: "PATCH",
  status: 404,
  errorCode: "PROJECT_NOT_FOUND",
  message: "Project with id '...' was not found",
  requestId,
});
```

## 5) Política de datos sensibles (obligatoria)

No registrar en logs:

- Tokens de sesión/JWT.
- Cookies.
- API keys / secretos / variables de entorno.
- Payloads completos que incluyan datos sensibles.
- Correos completos cuando no sea necesario (preferir enmascarado parcial en auditoría).

Sí registrar:

- Código de error,
- contexto técnico,
- ruta y status,
- IDs técnicos no sensibles.

## 6) Niveles de severidad sugeridos

- `warn`: validaciones esperadas de usuario (`400`, `409`).
- `error`: fallas de autenticación/autorización inesperadas y errores `5xx`.

## 7) Checklist de adopción

- [ ] Todas las rutas admin devuelven error con status + mensaje consistente.
- [ ] Errores de negocio tienen `errorCode` estable.
- [ ] No se exponen secretos ni tokens en logs.
- [ ] Se registra contexto mínimo (`route`, `method`, `status`, `timestamp`).

## 8) Evidencia mínima de cumplimiento

- Captura o extracto de logs para al menos:
  - un `400` de validación,
  - un `401/403` de acceso,
  - un `404` de recurso no encontrado,
  - un `500` controlado (si aplica entorno de prueba).
