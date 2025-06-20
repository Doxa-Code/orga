-- DropForeignKey
ALTER TABLE "follow_ups" DROP CONSTRAINT "follow_ups_proposalId_fkey";

-- AddForeignKey
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
