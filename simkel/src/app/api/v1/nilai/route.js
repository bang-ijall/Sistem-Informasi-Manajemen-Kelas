import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"

export async function GET(request) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "siswa":
                case "wali": {
                    const status = await prisma.status_tugas.findMany({
                        where: {
                            siswa: auth.message.id,
                            status: "dinilai"
                        },
                        select: {
                            nilai: true,
                            berkas: true,
                            tanggal: true,
                            task: {
                                select: {
                                    judul: true,
                                    deskripsi: true,
                                    batas_waktu: true,
                                    dokumen_tugas: true,
                                    jenis: true,
                                    tanggal: true
                                }
                            }
                        }
                    })

                    output.error = false

                    if (status.length > 0) {
                        output.message = "Berhasil mengambil data"

                        output.data = status.map(i => ({
                            judul: i.task.judul,
                            deskripsi: i.task.deskripsi,
                            batas_waktu: i.task.batas_waktu,
                            dokumen_tugas: i.task.dokumen_tugas,
                            jenis: i.task.jenis,
                            tanggal_tugas: i.task.tanggal,
                            berkas: i.berkas,
                            tanggal: i.tanggal,
                            nilai: i.nilai
                        }))
                    } else {
                        output.message = "Anda belum diberikan nilai oleh guru"
                    }

                    break
                }
            }
        } else {
            output = auth
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function POST(request) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const body = await request.formData()
                    const id = parseInt(body.get("id"))
                    const nilai = parseFloat(body.get("nilai").replace(",", "."))

                    await prisma.status_tugas.update({
                        where: {
                            id: id,
                            status: "sudah",
                            task: {
                                guru: auth.message.id,
                                jenis: "submission"
                            }
                        },
                        data: {
                            nilai: nilai,
                            status: "dinilai"
                        }
                    })

                    output.error = false
                    output.message = "Berhasil memperbarui data"
                    break
                }
            }
        } else {
            output = auth
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}