# Testing Plan v2 (Incremental) — Portfolio Admin

Fecha: 2026-04-03  
Proyecto: `rey_portfolio`  
Change: `portfolio-admin-alignment-v1`

## 1) Objetivo

Definir una estrategia incremental de testing para cubrir primero la lógica de negocio crítica y luego los flujos API/UI, sin frenar la entrega actual.

## 2) Decisión de framework (propuesta)

- Runner principal: **Vitest**.
- Testing de componentes: **@testing-library/react** + **@testing-library/jest-dom**.
- Mock de red (fase API/UI): **MSW** (opcional en etapa 2).

## 3) Estrategia por etapas

## Etapa 1 — Unit tests de dominio/aplicación (prioridad alta)

Cobertura objetivo inicial:

- `CreateProjectUseCase`
- `UpdateProjectUseCase`
- `SetProjectPublishedUseCase`
- `validate-project-input`
- `slugify`

Razón: son las piezas con mayor impacto funcional y menor costo de setup.

## Etapa 2 — Integración de capa API (prioridad media)

Cobertura objetivo:

- `GET /api/projects`
- `POST /api/admin/projects`
- `PATCH /api/admin/projects/:id`
- `PATCH /api/admin/projects/:id/publish`
- Respuestas esperadas `401/403/404/409`.

## Etapa 3 — UI crítica admin (prioridad media-baja)

Cobertura objetivo:

- Feedback de error en:
  - `admin-project-form`
  - `admin-projects-table`
  - `admin-login-form`

- Flujo básico de submit con estados (`isSubmitting`, errores y éxito).

## 4) Criterios de cobertura mínima sugeridos

- Etapa 1: 70% en `src/modules/projects/application/**`.
- Etapa 2: casos felices + errores críticos por endpoint.
- Etapa 3: al menos un test por escenario de error principal en cada componente admin.

## 5) Estructura de archivos sugerida

- `src/modules/projects/application/**/*.test.ts`
- `src/modules/projects/presentation/**/*.test.ts`
- `src/app/api/**/*.test.ts`
- `src/components/admin/**/*.test.tsx`

## 6) Scripts recomendados (cuando se implemente)

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:one": "vitest run"
  }
}
```

## 7) Definition of Done para testing v2

Se considera completado el plan cuando:

1. Etapa 1 implementada con tests verdes en CI/local.
2. Etapa 2 cubre happy path + errores críticos de seguridad/negocio.
3. Etapa 3 valida feedback UX principal de admin.
4. El gate técnico evoluciona a: lint + typecheck + tests + QA manual crítica.

## 8) Riesgos y mitigación

- **Riesgo:** inversión inicial de setup de testing.
  - **Mitigación:** rollout incremental por etapas.

- **Riesgo:** fragilidad en tests UI por cambios visuales.
  - **Mitigación:** priorizar assertions por comportamiento, no por estructura de estilos.
