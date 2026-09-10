<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Rules

## Theme & UI Consistency
- **Preserve Existing Functionality**: Do not alter existing feature logic or make unnecessary code changes.
- **Dark & Light Theme Support**: Every page must depend on and fully support both Dark Theme and Light Theme.
- **Top Bar Theme Switcher**: Always provide a clickable Theme Toggle option (Dark/Light mode switcher) in the top navigation/header bar across all pages.
