-- CreateTable
CREATE TABLE "Products" (
    "name" TEXT NOT NULL,
    "originalPrice" DOUBLE PRECISION NOT NULL,
    "offerPrice" DOUBLE PRECISION NOT NULL,
    "isNewProduct" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("type","id")
);
