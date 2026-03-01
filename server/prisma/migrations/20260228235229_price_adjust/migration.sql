/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `pricePerDay` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "totalPrice",
ADD COLUMN     "pricePerDay" INTEGER NOT NULL;
