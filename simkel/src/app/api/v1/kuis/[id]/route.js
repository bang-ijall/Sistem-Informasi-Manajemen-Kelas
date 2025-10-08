import prisma from "@/libs/prisma"
import { CheckAuth } from "../../../utils.js"
import { select } from "@nextui-org/react"

const output = {
    error: true,
    message: "Server kami menolak permintaan dari anda!"
}

export async function GET(request, { params }) {
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