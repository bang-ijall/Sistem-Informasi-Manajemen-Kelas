import prisma from "@/libs/prisma"

const output = {
    error: true,
    message: "Fetch failed"
}

export async function GET() {
    try {
        var siswa = await prisma.siswa.findMany()

        if (siswa && siswa.length > 0) {
            const siswa_kelas = await Promise.all(
                siswa.map(async (s, idx) => {
                    const kelas = await prisma.kelas.findUnique({
                        where: { kode: s.kelas },
                    });

                    const { ...rest } = s;
                    return {
                        no: idx + 1,
                        ...rest,
                        kelas: kelas.nama,
                    };
                })
            );

            output.error = false
            output.message = "Fetch success"
            output.data = siswa_kelas
        } else {
            output.message = "Data siswa kosong"
        }
    } catch (error) {
        output.message = error.message
    }

    return Response.json(output)
}

export async function POST(request) {
    try {
        const body = await request.json();

        const siswa = await prisma.siswa.create({
            data: body
        });

        output.error = false
        output.message = "Fetch success"
        output.data = siswa
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}