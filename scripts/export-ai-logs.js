#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const [, , transcriptPath, sessionTitle] = process.argv;

if (!transcriptPath) {
  console.error(
    'Usage: node scripts/export-ai-logs.js <path/to/transcript.jsonl> [session-title]'
  );
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'ai-sessions', 'ai-logs.md');

function extractUserQuery(text) {
  const match = text.match(/<user_query>([\s\S]*?)<\/user_query>/);
  return match ? match[1].trim() : text.trim();
}

function extractTimestamp(text) {
  const match = text.match(/<timestamp>([\s\S]*?)<\/timestamp>/);
  return match ? match[1].trim() : null;
}

function extractAssistantText(contentArray) {
  return contentArray
    .filter((b) => b.type === 'text' && b.text && b.text.trim())
    .map((b) => b.text.trim())
    .join('\n\n');
}

function buildLog() {
  const raw = fs.readFileSync(transcriptPath, 'utf-8');
  const lines = raw.split('\n').filter(Boolean);

  const turns = [];
  let currentUserText = null;
  let assistantChunks = [];
  let sessionDate = null;

  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    const { role, message } = entry;
    const content = message?.content ?? [];

    if (role === 'user') {
      if (currentUserText !== null) {
        turns.push({ user: currentUserText, assistant: assistantChunks.join('\n\n') });
      }
      const rawText = content.find((b) => b.type === 'text')?.text ?? '';
      if (!sessionDate) sessionDate = extractTimestamp(rawText);
      currentUserText = extractUserQuery(rawText);
      assistantChunks = [];
    } else if (role === 'assistant') {
      const text = extractAssistantText(content);
      if (text) assistantChunks.push(text);
    }
  }

  if (currentUserText !== null) {
    turns.push({ user: currentUserText, assistant: assistantChunks.join('\n\n') });
  }

  return { turns, sessionDate };
}

function formatSession(turns, sessionDate, title, uuid) {
  const date = sessionDate ?? new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const turnBlocks = turns
    .map((t, i) => {
      const num = i + 1;
      return [
        `### Turn ${num}`,
        '',
        '**User:**',
        t.user,
        '',
        '**Assistant:**',
        t.assistant || '*(no text response captured)*',
      ].join('\n');
    })
    .join('\n\n---\n\n');

  return [
    `## Session: ${title} — ${date}`,
    `**Transcript ID:** \`${uuid}\``,
    '',
    turnBlocks,
    '',
  ].join('\n');
}

function main() {
  const uuid = path.basename(path.dirname(transcriptPath));
  const title = sessionTitle ?? 'AI Session';

  const { turns, sessionDate } = buildLog();
  const sessionBlock = formatSession(turns, sessionDate, title, uuid);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const exists = fs.existsSync(outputPath);
  if (!exists) {
    fs.writeFileSync(outputPath, `# AI Session Logs\n\n${sessionBlock}`);
  } else {
    fs.appendFileSync(outputPath, `\n---\n\n${sessionBlock}`);
  }

  console.log(`✓ ${exists ? 'Appended' : 'Created'} ${outputPath}`);
  console.log(`  Session: ${title}`);
  console.log(`  Turns:   ${turns.length}`);
  console.log(`  UUID:    ${uuid}`);
}

main();
