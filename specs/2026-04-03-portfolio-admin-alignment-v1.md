# SDD — Portfolio Admin Alignment v1

Fecha: 2026-04-03  
Proyecto: `rey_portfolio`  
Change name: `portfolio-admin-alignment-v1`

## 1) Executive summary

Se consolida el portfolio como producto operable con criterios SDD verificables: alcance funcional claro (público + admin), requisitos no funcionales medibles, plan de tareas y matriz de verificación.  
Objetivo: pasar de una descripción funcional correcta a una especificación ejecutable y auditable por fases.

## 2) Proposal

### Objetivo

Establecer una base SDD completa para el portfolio y su panel admin, con foco en seguridad, mantenibilidad y calidad mínima continua.

### Problema

El sistema ya funciona, pero faltaba formalización en formato SDD operativo (requisitos con aceptación explícita, task breakdown y verify matrix).

### Alcance (in)

- Sitio público del portfolio (secciones y proyectos publicados).
- Panel admin (login Magic Link, alta/edición, publish toggle).
- Control de acceso con `admin_users` y RLS.
- Quality gate v1: lint + typecheck + QA manual de flujos críticos.

### Fuera de alcance (out)

- Rediseño visual completo.
- Multi-idioma.
- Nuevo proveedor de datos distinto de Supabase.
- Analítica avanzada (solo baseline de observabilidad).

## 3) Spec (requisitos y criterios de aceptación)

### RQ-01 — Lectura pública de proyectos

**Requisito:** visitantes solo visualizan proyectos publicados.  
**Criterios de aceptación:**
- `GET /api/projects` devuelve proyectos con `isPublished=true`.
- Home renderiza únicamente proyectos publicados.

### RQ-02 — Control de acceso admin

**Requisito:** solo admins activos gestionan contenido.  
**Criterios de aceptación:**
- Sin sesión en endpoints admin: `401`.
- Sesión autenticada sin rol admin activo: `403`.
- Páginas admin redirigen a `/admin/login` cuando corresponde.

### RQ-03 — Gestión de proyectos

**Requisito:** admin puede crear, editar y publicar/despublicar proyectos.  
**Criterios de aceptación:**
- `POST /api/admin/projects` crea proyecto válido.
- `PATCH /api/admin/projects/:id` actualiza datos.
- `PATCH /api/admin/projects/:id/publish` actualiza estado de publicación.

### RQ-04 — Validación de negocio y errores consistentes

**Requisito:** datos inválidos se rechazan con códigos consistentes.  
**Criterios de aceptación:**
- Título o descripción vacíos: `400`.
- URL inválida: `400`.
- Slug duplicado: `409`.
- Proyecto inexistente: `404`.

### RQ-05 — Resiliencia de Home

**Requisito:** fallas del proveedor externo no deben romper la página principal.  
**Criterios de aceptación:**
- Ante error de carga, se muestra mensaje de fallback en Home.
- El render no termina en error fatal.

### RQ-06 — Rendimiento v1 (objetivo)

**Requisito:** experiencia inicial aceptable en red móvil.  
**Criterios de aceptación (objetivo):**
- Carga inicial pública < 3 segundos en 4G.
- LCP < 2.5 segundos en Home.

### RQ-07 — Mantenibilidad arquitectónica

**Requisito:** desacople entre negocio y proveedor de datos.  
**Criterios de aceptación:**
- Casos de uso dependen de `IProjectRepository`.
- Selección de proveedor centralizada por factory (`PROJECTS_DATA_PROVIDER`).

### RQ-08 — Calidad mínima continua

**Requisito:** cada cambio funcional debe pasar gate mínimo.  
**Criterios de aceptación:**
- `npm run lint` exitoso.
- `npx tsc --noEmit` exitoso.
- QA manual ejecutada para 5 flujos críticos.

## 4) Arquitectura (estado actual)

- Frontend: Next.js 14 + React 18 + TypeScript + Tailwind + Framer Motion.
- Backend/BFF: Route Handlers de Next.js (`src/app/api/**/route.ts`).
- Datos/Auth: Supabase (`@supabase/ssr`, `@supabase/supabase-js`).
- Seguridad: RLS y policies SQL para `projects` y `admin_users`.
- Hosting: a confirmar por entorno de despliegue (recomendado: Vercel + Supabase).

## 5) Tasks (desglose ejecutable)

### T1 — Formalizar baseline SDD
- [x] Consolidar y mantener esta spec como fuente de verdad del change.
- [x] Versionar actualizaciones de alcance/aceptación cuando cambien reglas.

### T2 — Matriz de QA manual v1
- [x] Documentar casos y expected results para:
  - [ ] ver proyectos públicos,
  - [ ] login admin,
  - [ ] crear proyecto,
  - [ ] editar proyecto,
  - [ ] publicar/despublicar.

### T3 — Baseline de observabilidad
- [x] Estandarizar logs de error API/auth (ruta, timestamp, status, mensaje).
- [x] Evitar exposición de datos sensibles en logs.

### T4 — Hardening UX de errores admin
- [x] Unificar mensajes de error en formularios y tabla admin.
- [x] Mostrar feedback accionable para errores frecuentes (validación/autorización).

### T5 — Quality gate operativo
- [x] Definir checklist por cambio/PR: lint + typecheck + QA manual.
- [x] Registrar evidencia mínima de ejecución del gate.

### T6 — Plan de testing incremental (v2)
- [x] Definir framework de tests y estrategia de cobertura inicial.
- [x] Priorizar tests de casos de uso críticos (`create`, `update`, `setPublished`).

## 6) Verify matrix

| ID | Verificación | Método | Evidencia esperada |
|---|---|---|---|
| V-01 | Solo proyectos publicados en público | Llamar `GET /api/projects` | Lista solo publicada |
| V-02 | Seguridad 401/403 admin API | Probar endpoint admin sin sesión y sin rol | Status correcto por caso |
| V-03 | Alta de proyecto | Flujo UI + POST API | Registro nuevo visible en admin |
| V-04 | Validaciones 400/409 | Payload inválido y slug duplicado | Mensaje + status consistentes |
| V-05 | Edición de proyecto | Flujo UI + PATCH API | Datos actualizados |
| V-06 | Publicar/despublicar | Toggle en tabla + PATCH publish | Estado actualizado |
| V-07 | Fallback Home | Simulación de falla de proveedor | Aviso de fallback visible |
| V-08 | Gate técnico | Ejecutar lint + typecheck | Sin errores |
| V-09 | RLS efectivo | Revisión de policies en migración/DB | Restricción por rol/email activa |

## 7) Riesgos y mitigaciones

- **Riesgo:** ausencia actual de tests automatizados.  
  **Mitigación:** gate mínimo inmediato + plan incremental de tests (T6).

- **Riesgo:** dependencia de proveedor externo (Supabase) en SSR/API.  
  **Mitigación:** fallback UI en Home + logging de errores + manejo explícito en rutas.

- **Riesgo:** supuestos de despliegue no documentados en repo.  
  **Mitigación:** registrar decisión final de hosting en una actualización de esta spec.

## 8) Definition of Done (change)

Este change se considera completado cuando:

1. Esta spec se mantiene actualizada y versionada.
2. Tasks T1–T5 están completadas con evidencia.
3. Verify matrix V-01 a V-09 ejecutada con resultados.
4. Gate mínimo (`lint` + `typecheck` + QA manual) cumple sin bloqueantes críticos.
5. Riesgos abiertos y próximos pasos quedan documentados.
