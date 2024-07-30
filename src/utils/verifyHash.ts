import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

export const verifyHash = async (
    hashedValue: string,
    candidateValue: string,
) => {
    const scryptAsync = promisify(scrypt);

    const [hashedPassword, salt] = hashedValue.split('.');
    const buf = await scryptAsync(Buffer.from(candidateValue), salt, 64) as Buffer;
   
    return timingSafeEqual(Buffer.from(hashedPassword), buf);
};
