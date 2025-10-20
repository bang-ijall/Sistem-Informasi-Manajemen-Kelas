import prisma from "@/libs/prisma"
import { CheckAuth } from "../../../utils.js"

export async function GET(request, { params }) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role == "guru") {
                const { id } = await params

                const roster = await prisma.roster.findUnique({
                    where: {
                        id: Number(id)
                    },
                    select: {
                        class: {
                            select: {
                                siswa: {
                                    select: {
                                        nama: true,
                                        kehadiran: {
                                            select: {
                                                tanggal: true,
                                                status: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })

                if (roster) {
                    output.error = false
                    output.message = "Berhasil mengambil data"
                    output.data = {
                        total: roster.class.siswa[0].kehadiran.length,
                        siswa: roster.class.siswa.map(i => ({
                            nama: i.nama,
                            kehadiran: i.kehadiran
                        }))
                    }
                } else {
                    output.message = "Kami tidak menemukan data kehadiran siswa"
                }
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        console.error(error.message)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}