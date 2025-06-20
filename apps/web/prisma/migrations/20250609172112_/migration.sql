/*
  Warnings:

  - The values [CALL,EMAIL,MEETING,MESSAGE,OTHER] on the enum `FollowUpType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FollowUpType_new" AS ENUM ('call', 'email', 'meeting', 'message', 'other');
ALTER TABLE "follow_ups" ALTER COLUMN "type" TYPE "FollowUpType_new" USING ("type"::text::"FollowUpType_new");
ALTER TYPE "FollowUpType" RENAME TO "FollowUpType_old";
ALTER TYPE "FollowUpType_new" RENAME TO "FollowUpType";
DROP TYPE "FollowUpType_old";
COMMIT;
