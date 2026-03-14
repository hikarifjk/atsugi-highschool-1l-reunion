import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { MEMBERS_CONTENT_BLOB } from '../src/config.ts';

const rootDir = process.cwd();
const localContentPath = path.join(rootDir, 'src', 'members-content.local.json');
const password = process.env.MEMBERS_PASSWORD;

if (!password) {
	console.error('MEMBERS_PASSWORD を指定してください。');
	console.error('例: MEMBERS_PASSWORD=tomuro npm run members:decrypt');
	process.exit(1);
}

const salt = Buffer.from(MEMBERS_CONTENT_BLOB.salt, 'base64');
const iv = Buffer.from(MEMBERS_CONTENT_BLOB.iv, 'base64');
const ciphertext = Buffer.from(MEMBERS_CONTENT_BLOB.ciphertext, 'base64');
const tag = Buffer.from(MEMBERS_CONTENT_BLOB.tag, 'base64');
const key = crypto.pbkdf2Sync(password, salt, MEMBERS_CONTENT_BLOB.iterations, 32, 'sha256');
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

decipher.setAuthTag(tag);

const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
const payload = JSON.parse(plaintext);

await fs.writeFile(localContentPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log('src/members-content.local.json を出力しました。');
