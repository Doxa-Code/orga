/*
  Warnings:

  - Added the required column `position` to the `buckets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "buckets" ADD COLUMN     "position" INTEGER NOT NULL;
