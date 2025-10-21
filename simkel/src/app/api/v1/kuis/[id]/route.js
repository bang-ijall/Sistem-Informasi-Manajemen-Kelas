import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "../../../utils.js"

export async function GET(request, { params }) {
    const output = getOutput()

    try {
        const auth = CheckAuth(request)
        const { id } = await params

        if (!auth.error) {
            if (auth.message.role == "siswa") {
                const status = await prisma.status_tugas.findFirst({
                    where: {
                        tugas: parseInt(id),
                        siswa: auth.message.id,
                        status: "belum"
                    },
                    select: {
                        id: true,
                        task: {
                            select: {
                                judul: true,
                                soal_kuis: true,
                                jenis: true
                            }
                        }
                    }
                })

                if (status && status.task.jenis == "kuis") {
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
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
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
                    const { id } = await params
                    const judul = body.get("judul")
                    const deskripsi = body.get("deskripsi")
                    const batas_waktu = new Date(body.get("batas_waktu"))

                    if (id > 0 && judul != "" && deskripsi != "" && batas_waktu != "") {
                        await prisma.tugas.update({
                            where: {
                                id: parseInt(id),
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
                    const { id } = await params

                    if (parseInt(id) > 0) {
                        await prisma.status_tugas.deleteMany({
                            where: {
                                task: {
                                    id: parseInt(id),
                                    jenis: "kuis"
                                }
                            }
                        })

                        await prisma.tugas.delete({
                            where: {
                                id: parseInt(id),
                                jenis: "kuis"
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