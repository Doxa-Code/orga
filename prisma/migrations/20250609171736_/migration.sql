/*
  Warnings:

  - The values [ORGANIC,REFERRAL,ADS,OUTBOUND,OTHER] on the enum `Source` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Source_new" AS ENUM ('organic', 'referral', 'ads', 'outbound', 'other');
ALTER TABLE "proposals" ALTER COLUMN "source" TYPE "Source_new" USING ("source"::text::"Source_new");
ALTER TYPE "Source" RENAME TO "Source_old";
ALTER TYPE "Source_new" RENAME TO "Source";
DROP TYPE "Source_old";
COMMIT;
