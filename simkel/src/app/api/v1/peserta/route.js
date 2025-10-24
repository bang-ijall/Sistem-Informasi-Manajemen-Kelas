import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"

export async function GET(request) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.kelas != null) {
                const kelas = await prisma.kelas.findUnique({
                    where: {
                        kode: auth.message.kelas
                    },
                    select: {
                        guru: {
                            select: {
                                nama: true,
                                user: {
                                    select: {
                                        foto: true
                                    }
                                }
                            }
                        },
                        siswa: {
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
                })

                if (kelas && (kelas.guru || kelas.siswa.length > 0)) {
                    output.error = false
                    output.message = "Berhasil mengambil data"
                    output.data = {
                        guru: {
                            nama: kelas.guru.nama,
                            foto: kelas.guru.user.foto
                        },
                        siswa: kelas.siswa.map(i => ({
                            nama: i.nama,
                            foto: i.user.foto
                        }))
                    }
                } else {
                    output.message = "Tidak menemukan peserta kelas Anda"
                }
            } else {
                output.message = "Tidak menemukan peserta kelas Anda"
            }
        } else {
            output = auth
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}