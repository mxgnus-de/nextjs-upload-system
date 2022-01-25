import { userSQL } from './db/mysql';

export async function validateUploadKey(key: string): Promise<boolean> {
   const user = await userSQL.getUser(key || '');

   return user[0] !== undefined && user[0]?.key === key;
}
