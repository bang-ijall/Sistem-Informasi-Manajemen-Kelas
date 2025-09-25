import prisma from "@/libs/prisma";

const hariUrut = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const output = {
  error: true,
  message: "Fetch failed"
};

function parseJam(jam) {
  const [h, m] = jam.split(":").map(Number);
  return h * 60 + m;
}

export async function GET() {
  try {
    let roster = await prisma.roster.findMany();

    if (roster.length > 0) {
      roster.sort((a, b) => {
        const hariA = hariUrut.indexOf(a.hari || "");
        const hariB = hariUrut.indexOf(b.hari || "");

        if (hariA !== hariB) return hariA - hariB;

        const kelasCompare = a.kelas.localeCompare(b.kelas);
        if (kelasCompare !== 0) return kelasCompare;

        return parseJam(a.jam_mulai) - parseJam(b.jam_mulai);
      });

      const counters = {};
      roster = await Promise.all(
        roster.map(async (s) => {
          const kelas = await prisma.kelas.findUnique({
            where: { kode: s.kelas },
          });

          const guru = await prisma.guru.findUnique({
            where: { nip: s.guru },
          });

          const pelajaran = guru?.pelajaran
            ? await prisma.pelajaran.findUnique({
              where: { kode: guru.pelajaran },
            })
            : null;

          if (!counters[s.kelas]) counters[s.kelas] = 1;
          else counters[s.kelas]++;

          return {
            no: counters[s.kelas],
            id: s.id,
            kelas: kelas?.nama || s.kelas,
            guru: guru?.nama || s.guru,
            pelajaran: pelajaran?.nama || null,
            hari: s.hari,
            jam_mulai: s.jam_mulai,
            jam_selesai: s.jam_selesai,
          };
        })
      );

      const group = roster.reduce((acc, item) => {
        if (!acc[item.kelas]) acc[item.kelas] = [];
        acc[item.kelas].push(item);
        return acc;
      }, {});

      output.error = false;
      output.message = "Fetch success";
      output.data = group;
    } else {
      output.message = "Data roster kosong";
    }
  } catch (error) {
    output.message = error.message;
  }

  return Response.json(output);
}

export async function POST(request) {
  try {
    const body = await request.json();

    const roster = await prisma.roster.create({
      data: {
        hari: body.hari,
        jam_mulai: body.jam_mulai,
        jam_selesai: body.jam_selesai,
        kelas: body.kelas,
        guru: body.guru,
      },
    });

    output.error = false;
    output.message = "Insert success";
    output.data = roster;
  } catch (error) {
    output.message = error.message;
  }

  return Response.json(output);
}