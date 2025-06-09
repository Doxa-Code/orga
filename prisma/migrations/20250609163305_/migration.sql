-- CreateTable
CREATE TABLE "buckets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "buckets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "buckets" ADD CONSTRAINT "buckets_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
