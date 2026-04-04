---
name: group-changes-and-commit
description: Analyze modified files, group them by logical change, stage them in coherent sets, and create separate commits with clear Conventional Commit messages. Use when the user asks to commit repository changes, especially when multiple modified files may belong to different logical changes.
---

# Group Changes and Commit

Inspect the repository state before committing:

- Run `git status --short`.
- Run `git diff --stat`.
- Run `git diff`.
- Run `git log -n 10 --oneline`.

Group changes by intent, not only by file proximity.

- Keep commits atomic and coherent.
- Never mix unrelated work in the same commit.
- Prefer separating:
  - new functionality
  - bug fixes
  - refactors
  - visual or UI polish
  - tests
  - documentation
  - configuration or dependencies
- If one file appears to contain multiple purposes, inspect its diff before assigning it to a commit group.

Stage files per logical group and create one commit per group.

- Use `git add <paths>` for each group.
- Do not commit secrets.
- Do not run destructive git commands.

Write commit messages around intent.

- Prefer Conventional Commits format: `type(scope): summary`.
- Keep the summary concise and imperative.
- Choose the scope that best matches the affected area.

Before finalizing a non-trivial code change, follow the repository workflow in `AGENTS.md` for validation commands.
