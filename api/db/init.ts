import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function init() {
   const users = await prisma.user.findMany();
   if (users.length === 0) {
      await prisma.user.create({
         data: {
            key: 'changeme',
            username: 'default',
            permissions: 'admin',
            createdAt: new Date(),
         },
      });
   }

   const settings = await prisma.setting.findMany();
   const maxHasteLength = settings.find(
      (setting) => setting.name === 'maxHasteLength',
   );
   const maxHighlightLength = settings.find(
      (setting) => setting.name === 'maxHighlightLength',
   );
   const publicHaste = settings.find(
      (setting) => setting.name === 'publicHaste',
   );
   const publicShorter = settings.find(
      (setting) => setting.name === 'publicShorter',
   );
   const publicUpload = settings.find(
      (setting) => setting.name === 'publicUpload',
   );
   const notifications = settings.find(
      (setting) => setting.name === 'notifications',
   );

   if (!maxHasteLength) {
      await prisma.setting.create({
         data: {
            name: 'maxHasteLength',
            value: '30000',
            type: 'number',
         },
      });
   }

   if (!maxHighlightLength) {
      await prisma.setting.create({
         data: {
            name: 'maxHighlightLength',
            value: '12500',
            type: 'number',
         },
      });
   }

   if (!publicHaste) {
      await prisma.setting.create({
         data: {
            name: 'publicHaste',
            value: 'false',
         },
      });
   }

   if (!publicShorter) {
      await prisma.setting.create({
         data: {
            name: 'publicShorter',
            value: 'false',
         },
      });
   }

   if (!publicUpload) {
      await prisma.setting.create({
         data: {
            name: 'publicUpload',
            value: 'false',
         },
      });
   }

   if (!notifications) {
      await prisma.setting.create({
         data: {
            name: 'notifications',
            value: 'true',
         },
      });
   }
}
