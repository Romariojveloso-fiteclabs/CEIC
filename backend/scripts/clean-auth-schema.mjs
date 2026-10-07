import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../src/database/schema/auth.schema.ts', import.meta.url);
writeFileSync(path, readFileSync(path, 'utf8').replaceAll('/* @__PURE__ */ ', ''));
