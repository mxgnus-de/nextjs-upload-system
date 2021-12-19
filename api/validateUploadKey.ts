import { keys } from 'config/upload';

export default function validateUploadKey(key: string): boolean {
   return keys.includes(key);
}
