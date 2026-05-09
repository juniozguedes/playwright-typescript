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

2. **Check how many turns were already exported** for this UUID by looking at the last entry in `ai-sessions/ai-logs.md`. The turn number after the last `### Turn N` heading is your watermark.

3. **Run the export script** from the project root:

   ```bash
   # First export for this session (all turns)
   node scripts/export-ai-logs.js \
     ~/.cursor/projects/Users-wellington-Documents-projects-pessoal-playwright-typescript/agent-transcripts/<uuid>/<uuid>.jsonl \
     "Short Session Title"

   # Continuing the same session (skip already-exported turns)
   node scripts/export-ai-logs.js \
     ~/.cursor/projects/Users-wellington-Documents-projects-pessoal-playwright-typescript/agent-transcripts/<uuid>/<uuid>.jsonl \
     "Short Session Title" \
     --from-turn 4
   ```

4. **Verify output** — the script prints a confirmation:
   ```
   ✓ Appended ai-sessions/ai-logs.md
     Session:    Short Session Title
     Turns:      2 (turns 4–5 of 5)
     UUID:       <uuid>
   ```

## Behaviour

| Condition | Result |
|-----------|--------|
| `ai-logs.md` does not exist | Creates the file with a `# AI Session Logs` header |
| `ai-logs.md` already exists | Appends a `---` separator followed by the new session block |
| `--from-turn N` provided | Skips the first N−1 turns; section heading reads `Session (continued): …` |
| `--from-turn N` exceeds total turns | Prints a "Nothing to export" notice and exits cleanly |

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
