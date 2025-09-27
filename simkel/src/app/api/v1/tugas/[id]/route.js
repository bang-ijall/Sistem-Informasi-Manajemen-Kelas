import prisma from "@/libs/prisma"
import { CheckAuth } from "../../../utils.js"

export async function GET(request, { params }) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)
        const { id } = await params

        if (!auth.error) {
            const url = process.env.NEXT_PUBLIC_API_URL;

            const tugas = await prisma.tugas.findUnique({
                where: {
                    id: Number(id),
                    jenis: "kuis"
                },
                select: {
                    judul: true,
                    soal_kuis: true,
                    status_tugas: {
                        where: {
                            siswa: auth.message.id,
                            status: "belum"
                        },
                        select: {
                            siswa: true
                        }
                    }
                }
            })

            if (tugas && tugas.status_tugas.length == 1) {
                output.error = false
                output.message = "Berhasil mengambil data"
                output.data = {
                    judul: tugas.judul,
                    soal_kuis: tugas.soal_kuis.map(i => ({
                        no: i.no,
                        soal: i.soal,
                        option: i.option
                    }))
                }
            } else {
                output.message = "Tidak menemukan tugas anda"
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}