/*
  Warnings:

  - Added the required column `maxPoints` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_editionId_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "maxPoints" INTEGER NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "venue" DROP NOT NULL,
ALTER COLUMN "visibility" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "editions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
