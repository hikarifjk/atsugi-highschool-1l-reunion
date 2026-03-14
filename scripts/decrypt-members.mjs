import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const localContentPath = path.join(rootDir, 'src', 'members-content.local.json');
const blobPath = path.join(rootDir, 'src', 'members-content.blob.json');
const password = process.env.MEMBERS_PASSWORD;

if (!password) {
	console.error('MEMBERS_PASSWORD を指定してください。');
	console.error('例: MEMBERS_PASSWORD=your-password npm run members:decrypt');
	process.exit(1);
}

const blobText = await fs.readFile(blobPath, 'utf8');
const membersContentBlob = JSON.parse(blobText);

const salt = Buffer.from(membersContentBlob.salt, 'base64');
const iv = Buffer.from(membersContentBlob.iv, 'base64');
const ciphertext = Buffer.from(membersContentBlob.ciphertext, 'base64');
const tag = Buffer.from(membersContentBlob.tag, 'base64');
const key = crypto.pbkdf2Sync(password, salt, membersContentBlob.iterations, 32, 'sha256');
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

decipher.setAuthTag(tag);

const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
const payload = JSON.parse(plaintext);

await fs.writeFile(localContentPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log('src/members-content.local.json を出力しました。');
