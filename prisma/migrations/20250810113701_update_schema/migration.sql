/*
  Warnings:

  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_account_name` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_account_number` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_name` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `payment_method` ENUM('COD', 'BANK_TRANSFER') NOT NULL DEFAULT 'BANK_TRANSFER',
    ADD COLUMN `payment_proof` VARCHAR(191) NULL,
    ADD COLUMN `payment_status` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `store` ADD COLUMN `bank_account_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `bank_account_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `bank_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`;
