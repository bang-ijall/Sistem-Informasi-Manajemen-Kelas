import prisma from "@/libs/prisma"
import { select } from "@nextui-org/react";

const output = {
    error: true,
    message: "Fetch failed"
}

export async function GET() {
    try {
        const guru = await prisma.guru.findMany({
            select: {
                id: true,
                nip: true,
                nama: true,
                hp: true,
                class: {
                    select: {
                        nama: true
                    }
                },
                lesson: {
                    select: {
                        nama: true
                    }
                }
            }
        })

        if (guru.length > 0) {
            // guru = await Promise.all(
            //     guru.map(async (s, idx) => {
            //         if (s.kelas != null) {
            //             const kelas = await prisma.kelas.findUnique({
            //                 where: { kode: s.kelas },
            //             });

            //             const pelajaran = await prisma.pelajaran.findUnique({
            //                 where: { kode: s.pelajaran }
            //             })

            //             const { ...rest } = s;
            //             return {
            //                 no: idx + 1,
            //                 ...rest,
            //                 kelas: kelas.nama,
            //                 pelajaran: pelajaran.nama
            //             };
            //         }
            //     })
            // );

            output.error = false
            output.message = "Fetch success"
            output.data = guru.map(i => ({
                id: i.id,
                nip: i.nip,
                nama: i.nama,
                hp: i.hp,
                kelas: i.class ? i.class.nama : null,
                pelajaran: i.lesson.nama
            }))
        } else {
            output.message = "Data guru kosong"
        }
    } catch (error) {
        output.message = error.message
    }

    return Response.json(output)
}

export async function POST(request) {
    try {
        const body = await request.json()

        const guru = await prisma.guru.create({
            data: body
        })

        output.error = false
        output.message = "Fetch success"
        output.data = guru
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}