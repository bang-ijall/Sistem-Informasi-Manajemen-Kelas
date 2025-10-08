import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"

const output = {
    error: true,
    message: "Server kami menolak permintaan dari anda!"
}

export async function GET(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            // if (auth.message.role != "guru") {
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

            output.error = false
            output.message = "Berhasil mengambil data"
            output.data = kelas.materi.map(i => ({
                id: i.id,
                tanggal: i.tanggal,
                judul: i.judul,
                deskripsi: i.deskripsi,
                berkas: i.modul,
                guru: i.teacher.nama,
                pelajaran: i.teacher.lesson.nama
            }))
            // } else {
            //     const materi = await prisma.materi.findMany({
            //         where: {
            //             guru: auth.message.id
            //         },
            //         select: {
            //             id: true,
            //             judul: true,
            //             deskripsi: true,
            //             modul: true,
            //             tanggal: true,
            //             class: {
            //                 select: {
            //                     nama: true
            //                 }
            //             }
            //         }
            //     })

            //     output.data = materi.map(i => ({
            //         id: i.id,
            //         tanggal: i.tanggal,
            //         judul: i.judul,
            //         deskripsi: i.deskripsi,
            //         berkas: i.modul,
            //         kelas: i.class.nama
            //     }))
            // }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function POST(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role == "guru") {
                const body = await request.formData()
                const judul = body.get("judul")
                const deskripsi = body.get("deskripsi")
                let modul = body.get("modul")
                modul = JSON.parse(modul)
                const kelas = body.get("kelas")

                await prisma.materi.create({
                    data: {
                        judul: judul,
                        deskripsi: deskripsi,
                        modul: modul,
                        kelas: kelas,
                        guru: auth.message.id
                    }
                })

                output.error = false
                output.message = "Berhasil mengirim materi"
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function PATCH(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role == "guru") {
                const body = await request.formData()
                const id = parseInt(body.get("id"))
                const judul = body.get("judul")
                const deskripsi = body.get("deskripsi")
                let modul = body.get("modul")
                modul = JSON.parse(modul)
                const kelas = body.get("kelas")

                await prisma.materi.update({
                    where: {
                        id: id,
                        guru: auth.message.id
                    },
                    data: {
                        judul: judul,
                        deskripsi: deskripsi,
                        modul: modul,
                        kelas: kelas
                    }
                })

                output.error = false
                output.message = "Berhasil mengirim materi"
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}