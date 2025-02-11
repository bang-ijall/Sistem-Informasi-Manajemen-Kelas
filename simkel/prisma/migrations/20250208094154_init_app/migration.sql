-- CreateTable
CREATE TABLE `siswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nisn` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `hp` VARCHAR(191) NOT NULL,
    `tahun_masuk` VARCHAR(191) NOT NULL,
    `kelas` INTEGER NOT NULL,
    `nama_wali` VARCHAR(191) NOT NULL,
    `tanggal_lahir` DATETIME(3) NOT NULL,
    `hp_wali` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `siswa_nisn_key`(`nisn`),
    UNIQUE INDEX `siswa_hp_key`(`hp`),
    UNIQUE INDEX `siswa_hp_wali_key`(`hp_wali`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guru` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `hp` VARCHAR(191) NOT NULL,
    `kelas` INTEGER NULL,
    `tanggal_lahir` DATETIME(3) NOT NULL,

    UNIQUE INDEX `guru_nip_key`(`nip`),
    UNIQUE INDEX `guru_hp_key`(`hp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `kelas_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `siswa` ADD CONSTRAINT `siswa_kelas_fkey` FOREIGN KEY (`kelas`) REFERENCES `kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guru` ADD CONSTRAINT `guru_kelas_fkey` FOREIGN KEY (`kelas`) REFERENCES `kelas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
