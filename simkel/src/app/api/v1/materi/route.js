import prisma from "@/libs/prisma"
import { CheckAuth } from "../auth/auth.js"
import { select } from "@nextui-org/react"

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role != "guru") {
                const kelas = await prisma.kelas.findUnique({
                    where: {
                        kode: auth.message.kelas
                    },
                    select: {
                        materi: {
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

                output.data = kelas.materi.map(i => ({
                    id: i.id,
                    tanggal: i.tanggal,
                    judul: i.judul,
                    deskripsi: i.deskripsi,
                    berkas: i.modul,
                    guru: i.teacher.nama,
                    pelajaran: i.teacher.lesson.nama
                }))
            } else {
                const materi = await prisma.materi.findMany({
                    where: {
                        guru: auth.message.id
                    },
                    select: {
                        id: true,
                        judul: true,
                        deskripsi: true,
                        modul: true,
                        tanggal: true,
                        class: {
                            select: {
                                nama: true
                            }
                        }
                    }
                })

                output.data = materi.map(i => ({
                    id: i.id,
                    tanggal: i.tanggal,
                    judul: i.judul,
                    deskripsi: i.deskripsi,
                    berkas: i.modul,
                    kelas: i.class.nama
                }))
            }

            output.error = false
            output.message = "Berhasil mengambil data"

        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}