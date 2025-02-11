const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const kelas_data = [
    { nama: "MIPA-1" },
    { nama: "MIPA-2" },
    { nama: "MIPA-3" },
    { nama: "IPS" }
  ];

  for (const data of kelas_data) {
    await prisma.kelas.upsert({
      where: { nama: data.nama },
      update: {},
      create: data,
    });
  }

  console.log("✅ Default kelas data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });