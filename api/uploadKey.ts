import prisma from '../prisma/client';

export async function validateUploadKey(key: string): Promise<boolean> {
   if (!key) return false;
   const user = await prisma.user.findUnique({
      where: {
         key,
      },
   });

   if (!user) return false;

   return user && user.key === key;
}
