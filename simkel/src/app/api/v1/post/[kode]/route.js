import { CheckAuth } from "@/app/api/utils"
import prisma from "@/libs/prisma"

const output = {
    error: true,
    message: "Server kami menolak permintaan dari anda!"
}

export async function GET(request, { params }) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            const { kode } = await params
            const is_guru = auth.message.role == "guru"

            const kelas = await prisma.kelas.findUnique({
                where: {
                    kode: is_guru ? kode : auth.message.kelas
                },
                select: {
                    materi: {
                        where: {
                            teacher: {
                                lesson: {
                                    kode: kode
                                }
                            }
                        },
                        select: {
                            id: true,
                            judul: true,
                            deskripsi: true,
                            modul: true,
                            tanggal: true
                        }
                    },
                    tugas: {
                        where: {
                            teacher: {
                                lesson: {
                                    kode: kode
                                }
                            }
                        },
                        select: {
                            id: true,
                            judul: true,
                            deskripsi: true,
                            batas_waktu: true,
                            dokumen_tugas: true,
                            jenis: true,
                            tanggal: true,
                            status_tugas: {
                                where: {
                                    siswa: auth.message.id
                                },
                                select: {
                                    nilai: true,
                                    status: true
                                }
                            }
                        }
                    }
                }
            })

            if (kelas && (kelas.materi.length > 0 || kelas.tugas.length > 0)) {
                output.error = false
                output.message = "Berhasil mengambil postingan"
                output.data = [
                    ...kelas.tugas.map(i => ({
                        id: i.id,
                        tanggal: i.tanggal,
                        judul: i.judul,
                        deskripsi: i.deskripsi,
                        batas_waktu: i.batas_waktu,
                        berkas: i.dokumen_tugas,
                        jenis: i.jenis,
                        status: i.status_tugas[0].status,
                        nilai: i.status_tugas[0].nilai
                    })),
                    ...kelas.materi.map(i => ({
                        id: i.id,
                        tanggal: i.tanggal,
                        judul: i.judul,
                        deskripsi: i.deskripsi,
                        batas_waktu: null,
                        berkas: i.modul,
                        jenis: "materi"
                    }))
                ]
            } else {
                output.message = "Tidak menemukan postingan Anda"
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}