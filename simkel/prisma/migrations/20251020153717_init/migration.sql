/*
  Warnings:

  - You are about to drop the `_kelasTomateri` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_kelasTotugas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `kelas` to the `materi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelas` to the `tugas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_kelasTomateri" DROP CONSTRAINT "_kelasTomateri_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_kelasTomateri" DROP CONSTRAINT "_kelasTomateri_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_kelasTotugas" DROP CONSTRAINT "_kelasTotugas_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_kelasTotugas" DROP CONSTRAINT "_kelasTotugas_B_fkey";

-- AlterTable
ALTER TABLE "public"."materi" ADD COLUMN     "kelas" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."tugas" ADD COLUMN     "kelas" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."_kelasTomateri";

-- DropTable
DROP TABLE "public"."_kelasTotugas";

-- AddForeignKey
ALTER TABLE "public"."tugas" ADD CONSTRAINT "tugas_kelas_fkey" FOREIGN KEY ("kelas") REFERENCES "public"."kelas"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."materi" ADD CONSTRAINT "materi_kelas_fkey" FOREIGN KEY ("kelas") REFERENCES "public"."kelas"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;
