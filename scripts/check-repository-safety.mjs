import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const trackedFiles = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
  .filter(path => !path.endsWith('.lock'))
  .filter(path => !/\.(png|jpe?g|gif|webp|ico|pdf|zip|woff2?|ttf|mp4|mov|mp3|wav)$/i.test(path));

const signatures = [
  { name: 'private key header', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Google service-account document', pattern: /"type"\s*:\s*"service_account"/ },
  { name: 'embedded service-account private key', pattern: /"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----/ },
  { name: 'Google API key-shaped value', pattern: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'GitHub token-shaped value', pattern: /gh[pousr]_[A-Za-z0-9]{36,}/ },
  { name: 'Slack token-shaped value', pattern: /xox[baprs]-[A-Za-z0-9-]{20,}/ },
  { name: 'OpenAI-style secret-shaped value', pattern: /\bsk-[A-Za-z0-9_-]{32,}\b/ },
];

const findings = [];
for (const path of trackedFiles) {
  let content;
  try {
    content = readFileSync(path, 'utf8');
  } catch {
    continue;
  }
  for (const signature of signatures) {
    const match = content.match(signature.pattern);
    if (!match || match.index === undefined) continue;
    const line = content.slice(0, match.index).split('\n').length;
    findings.push(`${path}:${line} — ${signature.name}`);
  }
}

if (findings.length) {
  console.error('Repository safety scan failed. Potential credential material was found:');
  for (const finding of findings) console.error(`- ${finding}`);
  console.error('Remove the value from Git history and rotate the affected credential before continuing.');
  process.exit(1);
}

console.log(`Repository safety scan passed across ${trackedFiles.length} tracked text files.`);
