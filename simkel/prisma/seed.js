const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const { faker } = await import('@faker-js/faker')  // ⬅ ini bedanya

  // --- Pelajaran ---
  const lessons = await prisma.pelajaran.createMany({
    data: [
      { kode: 'MAT', nama: 'Matematika', kategori: 'Umum' },
      { kode: 'BIO', nama: 'Biologi', kategori: 'IPA' },
      { kode: 'IND', nama: 'Bahasa Indonesia', kategori: 'Umum' },
      { kode: 'ENG', nama: 'Bahasa Inggris', kategori: 'Umum' },
      { kode: 'FIS', nama: 'Fisika', kategori: 'IPA' },
    ],
    skipDuplicates: true,
  })

  // --- Kelas ---
  const kelas = await prisma.kelas.createMany({
    data: [
      { kode: 'X1', nama: 'Kelas X IPA 1' },
      { kode: 'X2', nama: 'Kelas X IPA 2' },
      { kode: 'XI1', nama: 'Kelas XI IPA 1' },
    ],
    skipDuplicates: true,
  })

  await prisma.user.createMany({
    data: [
      { id: '2001', password: '123456', old_password: '123456', role: 'guru' },
      { id: '2002', password: '123456', old_password: '123456', role: 'guru' },
    ],
  })

  // --- Guru ---
  const guru1 = await prisma.guru.create({
    data: {
      nip: '2001',
      nama: 'Pak Ahmad',
      hp: faker.phone.number(),
      kelas: 'X1',
      pelajaran: 'MAT'
    },
  })

  const guru2 = await prisma.guru.create({
    data: {
      nip: '2002',
      nama: 'Bu Sari',
      hp: faker.phone.number(),
      pelajaran: 'BIO'
    },
  })

  // --- Siswa ---
  for (let i = 1; i <= 20; i++) {
    const idUser = `siswa${i}`
    const nisn = `100${i}`

    // Buat user siswa dulu
    await prisma.user.create({
      data: {
        id: nisn,
        password: '123456',
        old_password: '123456',
        role: 'siswa',
        foto: faker.image.avatar()
      },
    })

    // Baru buat siswa
    await prisma.siswa.create({
      data: {
        nisn,
        nama: faker.person.fullName(),
        hp: faker.phone.number(),
        tahun_masuk: '2023',
        kelas: i <= 10 ? 'X1' : 'X2',
        nama_wali: faker.person.fullName(),
        hp_wali: faker.phone.number()
      },
    })
  }

    // --- Roster ---
    const rosters = []
    const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
    for (let i = 0; i < 5; i++) {
      rosters.push(
        await prisma.roster.create({
          data: {
            hari: hariList[i],
            jam_mulai: '07:00',
            jam_selesai: '08:30',
            kelas: i % 2 === 0 ? 'X1' : 'X2',
            guru: i % 2 === 0 ? '2001' : '2002',
          },
        })
      )
    }

    // --- Kehadiran ---
    const allSiswa = await prisma.siswa.findMany()
    for (const r of rosters) {
      for (const s of allSiswa) {
        await prisma.kehadiran.create({
          data: {
            tanggal: faker.date.between({ from: '2025-01-01', to: '2025-01-31' }),
            status: faker.helpers.arrayElement(['hadir', 'no_hadir', 'izin']),
            siswa: s.nisn,
            roster: r.id,
          },
        })
      }
    }

    // --- Tugas ---
    for (let i = 1; i <= 5; i++) {
      const tugas = await prisma.tugas.create({
        data: {
          judul: `Tugas ${i}`,
          deskripsi: faker.lorem.sentence(),
          batas_waktu: faker.date.future(),
          jenis: faker.helpers.arrayElement(['submission', 'kuis']),
          tanggal: new Date(),
          kelas: i % 2 === 0 ? 'X1' : 'X2',
          guru: i % 2 === 0 ? '2001' : '2002',
        },
      })

      // --- Status tugas untuk semua siswa
      for (const s of allSiswa) {
        await prisma.status_tugas.create({
          data: {
            siswa: s.nisn,
            tugas: tugas.id,
            status: faker.helpers.arrayElement(['belum', 'sudah', 'dinilai']),
            nilai: faker.number.int({ min: 60, max: 100 }),
          },
        })
      }
    }

    // --- Materi ---
    for (let i = 1; i <= 5; i++) {
      await prisma.materi.create({
        data: {
          judul: `Materi ${i}`,
          deskripsi: faker.lorem.sentence(),
          modul: [faker.system.fileName()],
          tanggal: faker.date.recent(),
          kelas: i % 2 === 0 ? 'X1' : 'X2',
          guru: i % 2 === 0 ? '2001' : '2002',
        },
      })
    }

    console.log('✅ Dummy data berhasil diinsert!')
  }

  main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
