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

                const tugas = await prisma.tugas.findUnique({
                    where: {
                        id: Number(id),
                        guru: auth.message.id,
                    },
                    select: {
                        status_tugas: {
                            select: {
                                id: true,
                                status: true,
                                berkas: true,
                                tanggal: true,
                                nilai: true,
                                student: {
                                    select: {
                                        nama: true
                                    }
                                }
                            }
                        }
                    }
                })

                if (tugas && tugas.status_tugas.length > 0) {
                    output.error = false
                    output.message = "Berhasil mengambil data"
                    output.data = tugas.status_tugas.map(i => ({
                        id: i.id,
                        nama: i.student.nama,
                        tanggal: i.tanggal,
                        berkas: i.berkas,
                        status: i.status,
                        nilai: i.nilai
                    })).sort((a, b) => a.nama.localeCompare(b.nama))
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