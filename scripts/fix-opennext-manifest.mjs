import { readFile, writeFile } from 'node:fs/promises';

// OpenNext 1.20.10 omits Next 16.4's preview-props.json from its
// inlined manifests. Include the real build file, not an empty fallback.
const file = new URL('../node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/load-manifest.js', import.meta.url);
const source = await readFile(file, 'utf8');
const before = '**/{*-manifest,required-server-files,prefetch-hints}.json';
const after = '**/{*-manifest,required-server-files,prefetch-hints,preview-props}.json';
if (source.includes(after)) {
  console.log('OpenNext preview manifest fix already applied.');
} else if (source.includes(before)) {
  await writeFile(file, source.replace(before, after));
  console.log('Applied OpenNext fix for Next 16.4 preview-props.json.');
} else {
  throw new Error('OpenNext manifest patch changed. Review adapter compatibility before deployment.');
}
