import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"

export async function GET(request, { params }) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)
        const param = await params
        const id = parseInt(param.id)

        if (!auth.error) {
            switch (auth.message.role) {
                case "siswa": {
                    const status = await prisma.status_tugas.findunique({
                        where: {
                            status: "belum",
                            siswa_tugas: {
                                siswa: auth.message.id,
                                tugas: id
                            },
                            task: {
                                jenis: "kuis"
                            }
                        },
                        select: {
                            id: true,
                            task: {
                                select: {
                                    judul: true,
                                    soal_kuis: true
                                }
                            }
                        }
                    })

                    if (status) {
                        await prisma.status_tugas.update({
                            where: {
                                id: status.id,
                                tugas: parseInt(id),
                                siswa: auth.message.id,
                                status: "belum"
                            },
                            data: {
                                tanggal: new Date()
                            }
                        })

                        output.error = false
                        output.message = "Berhasil mengambil data"

                        output.data = {
                            judul: status.task.judul,
                            soal_kuis: status.task.soal_kuis.map(i => ({
                                no: i.no,
                                soal: i.soal,
                                option: i.option
                            }))
                        }
                    } else {
                        output.message = "Tidak menemukan tugas anda"
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

export async function PATCH(request, { params }) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const body = await request.formData()
                    const param = await params
                    const id = parseInt(param.id)
                    const judul = body.get("judul")
                    const deskripsi = body.get("deskripsi")
                    const batas_waktu = new Date(body.get("batas_waktu"))

                    if (id > 0 && judul != "" && deskripsi != "" && batas_waktu != "") {
                        await prisma.tugas.update({
                            where: {
                                id: id,
                                jenis: "kuis",
                                guru: auth.message.id
                            },
                            data: {
                                judul: judul,
                                deskripsi: deskripsi,
                                batas_waktu: batas_waktu
                            }
                        })

                        output.error = false
                        output.message = "Berhasil memperbarui kuis"
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

export async function DELETE(request, { params }) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const param = await params
                    const id = parseInt(param.id)

                    if (id > 0) {
                        await prisma.status_tugas.deleteMany({
                            where: {
                                task: {
                                    id: id,
                                    jenis: "kuis",
                                    guru: auth.message.id
                                }
                            }
                        })

                        await prisma.tugas.delete({
                            where: {
                                id: id,
                                jenis: "kuis",
                                guru: auth.message.id
                            }
                        })

                        output.error = false
                        output.message = "Berhasil menghapus kuis"
                    }
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