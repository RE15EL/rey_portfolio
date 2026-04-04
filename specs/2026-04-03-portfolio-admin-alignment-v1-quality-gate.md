# Quality Gate v1 — Portfolio Admin Alignment

Fecha: 2026-04-03  
Proyecto: `rey_portfolio`  
Change: `portfolio-admin-alignment-v1`

## 1) Objetivo

Estandarizar el criterio mínimo obligatorio antes de dar por válido un cambio funcional.

## 2) Gate obligatorio (v1)

## Paso A — Lint

Comando:

```bash
npm run lint
```

Condición de pase:

- Sin errores bloqueantes.

## Paso B — Typecheck

Comando:

```bash
npx tsc --noEmit
```

Condición de pase:

- Sin errores de tipos.

## Paso C — QA manual (matriz)

Referencia:

- `specs/2026-04-03-portfolio-admin-alignment-v1-qa-matrix.md`

Condición de pase:

- Casos críticos ejecutados con resultado **PASS** o excepción justificada.

## 3) Criterio de bloqueo

El cambio queda **BLOCKED** si ocurre cualquiera de estos:

- Falla lint.
- Falla typecheck.
- Falla seguridad de acceso (`401/403`) en flujos admin.
- Falla creación/edición/publicación de proyectos sin workaround aceptable.

## 4) Excepciones permitidas

Solo se permiten excepciones temporales si:

1. Se documenta impacto.
2. Se documenta mitigación.
3. Se define fecha objetivo de corrección.

## 5) Plantilla de evidencia por ejecución

Completar en cada validación:

| Campo | Valor |
|---|---|
| Fecha |  |
| Branch/Commit |  |
| Ejecutó |  |
| Lint (`npm run lint`) | PASS / FAIL |
| Typecheck (`npx tsc --noEmit`) | PASS / FAIL |
| QA matriz (archivo + estado) | PASS / FAIL / BLOCKED |
| Observaciones |  |

## 6) Definición de “Ready for review”

Un cambio está listo para revisión cuando:

- Lint PASS,
- Typecheck PASS,
- QA crítica PASS,
- riesgos remanentes explicitados.
