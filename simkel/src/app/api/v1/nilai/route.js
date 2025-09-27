import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"
import { select } from "@nextui-org/react";
const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role != "guru") {
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

                if (status) {
                    output.error = false
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
                }
            } else {
                const tugas = await prisma.tugas.findMany({
                    where: {
                        guru: auth.message.id,
                    },
                    select: {
                        id: true,
                        judul: true,
                        deskripsi: true,
                        batas_waktu: true,
                        dokumen_tugas: true,
                        jenis: true,
                        tanggal: true
                    }
                })

                if (tugas.length > 0) {
                    output.error = false
                    output.message = "Berhasil mengambil data"
                    output.data = tugas.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
                } else {
                    output.message = "Tidak menemukan tugas Anda"
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

export async function POST(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role == "guru") {
                const body = await request.formData()
                const id = parseInt(body.get("id"))
                const tugas = parseInt(body.get("tugas"))
                const nilai = parseFloat(body.get("nilai"))

                const status = await prisma.status_tugas.updateMany({
                    where: {
                        id: id,
                        tugas: tugas,
                        status: "sudah",
                        task: {
                            guru: auth.message.id
                        }
                    },
                    data: {
                        nilai: nilai,
                        status: "dinilai"
                    }
                })

                if (status.count == 1) {
                    output.error = false
                    output.message = "Berhasil memperbarui data"
                } else {
                    output.message = "Gagal memperbarui data"
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