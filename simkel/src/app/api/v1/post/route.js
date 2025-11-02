import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"

export async function GET(request, res) {
    let output = getOutput()
    let status = 200

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const kelas = await prisma.kelas.findMany({
                        select: {
                            materi: {
                                where: {
                                    teacher: {
                                        nip: auth.message.id,
                                        lesson: {
                                            kode: auth.message.pelajaran
                                        }
                                    }
                                },
                                select: {
                                    id: true,
                                    judul: true,
                                    deskripsi: true,
                                    modul: true,
                                    tanggal: true,
                                    class: {
                                        select: {
                                            nama: true
                                        }
                                    }
                                }
                            },
                            tugas: {
                                where: {
                                    teacher: {
                                        nip: auth.message.id,
                                        lesson: {
                                            kode: auth.message.pelajaran
                                        }
                                    }
                                },
                                select: {
                                    id: true,
                                    judul: true,
                                    deskripsi: true,
                                    batas_waktu: true,
                                    jenis: true,
                                    waktu_kuis: true,
                                    soal_kuis: true,
                                    dokumen_tugas: true,
                                    tanggal: true,
                                    class: {
                                        select: {
                                            nama: true
                                        }
                                    },
                                    status_tugas: {
                                        where: {
                                            status: {
                                                in: ["sudah", "dinilai"]
                                            }
                                        },
                                        select: {
                                            id: true,
                                            status: true,
                                            deskripsi: true,
                                            berkas: true,
                                            tanggal: true,
                                            nilai: true,
                                            student: {
                                                select: {
                                                    nama: true,
                                                    user: {
                                                        select: {
                                                            foto: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })

                    if (kelas.length) {
                        output.error = false
                        output.message = "Berhasil mengambil data"
                        output.data = kelas.flatMap(j => [
                            ...j.tugas.map(i => ({
                                id: i.id,
                                judul: i.judul,
                                deskripsi: i.deskripsi,
                                batas_waktu: i.batas_waktu,
                                jenis: i.jenis,
                                waktu_kuis: i.waktu_kuis,
                                jumlah_soal: i.soal_kuis ? i.soal_kuis.length : null,
                                berkas: i.dokumen_tugas,
                                tanggal: i.tanggal,
                                kelas: i.class.nama,
                                siswa: i.status_tugas.map((j) => ({
                                    id: j.id,
                                    foto: j.student.user.foto,
                                    nama: j.student.nama,
                                    deskripsi: j.deskripsi,
                                    berkas: j.berkas,
                                    tanggal: j.tanggal,
                                    nilai: j.nilai,
                                    status: j.status
                                }))
                            })),
                            ...j.materi.map(i => ({
                                id: i.id,
                                judul: i.judul,
                                deskripsi: i.deskripsi,
                                berkas: i.modul,
                                tanggal: i.tanggal,
                                kelas: i.class.nama,
                                jenis: "materi"
                            }))
                        ])
                    } else {
                        output.message = "Tidak menemukan postingan Anda"
                    }
                    break
                }
            }
        } else {
            output = auth
            status = 403
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
        status = 500
    }

    return Response.json(output, {
        status: status
    })
}