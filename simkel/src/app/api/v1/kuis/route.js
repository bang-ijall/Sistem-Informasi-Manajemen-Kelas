import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"

const output = {
    error: true,
    message: "Server kami menolak permintaan dari anda!"
}

export async function POST(request, { params }) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role == "siswa") {
                const body = await request.formData()
                const id = parseInt(body.get("id"))
                var jawaban = body.get("jawaban")
                jawaban = JSON.parse(jawaban)

                const status = await prisma.status_tugas.findFirst({
                    where: {
                        tugas: id,
                        siswa: auth.message.id,
                        status: "belum"
                    },
                    select: {
                        id: true,
                        tanggal: true,
                        task: {
                            select: {
                                soal_kuis: true,
                                batas_waktu: true,
                                waktu_kuis: true
                            }
                        }
                    }
                })

                if (status) {
                    const now = new Date()
                    const tanggal = new Date(status.tanggal)
                    const time = new Date(tanggal.getTime() + (status.task.waktu_kuis * 1000) + (60 * 1000))

                    if (now.getTime() < time.getTime()) {
                        let hasil = []

                        status.task.soal_kuis.forEach((s, i) => {
                            hasil.push(jawaban[i] == s.key)
                        })

                        let benar = hasil.filter((i) => i == true).length
                        let salah = hasil.filter((i) => i == false).length
                        let nilai = parseFloat(benar) / status.task.soal_kuis.length * 100

                        await prisma.status_tugas.update({
                            where: {
                                id: status.id
                            },
                            data: {
                                status: "dinilai",
                                tanggal: new Date(),
                                nilai: nilai
                            }
                        })

                        output.error = false
                        output.message = "Selamat! Anda telah selesai mengerjakan kuis ini"
                        output.data = {
                            nilai: nilai,
                            benar: benar,
                            salah: salah,
                            hasil: hasil
                        }
                    }
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