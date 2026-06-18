/*
  Warnings:

  - You are about to drop the column `description` on the `teams` table. All the data in the column will be lost.
  - Added the required column `block` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teams" DROP COLUMN "description",
ADD COLUMN     "block" TEXT NOT NULL,
ADD COLUMN     "captainName" TEXT,
ADD COLUMN     "captainUrl" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "viceCaptainName" TEXT,
ADD COLUMN     "viceCaptainUrl" TEXT;
