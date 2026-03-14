import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const localContentPath = path.join(rootDir, 'src', 'members-content.local.json');
const blobPath = path.join(rootDir, 'src', 'members-content.blob.json');
const password = process.env.MEMBERS_PASSWORD;
const iterations = 210000;

if (!password) {
	console.error('MEMBERS_PASSWORD を指定してください。');
	console.error('例: MEMBERS_PASSWORD=your-password npm run members:encrypt');
	process.exit(1);
}

const sourceText = await fs.readFile(localContentPath, 'utf8');
const payload = JSON.parse(sourceText);
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();

const blob = {
	salt: salt.toString('base64'),
	iv: iv.toString('base64'),
	ciphertext: ciphertext.toString('base64'),
	tag: tag.toString('base64'),
	iterations,
};

await fs.writeFile(blobPath, `${JSON.stringify(blob, null, 2)}\n`, 'utf8');
console.log('src/members-content.blob.json を更新しました。');
