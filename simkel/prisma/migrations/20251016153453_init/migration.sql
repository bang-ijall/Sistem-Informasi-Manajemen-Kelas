/*
  Warnings:

  - A unique constraint covering the columns `[siswa,tugas]` on the table `status_tugas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "status_tugas_siswa_tugas_key" ON "public"."status_tugas"("siswa", "tugas");
