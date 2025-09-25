import prisma from "@/libs/prisma"
import { CheckAuth } from "../auth/auth.js"
import { select } from "@nextui-org/react"

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

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

                if (kelas && kelas.guru.length == 1 && kelas.siswa.length > 0) {
                    output.error = false
                    output.message = "Berhasil mengambil data"
                    output.data = {
                        guru: {
                            nama: kelas.guru[0].nama,
                            foto: kelas.guru[0].user.foto
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
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}
