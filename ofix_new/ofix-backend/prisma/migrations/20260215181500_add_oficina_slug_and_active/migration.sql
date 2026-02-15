-- AlterTable
ALTER TABLE "Oficina" ADD COLUMN "slug" TEXT;
ALTER TABLE "Oficina" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Oficina_slug_key" ON "Oficina"("slug");

