-- CreateTable
CREATE TABLE "Screenshots" (
    "filename" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Screenshots_pkey" PRIMARY KEY ("filename")
);

-- AddForeignKey
ALTER TABLE "Screenshots" ADD CONSTRAINT "Screenshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
