-- CreateTable
CREATE TABLE `files` (
    `name` VARCHAR(50) NOT NULL,
    `mimetype` VARCHAR(50) NOT NULL,
    `path` TEXT NOT NULL,
    `originalfilename` TEXT NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `haste` (
    `id` VARCHAR(255) NOT NULL,
    `haste` TEXT NOT NULL,
    `language` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `name` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `info` VARCHAR(10) NULL,
    `type` VARCHAR(255) NOT NULL DEFAULT 'boolean',
    `Spalte 5` INTEGER NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shorter` (
    `name` VARCHAR(50) NOT NULL,
    `url` TEXT NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `key` VARCHAR(500) NOT NULL,
    `username` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
