/*
  Warnings:

  - You are about to drop the column `kelas` on the `tugas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tugas" DROP CONSTRAINT "tugas_kelas_fkey";

-- AlterTable
ALTER TABLE "public"."tugas" DROP COLUMN "kelas";

-- CreateTable
CREATE TABLE "public"."_kelasTotugas" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_kelasTotugas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_kelasTotugas_B_index" ON "public"."_kelasTotugas"("B");

-- AddForeignKey
ALTER TABLE "public"."_kelasTotugas" ADD CONSTRAINT "_kelasTotugas_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."kelas"("kode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_kelasTotugas" ADD CONSTRAINT "_kelasTotugas_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
