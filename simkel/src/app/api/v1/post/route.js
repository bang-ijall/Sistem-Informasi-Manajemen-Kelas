import prisma from "@/libs/prisma"
import { CheckAuth } from "../auth/auth.js"
import { utcToZonedTime } from "date-fns-tz"
import { startOfDay, endOfDay } from "date-fns"

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            const timeZone = "Asia/Jakarta"
            const start = new Date(formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd'T'00:00:00XXX"))
            const end = new Date(formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd'T'23:59:59.999XXX"))

            const kelas = await prisma.kelas.findUnique({
                where: {
                    kode: auth.message.kelas
                },
                select: {
                    tugas: {
                        where: {
                            tanggal: {
                                gte: start,
                                lte: end
                            }
                        },
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
                    },
                    materi: {
                        where: {
                            tanggal: {
                                gte: start,
                                lte: end
                            }
                        },
                        select: {
                            id: true,
                            judul: true,
                            deskripsi: true,
                            modul: true,
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

            if (kelas) {
                if (kelas.tugas.length > 0 || kelas.materi.length > 0) {
                    output.error = false
                    output.message = "Berhasil mengambil data"
                    output.data = [
                        ...kelas.tugas.map(i => ({
                            id: i.id,
                            tanggal: i.tanggal,
                            judul: i.judul,
                            deskripsi: i.deskripsi,
                            batas_waktu: i.batas_waktu,
                            berkas: i.dokumen_tugas,
                            jenis: i.jenis,
                            guru: i.teacher.nama,
                            pelajaran: i.teacher.lesson.nama
                        })),
                        ...kelas.materi.map(i => ({
                            id: i.id,
                            tanggal: i.tanggal,
                            judul: i.judul,
                            deskripsi: i.deskripsi,
                            batas_waktu: null,
                            berkas: i.modul,
                            jenis: "materi",
                            guru: i.teacher.nama,
                            pelajaran: i.teacher.lesson.nama
                        }))
                    ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
                } else {
                    output.message = "Tidak menemukan postingan Anda hari ini"
                }
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        console.error(error)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}