import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"
import { select } from "@nextui-org/react"

const output = {
    error: true,
    message: "Server kami menolak permintaan dari anda!"
}

export async function GET(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            const status = await prisma.status_tugas.findMany({
                where: {
                    siswa: auth.message.id
                },
                select: {
                    nilai: true,
                    deskripsi: true,
                    berkas: true,
                    tanggal: true,
                    status: true,
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
                    data: {
                        deskripsi: i.deskripsi,
                        berkas: i.berkas,
                        tanggal: i.tanggal,
                        nilai: i.nilai
                    }
                }))
            }
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
            if (auth.message.role == "siswa") {
                const body = await request.formData()
                const id = parseInt(body.get("id"))
                const deskripsi = body.get("deskripsi")
                let berkas = body.get("berkas")
                berkas = JSON.parse(berkas)

                if (id && deskripsi && berkas && (deskripsi != "" || berkas.length > 0)) {
                    const status = await prisma.status_tugas.updateMany({
                        where: {
                            siswa: auth.message.id,
                            tugas: id,
                            status: {
                                in: ["belum", "sudah"]
                            }
                        },
                        data: {
                            status: "sudah",
                            deskripsi: deskripsi,
                            berkas: berkas,
                            tanggal: new Date()
                        }
                    })

                    if (status.count == 1) {
                        output.error = false
                        output.message = "Tugas anda berhasil diserahkan"
                    }
                }
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        console.log(error)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}