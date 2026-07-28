# Glossary use case — prototype handoff notes

## Reference route and context

Legacy/reference route:

```text
/avacom-lms/main/glossary/index.php?cidReq=ALGEBRALINEAL&id_session=0&gradebook=0&origin=&gidReq=0
```

Context parameters that must survive navigation and API requests:

- `cidReq`: course code or course identifier.
- `id_session`: academic/training session identifier; `0` means no specific session.
- `gidReq`: group identifier; `0` means no specific group.
- `gradebook`: whether the user arrived from the gradebook context.
- `origin`: optional source module or return destination.

## Actors and artifacts

Primary actor:

- Instructor or authorized course editor.

Secondary actors:

- Learner/read-only user.
- Authentication and authorization service.
- Import parser.
- Export generator.
- Glossary repository/database.

Use-case artifacts:

- Glossary context.
- Paginated glossary-term collection.
- Glossary term.
- Term create/edit form.
- Term preview.
- Import file and import-validation report.
- Import job/result summary.
- Export request and generated file.
- Filters, sorting, search criteria, and pagination state.
- Authorization decision and audit event.

## Proposed backend data structure

### Glossary

- `id`: UUID or integer primary key.
- `course_id`: required relation to the course.
- `session_id`: nullable relation to a session.
- `group_id`: nullable relation to a group.
- `name`: display name.
- `description`: optional text.
- `is_published`: boolean.
- `created_at`, `updated_at`.

Recommended uniqueness boundary: course + session + group, unless the product permits multiple named glossaries in the same context.

### GlossaryTerm

- `id`: UUID or integer primary key.
- `glossary_id`: required relation.
- `term`: required string, trimmed, with a practical maximum such as 255 characters.
- `definition`: required rich text or sanitized HTML.
- `aliases`: optional array of alternative names.
- `category`: optional string or category relation.
- `source`: optional citation or URL.
- `language`: optional BCP 47 language tag.
- `status`: `draft`, `published`, or `archived`.
- `display_order`: optional integer.
- `created_by`, `updated_by`.
- `created_at`, `updated_at`.

Recommended uniqueness rule: normalized term + glossary. Define whether duplicates are rejected, merged, or allowed by import mode.

### GlossaryImportJob

- `id`.
- `glossary_id`.
- `uploaded_by`.
- `original_filename`.
- `format`: initially `csv` and `xlsx`; optionally `json`.
- `mode`: `create_only`, `upsert`, or `replace`.
- `status`: `pending`, `validating`, `completed`, `completed_with_errors`, or `failed`.
- `total_rows`, `created_count`, `updated_count`, `skipped_count`, `error_count`.
- `errors`: structured list containing row, field, code, and message.
- `created_at`, `completed_at`.

### GlossaryExport

This can be generated synchronously for small glossaries. Its request DTO should contain:

- `glossary_id`.
- `format`: `csv`, `xlsx`, or `json`.
- `filters`: search, category, language, and status.
- `include_metadata`: boolean.
- `encoding`: default `UTF-8`.

### AuditEvent

- actor, action, entity type, entity id, glossary context, timestamp, and changed fields.
- Actions: term created, updated, archived/deleted, import executed, export generated.

## Proposed API surface

- `GET /api/glossaries/{glossary_id}/terms/`
- `POST /api/glossaries/{glossary_id}/terms/`
- `GET /api/glossaries/{glossary_id}/terms/{term_id}/`
- `PATCH /api/glossaries/{glossary_id}/terms/{term_id}/`
- `DELETE /api/glossaries/{glossary_id}/terms/{term_id}/`
- `POST /api/glossaries/{glossary_id}/imports/validate/`
- `POST /api/glossaries/{glossary_id}/imports/`
- `GET /api/glossaries/{glossary_id}/imports/{job_id}/`
- `POST /api/glossaries/{glossary_id}/exports/`
- `POST /api/glossaries/{glossary_id}/terms/preview/`

All mutations must enforce course/session/group authorization in the backend. Hiding controls in the frontend is insufficient.

## Frontend prototype notes

### Glossary list

- Page title, course name, session/group context, and term count.
- Search field with delayed/debounced filtering.
- Filters for category, language, and status.
- Sort by term, creation date, update date, and display order.
- Paginated table or accessible list.
- Row actions: preview, edit, archive/delete.
- Primary actions: create term, import, export.

### Create/edit term form

- Term: required text input.
- Definition: required rich-text editor or multiline field.
- Aliases: tag/multi-value input.
- Category: searchable select, optionally allowing category creation.
- Source/reference: URL or text.
- Language: select.
- Status: draft/published.
- Display order: optional numeric input.
- Actions: preview, save draft, publish, cancel.

Show inline validation, unsaved-change protection, permission errors, and duplicate-term conflicts.

### Import workflow

- File picker and drag-and-drop area.
- Accepted-format and maximum-size guidance.
- Import mode selector: create only, update existing/upsert, replace.
- Mapping step for file columns to term fields.
- Validation preview showing valid rows, warnings, and blocking errors.
- Confirmation step before persistence.
- Final summary with downloadable error report.

The import operation should be atomic for `replace`; for other modes, define whether valid rows may succeed when invalid rows exist.

### Export workflow

- Format selector.
- Current-filter versus all-terms scope.
- Include metadata option.
- Clear filename and encoding information.
- Download progress/error state.

### Preview

- Render the term exactly as a learner will see it.
- Sanitize rich text on the backend and frontend boundary.
- Include aliases, category, source, language, and publication status when relevant.
- Preview should not persist data.

## Acceptance points for the final prototype prompt

- Preserve `cidReq`, `id_session`, `gidReq`, `gradebook`, and `origin`.
- Support read, import, create/update/archive, export, and preview.
- Define role-based permissions for learner, instructor, and administrator.
- Require server-side authorization and input sanitization.
- Include empty, loading, validation-error, permission-denied, and network-error states.
- Make import validation explicit before data is committed.
- Ensure exported files use UTF-8 and safely escape formulas in spreadsheet formats.
- Keep the UI responsive, keyboard accessible, and consistent with AVACOM branding.
