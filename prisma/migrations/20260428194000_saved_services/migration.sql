-- CreateTable
CREATE TABLE `saved_services` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `serviceSlug` VARCHAR(50) NOT NULL,
  `serviceName` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `saved_services_userId_idx`(`userId`),
  UNIQUE INDEX `saved_services_userId_serviceSlug_key`(`userId`, `serviceSlug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `saved_services`
ADD CONSTRAINT `saved_services_userId_fkey`
FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
