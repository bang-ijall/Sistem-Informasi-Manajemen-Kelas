import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            const url = process.env.NEXT_PUBLIC_API_URL;

            const status = await prisma.status_tugas.findMany({
                where: {
                    siswa: auth.message.id
                },
                select: {
                    status: true,
                    nilai: true,
                    task: {
                        select: {
                            id: true,
                            judul: true,
                            deskripsi: true,
                            batas_waktu: true,
                            dokumen_tugas: true,
                            jenis: true,
                            tanggal: true,
                            teacher: {
                                select: {
                                    nama: true,
                                    lesson: {
                                        select: {
                                            nama: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            if (status.length > 0) {
                output.error = false
                output.message = "Berhasil mengambil data"
                output.data = status.map(i => ({
                    id: i.task.id,
                    tanggal: i.task.tanggal,
                    judul: i.task.judul,
                    deskripsi: i.task.deskripsi,
                    batas_waktu: i.task.batas_waktu,
                    dokumen_tugas: i.task.dokumen_tugas,
                    jenis: i.task.jenis,
                    guru: i.task.teacher.nama,
                    pelajaran: i.task.teacher.lesson.nama,
                    status: i.status,
                    nilai: i.nilai
                }))
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        console.log(error.message)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}