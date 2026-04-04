# Error UX Baseline v1 — Admin

Fecha: 2026-04-03  
Proyecto: `rey_portfolio`  
Change: `portfolio-admin-alignment-v1`

## 1) Objetivo

Unificar mensajes de error en el panel admin y asegurar feedback accionable para operaciones críticas.

## 2) Convención aplicada

- Mensajes orientados a acción (qué corregir o qué hacer después).
- Lenguaje consistente en español.
- Diferenciación por tipo de error (`400`, `401`, `403`, `404`, `409`, fallback `500`).
- Fallback de red para errores de conectividad.

## 3) Implementación realizada

Se incorporó un mapper centralizado:

- `src/lib/errors/admin-error-feedback.ts`

Consumo en UI:

- `src/components/admin/admin-project-form.tsx`
- `src/components/admin/admin-projects-table.tsx`
- `src/components/admin/admin-login-form.tsx`

## 4) Matriz de mensajes (resumen)

- `400` validación: indicar campos a corregir.
- `401`: sesión expirada, re-login.
- `403`: sin permisos.
- `404`: recurso inexistente.
- `409`: conflicto de slug duplicado.
- `500/fallback`: reintentar y verificar conectividad.

## 5) Beneficio esperado

- Menor fricción operativa para el admin.
- Menos ambigüedad ante fallas.
- Menos lógica duplicada de mensajes en componentes.
