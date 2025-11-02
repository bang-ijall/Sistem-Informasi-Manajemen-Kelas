import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"

export async function GET(request, { params }) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            const param = await params
            const kode = param.kode

            switch (auth.message.role) {
                case "siswa":
                case "wali": {
                    const kelas = await prisma.kelas.findUnique({
                        where: {
                            kode: auth.message.kelas
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
                                    waktu_kuis: true,
                                    soal_kuis: true,
                                    teacher: {
                                        select: {
                                            nama: true,
                                            lesson: {
                                                select: {
                                                    nama: true
                                                }
                                            }
                                        }
                                    },
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

                    if (kelas) {
                        output.error = false

                        if (kelas.materi.length > 0 || kelas.tugas.length > 0) {
                            output.message = "Berhasil mengambil postingan"
                            output.data = [
                                ...kelas.tugas.map(i => ({
                                    id: i.id,
                                    tanggal: i.tanggal,
                                    judul: i.judul,
                                    deskripsi: i.deskripsi,
                                    batas_waktu: i.batas_waktu,
                                    berkas: i.dokumen_tugas,
                                    waktu_kuis: i.waktu_kuis,
                                    soal_kuis: i.soal_kuis.length,
                                    jenis: i.jenis,
                                    guru: i.teacher.nama,
                                    pelajaran: i.teacher.lesson.nama,
                                    status: i.status_tugas[0].status,
                                    data: {
                                        id: i.status_tugas[0].id,
                                        deskripsi: i.status_tugas[0].deskripsi,
                                        berkas: i.status_tugas[0].berkas,
                                        tanggal: i.status_tugas[0].tanggal,
                                        nilai: i.status_tugas[0].nilai
                                    }
                                })),
                                ...kelas.materi.map(i => ({
                                    id: i.id,
                                    tanggal: i.tanggal,
                                    judul: i.judul,
                                    deskripsi: i.deskripsi,
                                    berkas: i.modul,
                                    jenis: "materi",
                                    guru: i.teacher.nama,
                                    pelajaran: i.teacher.lesson.nama,
                                }))
                            ]
                        } else {
                            output.message = "Selama ini belum ada aktivitas pada kelas ini"
                        }
                    }

                    break
                }

                case "guru": {
                    const kelas = await prisma.kelas.findUnique({
                        where: {
                            kode: kode
                        },
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

                    if (kelas) {
                        output.error = false

                        if (kelas.materi.length > 0 || kelas.tugas.length > 0) {
                            output.message = "Berhasil mengambil data"
                            output.data = [
                                ...kelas.tugas.map(i => ({
                                    id: i.id,
                                    judul: i.judul,
                                    deskripsi: i.deskripsi,
                                    batas_waktu: i.batas_waktu,
                                    jenis: i.jenis,
                                    waktu_kuis: i.waktu_kuis,
                                    soal_kuis: i.soal_kuis,
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
                                ...kelas.materi.map(i => ({
                                    id: i.id,
                                    judul: i.judul,
                                    deskripsi: i.deskripsi,
                                    berkas: i.modul,
                                    tanggal: i.tanggal,
                                    kelas: i.class.nama,
                                    jenis: "materi"
                                }))
                            ]
                        } else {
                            output.message = "Selama ini anda belum mengajar pada kelas ini"
                        }
                    } else {
                        output.message = "Tidak menemukan postingan Anda"
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