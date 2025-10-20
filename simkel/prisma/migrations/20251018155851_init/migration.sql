/*
  Warnings:

  - You are about to drop the column `kelas` on the `materi` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."materi" DROP CONSTRAINT "materi_kelas_fkey";

-- AlterTable
ALTER TABLE "public"."materi" DROP COLUMN "kelas";

-- CreateTable
CREATE TABLE "public"."_kelasTomateri" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_kelasTomateri_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_kelasTomateri_B_index" ON "public"."_kelasTomateri"("B");

-- AddForeignKey
ALTER TABLE "public"."_kelasTomateri" ADD CONSTRAINT "_kelasTomateri_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."kelas"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_kelasTomateri" ADD CONSTRAINT "_kelasTomateri_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."materi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
