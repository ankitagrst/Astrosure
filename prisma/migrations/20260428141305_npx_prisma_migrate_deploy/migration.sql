-- DropIndex
DROP INDEX `birth_profiles_userId_fkey` ON `birth_profiles`;

-- DropIndex
DROP INDEX `consultations_astrologerId_fkey` ON `consultations`;

-- DropIndex
DROP INDEX `consultations_userId_fkey` ON `consultations`;

-- DropIndex
DROP INDEX `donations_userId_fkey` ON `donations`;

-- DropIndex
DROP INDEX `kundali_charts_birthProfileId_fkey` ON `kundali_charts`;

-- DropIndex
DROP INDEX `kundali_charts_userId_fkey` ON `kundali_charts`;

-- DropIndex
DROP INDEX `order_items_orderId_fkey` ON `order_items`;

-- DropIndex
DROP INDEX `order_items_productId_fkey` ON `order_items`;

-- DropIndex
DROP INDEX `orders_userId_fkey` ON `orders`;

-- DropIndex
DROP INDEX `puja_bookings_pujaId_fkey` ON `puja_bookings`;

-- DropIndex
DROP INDEX `puja_bookings_userId_fkey` ON `puja_bookings`;

-- DropIndex
DROP INDEX `pujas_categoryId_fkey` ON `pujas`;

-- AddForeignKey
ALTER TABLE `saved_services` ADD CONSTRAINT `saved_services_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `birth_profiles` ADD CONSTRAINT `birth_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kundali_charts` ADD CONSTRAINT `kundali_charts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kundali_charts` ADD CONSTRAINT `kundali_charts_birthProfileId_fkey` FOREIGN KEY (`birthProfileId`) REFERENCES `birth_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultations` ADD CONSTRAINT `consultations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultations` ADD CONSTRAINT `consultations_astrologerId_fkey` FOREIGN KEY (`astrologerId`) REFERENCES `astrologers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pujas` ADD CONSTRAINT `pujas_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `puja_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `puja_bookings` ADD CONSTRAINT `puja_bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `puja_bookings` ADD CONSTRAINT `puja_bookings_pujaId_fkey` FOREIGN KEY (`pujaId`) REFERENCES `pujas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
