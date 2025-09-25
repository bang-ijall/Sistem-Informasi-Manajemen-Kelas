-- CreateEnum
CREATE TYPE "role" AS ENUM ('siswa', 'guru', 'wali_siswa');

-- CreateEnum
CREATE TYPE "hadir" AS ENUM ('no_hadir', 'hadir', 'izin');

-- CreateEnum
CREATE TYPE "task" AS ENUM ('kuis', 'submission');

-- CreateEnum
CREATE TYPE "task_status" AS ENUM ('belum', 'sudah', 'dinilai');

-- CreateTable
CREATE TABLE "roster" (
    "id" SERIAL NOT NULL,
    "hari" TEXT NOT NULL,
    "jam_mulai" TEXT NOT NULL,
    "jam_selesai" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "guru" TEXT NOT NULL,

    CONSTRAINT "roster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" SERIAL NOT NULL,
    "nisn" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "hp" TEXT NOT NULL,
    "tahun_masuk" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "nama_wali" TEXT NOT NULL,
    "hp_wali" TEXT NOT NULL,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guru" (
    "id" SERIAL NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "hp" TEXT NOT NULL,
    "kelas" TEXT,
    "pelajaran" TEXT NOT NULL,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pelajaran" (
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,

    CONSTRAINT "pelajaran_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "kelas" (
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "old_password" TEXT NOT NULL,
    "foto" TEXT,
    "role" "role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kehadiran" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" "hadir" NOT NULL,
    "siswa" TEXT NOT NULL,
    "roster" INTEGER NOT NULL,

    CONSTRAINT "kehadiran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tugas" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "batas_waktu" TIMESTAMP(3) NOT NULL,
    "jenis" "task" NOT NULL,
    "waktu_kuis" INTEGER,
    "soal_kuis" JSONB,
    "dokumen_tugas" TEXT[],
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kelas" TEXT NOT NULL,
    "guru" TEXT NOT NULL,

    CONSTRAINT "tugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_tugas" (
    "id" SERIAL NOT NULL,
    "siswa" TEXT NOT NULL,
    "tugas" INTEGER NOT NULL,
    "status" "task_status" NOT NULL,
    "berkas" TEXT[],
    "tanggal" TIMESTAMP(3),
    "nilai" INTEGER,

    CONSTRAINT "status_tugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materi" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "modul" TEXT[],
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kelas" TEXT NOT NULL,
    "guru" TEXT NOT NULL,

    CONSTRAINT "materi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nisn_key" ON "siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_hp_key" ON "siswa"("hp");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_hp_wali_key" ON "siswa"("hp_wali");

-- CreateIndex
CREATE UNIQUE INDEX "guru_nip_key" ON "guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "guru_hp_key" ON "guru"("hp");

-- CreateIndex
CREATE UNIQUE INDEX "guru_kelas_key" ON "guru"("kelas");

-- CreateIndex
CREATE UNIQUE INDEX "kelas_nama_key" ON "kelas"("nama");

-- AddForeignKey
ALTER TABLE "roster" ADD CONSTRAINT "roster_kelas_fkey" FOREIGN KEY ("kelas") REFERENCES "kelas"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster" ADD CONSTRAINT "roster_guru_fkey" FOREIGN KEY ("guru") REFERENCES "guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_kelas_fkey" FOREIGN KEY ("kelas") REFERENCES "kelas"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_nisn_fkey" FOREIGN KEY ("nisn") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_kelas_fkey" FOREIGN KEY ("kelas") REFERENCES "kelas"("kode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_pelajaran_fkey" FOREIGN KEY ("pelajaran") REFERENCES "pelajaran"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_nip_fkey" FOREIGN KEY ("nip") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kehadiran" ADD CONSTRAINT "kehadiran_siswa_fkey" FOREIGN KEY ("siswa") REFERENCES "siswa"("nisn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kehadiran" ADD CONSTRAINT "kehadiran_roster_fkey" FOREIGN KEY ("roster") REFERENCES "roster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tugas" ADD CONSTRAINT "tugas_kelas_fkey" FOREIGN KEY ("kelas") REFERENCES "kelas"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tugas" ADD CONSTRAINT "tugas_guru_fkey" FOREIGN KEY ("guru") REFERENCES "guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_tugas" ADD CONSTRAINT "status_tugas_siswa_fkey" FOREIGN KEY ("siswa") REFERENCES "siswa"("nisn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_tugas" ADD CONSTRAINT "status_tugas_tugas_fkey" FOREIGN KEY ("tugas") REFERENCES "tugas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materi" ADD CONSTRAINT "materi_kelas_fkey" FOREIGN KEY ("kelas") REFERENCES "kelas"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materi" ADD CONSTRAINT "materi_guru_fkey" FOREIGN KEY ("guru") REFERENCES "guru"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;
