import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "../../utils.js"

export async function POST(request) {
    const output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "siswa": {
                    const body = await request.formData()
                    const id = parseInt(body.get("id"))
                    const jawaban = JSON.parse(body.get("jawaban"))

                    if (id > 0 && jawaban.length >= 0) {
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
                                const hasil = []

                                status.task.soal_kuis.forEach((s, i) => {
                                    hasil.push(jawaban[i] == s.key)
                                })

                                const benar = hasil.filter((i) => i == true).length
                                const salah = hasil.filter((i) => i == false).length
                                const nilai = parseFloat(benar) / status.task.soal_kuis.length * 100

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

                    break
                }

                case "guru": {
                    const body = await request.formData()
                    const judul = body.get("judul")
                    const deskripsi = body.get("deskripsi")
                    const batas_waktu = new Date(body.get("batas_waktu"))
                    const waktu_kuis = parseInt(body.get("waktu_kuis"))
                    const soal_kuis = JSON.parse(body.get("soal_kuis"))
                    const kelas = body.getAll("kelas[]")
                    console.log(body)
                    console.log(soal_kuis)

                    if (judul != "" && waktu_kuis > 0 && soal_kuis.length > 0 && kelas.length > 0) {
                        const siswa = await prisma.siswa.findMany({
                            where: {
                                kelas: {
                                    in: kelas
                                }
                            },
                            select: {
                                nisn: true
                            }
                        })

                        await prisma.tugas.create({
                            data: {
                                judul: judul,
                                deskripsi: deskripsi,
                                batas_waktu: batas_waktu,
                                jenis: "kuis",
                                waktu_kuis: waktu_kuis,
                                soal_kuis: soal_kuis,
                                tanggal: new Date(),
                                kelas: {
                                    connect: kelas.map(k => ({
                                        kode: k
                                    }))
                                },
                                teacher: {
                                    connect: {
                                        nip: auth.message.id
                                    }
                                },
                                status_tugas: {
                                    create: siswa.map(i => ({
                                        siswa: i.nisn,
                                        status: "belum"
                                    }))
                                }
                            }
                        })
                    }

                    output.error = false
                    output.message = "Kuis berhasil dibuat"
                    break
                }
            }
        }
    } catch (error) {
        console.log(error)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}