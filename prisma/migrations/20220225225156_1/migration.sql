/*
  Warnings:

  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `haste` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shorter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `files`;

-- DropTable
DROP TABLE `haste`;

-- DropTable
DROP TABLE `settings`;

-- DropTable
DROP TABLE `shorter`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `User` (
    `key` VARCHAR(500) NOT NULL,
    `id` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `permissions` VARCHAR(255) NOT NULL DEFAULT 'admin',
    `createdAt` TIMESTAMP NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `name` VARCHAR(50) NOT NULL,
    `mimetype` VARCHAR(50) NOT NULL,
    `path` TEXT NOT NULL,
    `originalfilename` TEXT NOT NULL,
    `size` INTEGER NOT NULL DEFAULT 0,
    `ownerId` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `File_name_key`(`name`),
    PRIMARY KEY (`ownerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Haste` (
    `id` VARCHAR(255) NOT NULL,
    `haste` TEXT NOT NULL,
    `language` VARCHAR(255) NULL,
    `ownerId` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Haste_id_key`(`id`),
    PRIMARY KEY (`ownerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shorter` (
    `name` VARCHAR(50) NOT NULL,
    `url` TEXT NOT NULL,
    `createdAt` TIMESTAMP NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `ownerId` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `Shorter_name_key`(`name`),
    PRIMARY KEY (`ownerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `name` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `info` VARCHAR(10) NULL,
    `type` VARCHAR(255) NOT NULL DEFAULT 'boolean',

    UNIQUE INDEX `Setting_name_key`(`name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
