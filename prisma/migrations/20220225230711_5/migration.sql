/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `createdAt` on the `File` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - The primary key for the `Haste` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `createdAt` on the `Haste` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - The primary key for the `Shorter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `createdAt` on the `Shorter` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `Haste` DROP FOREIGN KEY `Haste_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `Shorter` DROP FOREIGN KEY `Shorter_ownerId_fkey`;

-- AlterTable
ALTER TABLE `File` DROP PRIMARY KEY,
    MODIFY `ownerId` VARCHAR(50) NULL,
    MODIFY `createdAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Haste` DROP PRIMARY KEY,
    MODIFY `ownerId` VARCHAR(50) NULL,
    MODIFY `createdAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Shorter` DROP PRIMARY KEY,
    MODIFY `createdAt` TIMESTAMP NOT NULL,
    MODIFY `ownerId` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `createdAt` TIMESTAMP NOT NULL;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Haste` ADD CONSTRAINT `Haste_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shorter` ADD CONSTRAINT `Shorter_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
