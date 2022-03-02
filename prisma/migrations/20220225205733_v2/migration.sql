-- AlterTable
ALTER TABLE `files` MODIFY `size` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `permissions` VARCHAR(255) NOT NULL DEFAULT 'admin';
