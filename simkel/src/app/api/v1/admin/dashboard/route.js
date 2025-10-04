import prisma from "@/libs/prisma"
import { CheckAuth } from "@/app/api/utils"
import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!",
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role === "admin") {
            const siswa = await prisma.siswa.count()
            const guru = await prisma.guru.count()
            const kelas = await prisma.kelas.count()
            const pelajaran = await prisma.pelajaran.count()

            const tugas = await prisma.tugas.findMany({
                take: 5,
                orderBy: {
                    tanggal: "desc"
                },
                select: {
                    id: true,
                    judul: true,
                    tanggal: true,
                    class: {
                        select: {
                            nama: true
                        }
                    },
                    teacher: {
                        select: {
                            nama: true
                        }
                    },
                },
            })

            const materi = await prisma.materi.findMany({
                take: 5,
                orderBy: {
                    tanggal: "desc"
                },
                select: {
                    id: true,
                    judul: true,
                    tanggal: true,
                    class: {
                        select: {
                            nama: true
                        }
                    },
                    teacher: {
                        select: {
                            nama: true
                        }
                    },
                },
            })

            const now = new Date()

            const start_week = startOfWeek(now, {
                weekStartsOn: 1
            })

            const end_week = endOfWeek(now, {
                weekStartsOn: 1
            })

            const days = eachDayOfInterval({
                start: start_week,
                end: end_week
            })

            const weekly = []

            for (const day of days) {
                const name = day.toLocaleDateString("id-ID", {
                    weekday: "short"
                })

                const start = new Date(day)
                start.setHours(0, 0, 0, 0)
                const end = new Date(day)
                end.setHours(23, 59, 59, 999)

                const tugas = await prisma.tugas.count({
                    where: {
                        tanggal: {
                            gte: start,
                            lte: end
                        }
                    }
                })

                const kehadiran = await prisma.kehadiran.count({
                    where: {
                        status: "hadir",
                        tanggal: {
                            gte: start,
                            lte: end
                        }
                    }
                })

                weekly.push({
                    nama: name,
                    tugas: tugas,
                    kehadiran: kehadiran,
                })
            }

            const start = new Date()
            start.setHours(0, 0, 0, 0)
            const end = new Date()
            end.setHours(23, 59, 59, 999)

            const kehadiran = await prisma.kehadiran.count({
                where: {
                    status: "hadir",
                    tanggal: {
                        gte: start,
                        lte: end
                    }
                }
            })

            output.error = false
            output.message = "Berhasil mengambil data"

            output.data = {
                siswa: siswa,
                guru: guru,
                kelas: kelas,
                pelajaran: pelajaran,
                tugas: await prisma.tugas.count(),
                materi: await prisma.materi.count(),
                kehadiran: kehadiran,
                aktivitas_mingguan: weekly,
                tugas_baru: tugas.map(i => ({
                    id: i.id,
                    judul: i.judul,
                    guru: i.teacher.nama,
                    kelas: i.class.nama
                })),
                materi_baru: materi.map(i => ({
                    id: i.id,
                    judul: i.judul,
                    guru: i.teacher.nama,
                    kelas: i.class.nama
                }))
            }
        } else {
            output.message = auth.message
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}