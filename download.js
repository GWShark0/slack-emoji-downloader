import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';

const streamPipeline = promisify(pipeline);

const OUT_DIR = 'emoji';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

/**
 * Parses and returns data from an emoji JSON document.
 *
 * The emoji JSON document must have the following format:
 *
 * {
      "emoji": {
        "a": "https://...",
        "b": "https://...",
        ...
      }
 * }
 *
 * Results in: [["a", "https://..."], ["b", "https://..."], ...]
 *
 * @param {string} filename
 * @returns {[[string, string]]} Returns an array of tuples that each
 *                               contain the name and the url for an emoji
 */
async function readEmojiList(filename) {
  const data = await fs.readFileSync(filename);
  const json = JSON.parse(data);
  return Object.entries(json.emoji);
}

/**
 * Fetches a file at a url and streams it to a file.
 *
 * @param {string} url
 * @param {string} filename
 */
async function downloadFile(url, filename) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`);
  }

  await streamPipeline(response.body, fs.createWriteStream(filename));
}

const args = process.argv.slice(2);
const filename = args[0];

if (!filename) {
  console.error('Please provide a JSON data file!');
  console.log('$ node download.js emoji.json');
  process.exit(1);
}

ensureDir(OUT_DIR);

const emoji = await readEmojiList(filename);

// runs syncronously to avoid hammering the Slack emoji endpoint
for (const [name, fileUrl] of emoji) {
  const { href, pathname, protocol } = new URL(fileUrl);
  const ext = path.extname(pathname);

  // ignore "alias" pseudo-protocol
  if (protocol.startsWith('https')) {
    console.log('=>', name, '|', href);
    await downloadFile(href, path.join(OUT_DIR, `${name}${ext}`));
  }
}
