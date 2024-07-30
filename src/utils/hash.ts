import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

export const hash = async (valueToHash: string) => {
  const scryptAsync = promisify(scrypt);

  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(Buffer.from(valueToHash), salt, 64)) as Buffer;
 
  return `${buf.toString('hex')}.${salt}`;
};
