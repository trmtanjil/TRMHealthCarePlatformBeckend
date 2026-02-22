-- CreateTable
CREATE TABLE "spacialities" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "title" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "spacialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_speciality_isDeleted" ON "spacialities"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_speciality_title" ON "spacialities"("title");
