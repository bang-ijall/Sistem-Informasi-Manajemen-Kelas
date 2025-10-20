/*
  Warnings:

  - A unique constraint covering the columns `[guru,hari,jam_mulai,jam_selesai]` on the table `roster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roster_guru_hari_jam_mulai_jam_selesai_key" ON "public"."roster"("guru", "hari", "jam_mulai", "jam_selesai");
