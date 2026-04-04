# Especificación de Cambios — Módulo Projects (DB-first + Provider Abstraction)

Fecha: 2026-04-01  
Proyecto: `rey_portfolio`

## 1) Objetivo

Migrar la fuente de verdad de proyectos desde datos hardcodeados a `public.projects` en Supabase y reforzar una arquitectura mantenible/escalaable para minimizar fricción futura al cambiar de proveedor de datos (por ejemplo, de Supabase a otra plataforma).

## 2) Motivación

- Existían datos legacy hardcodeados en constantes.
- Se requería persistencia real en base de datos.
- Se pidió explícitamente aislar el flujo de BD del negocio para facilitar cambios de infraestructura sin afectar casos de uso ni presentación.

## 3) Alcance

### Incluido

1. Seed SQL directo de proyectos en `public.projects` cumpliendo el contrato vigente.
2. Refactor de composición del módulo para usar una **factory de repositorio**.
3. Conservación del puerto de dominio `IProjectRepository` como contrato principal.
4. Eliminación de archivos legacy no usados (constantes/tipos de proyectos antiguos).

### No incluido

- Nuevo adapter no-Supabase (solo se dejó el punto de extensión).
- Implementación de provider `in-memory`.
- Cambios de schema adicionales en DB.

## 4) Diseño / Arquitectura

Se aplica patrón **Ports & Adapters (Hexagonal)** + **Factory Method** en la capa de infraestructura:

- **Puerto de dominio**: `IProjectRepository` (sin cambios de contrato).
- **Adapter actual**: `SupabaseProjectRepository`.
- **Factory nueva**: `createProjectRepository()` selecciona provider por configuración (`PROJECTS_DATA_PROVIDER`).
- **Composition root** (`createProjectsModule`) deja de conocer Supabase en forma directa.

Resultado: los casos de uso (`application`) y la presentación no dependen de detalles de Supabase.

## 5) Contrato de datos (alineación)

Tabla objetivo: `public.projects`

Campos relevantes y mapeo de dominio:

- `id` ↔ `IProject.id`
- `slug` ↔ `IProject.slug`
- `title` ↔ `IProject.title`
- `description` ↔ `IProject.description`
- `stack` (text[]) ↔ `IProject.stack`
- `image_url` ↔ `IProject.imageUrl`
- `project_url` ↔ `IProject.projectUrl`
- `repo_url` ↔ `IProject.repoUrl`
- `is_published` ↔ `IProject.isPublished`
- `sort_order` ↔ `IProject.sortOrder`
- `created_at` ↔ `IProject.createdAt`
- `updated_at` ↔ `IProject.updatedAt`
- `updated_by` ↔ `IProject.updatedBy`

## 6) Cambios implementados

### 6.1 Seed SQL (directo)

Se insertaron/actualizaron (idempotente por `slug`) los proyectos:

- `morereps`
- `taskmind`
- `tinttrace`
- `seriesly`

Estrategia aplicada: `INSERT ... ON CONFLICT (slug) DO UPDATE`.

Notas:
- `link="#"` legacy se normalizó como `project_url = null`.
- `is_published = true` para los cuatro registros.
- `sort_order` preservado según orden original (1..4).

### 6.2 Refactor de infraestructura

#### Archivo nuevo

- `src/modules/projects/infrastructure/projects-repository-factory.ts`
  - Resuelve provider vía `PROJECTS_DATA_PROVIDER`.
  - Provider por defecto: `supabase`.
  - Si el provider no es soportado, falla explícitamente con error descriptivo.

#### Archivo modificado

- `src/modules/projects/infrastructure/projects-module.ts`
  - Antes: instanciaba Supabase client + repo directo.
  - Ahora: delega en `createProjectRepository()`.

### 6.3 Limpieza de legado

- Eliminado: `src/lib/constants/projects.ts`
- Eliminado: `src/types/projects.interface.ts`
- Ajustados barrels:
  - `src/lib/constants/index.ts`
  - `src/types/index.ts`

## 7) Criterios de aceptación

1. Home y endpoints de proyectos funcionan con datos desde DB.
2. No existen imports activos del archivo de constantes legacy de proyectos.
3. Compilación de TypeScript sin errores (`npx tsc --noEmit`).
4. Flujo de negocio depende del puerto `IProjectRepository`, no de Supabase directo.
5. Cambio futuro de provider requiere tocar solo capa `infrastructure` (adapter + factory).

## 8) Riesgos y mitigaciones

### Riesgo
Dependencia de disponibilidad de Supabase para render SSR.

### Mitigación
Ya se agregó fallback en Home para no romper con 500 cuando el proveedor externo falla.

### Riesgo
Config inválida de provider (`PROJECTS_DATA_PROVIDER`).

### Mitigación
Error explícito en factory al detectar provider no soportado.

## 9) Plan de extensión futura

Para agregar un nuevo proveedor (ej. Postgres/Prisma/otro BaaS):

1. Crear `XProjectRepository implements IProjectRepository`.
2. Agregar case en `projects-repository-factory.ts`.
3. Configurar `PROJECTS_DATA_PROVIDER=x`.

Sin cambios requeridos en:
- casos de uso (`application`)
- dominio (`domain`)
- UI/endpoints (salvo wiring de env/config)

## 10) Rollback

Si se requiere reversión rápida:

1. Restaurar `projects-module.ts` a instanciación Supabase directa.
2. Restaurar archivos legacy eliminados (si se necesita fallback temporal hardcoded).
3. Mantener registros en DB (no destructivo).

## 11) Estado final

- Fuente de verdad de proyectos: `public.projects`.
- Arquitectura de acceso a datos desacoplada por puerto + adapter + factory.
- Base preparada para migraciones de proveedor con fricción mínima.
