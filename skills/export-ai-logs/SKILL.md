---
name: export-ai-logs
description: Export the current Cursor AI conversation into ai-sessions/ai-logs.md in append mode. Use when the user asks to export, save, or log the current chat session, or when finishing a session that should be recorded.
---

# Export AI Logs

Exports the current conversation transcript to `ai-sessions/ai-logs.md` in the project root. Each call appends a new session block — it never overwrites previous sessions.

## Steps

1. **Find the transcript file** for the current session.

   The transcripts folder for this project is:
   ```
   ~/.cursor/projects/Users-wellington-Documents-projects-pessoal-playwright-typescript/agent-transcripts/
   ```

   List it to find the session UUID directory (exclude `subagents/`):
   ```bash
   ls ~/.cursor/projects/Users-wellington-Documents-projects-pessoal-playwright-typescript/agent-transcripts/
   ```

   The transcript file is at:
   ```
   ~/.cursor/projects/Users-wellington-Documents-projects-pessoal-playwright-typescript/agent-transcripts/<uuid>/<uuid>.jsonl
   ```

2. **Run the export script** from the project root, passing the transcript path and a short session title:

   ```bash
   node scripts/export-ai-logs.js \
     ~/.cursor/projects/Users-wellington-Documents-projects-pessoal-playwright-typescript/agent-transcripts/<uuid>/<uuid>.jsonl \
     "Short Session Title"
   ```

3. **Verify output** — the script prints a confirmation:
   ```
   ✓ Appended ai-sessions/ai-logs.md
     Session: Short Session Title
     Turns:   3
     UUID:    <uuid>
   ```

## Behaviour

| Condition | Result |
|-----------|--------|
| `ai-logs.md` does not exist | Creates the file with a `# AI Session Logs` header |
| `ai-logs.md` already exists | Appends a `---` separator followed by the new session block |

## Output format

```markdown
# AI Session Logs

## Session: <title> — <date>
**Transcript ID:** `<uuid>`

### Turn 1

**User:**
<user query>

**Assistant:**
<assistant response>

---

### Turn 2
...
```

## Notes

- Only `type: text` content is extracted — tool calls and tool results are omitted.
- Each user turn is paired with all assistant messages that follow it before the next user message.
- The session title should summarise the main topic of the conversation (e.g. `"Login Flow Architecture"`).
