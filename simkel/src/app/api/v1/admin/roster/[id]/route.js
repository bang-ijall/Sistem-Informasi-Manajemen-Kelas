import { CheckAuth } from "@/app/api/utils"
import prisma from "@/libs/prisma"

const output = {
    error: true,
    message: "Fetch failed"
}

export async function PATCH(request, { params }) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            var { id } = await params

            id = Number(id)
            const body = await request.formData()
            const hari = body.get("hari")
            const kelas = body.get("kelas")
            const jamMulai = body.get("jam_mulai")
            const jamSelesai = body.get("jam_selesai")

            const roster = await prisma.roster.findFirst({
                where: {
                    hari: hari,
                    class: {
                        kode: kelas
                    },
                    AND: [{
                        jam_mulai: {
                            lt: jamSelesai
                        }
                    }, {
                        jam_selesai: {
                            gt: jamMulai
                        }
                    }]
                },
                select: {
                    id: true,
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
            })

            if (!roster || roster.id == id) {
                await prisma.roster.update({
                    where: {
                        id: id
                    },
                    data: {
                        hari: body.get("hari"),
                        jam_mulai: body.get("jam_mulai"),
                        jam_selesai: body.get("jam_selesai"),
                        class: {
                            connect: {
                                kode: body.get("kelas")
                            }
                        },
                        teacher: {
                            connect: {
                                nip: body.get("pelajaran")
                            }
                        }
                    }
                })

                output.error = false
                output.message = "Berhasil memperbarui data"
            } else {
                output.message = `Gagal memperbarui roster akibat bentrok dengan pelajaran ${roster.teacher.lesson.nama} - ${roster.teacher.nama}`
            }
        } else {
            output.message = auth.message
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function DELETE(request, { params }) {
    var { id } = await params
    id = Number(id)

    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            await prisma.roster.delete({
                where: {
                    id: id
                }
            })

            output.error = false
            output.message = "Berhasil menghapus data"
        } else {
            output.message = auth.message
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}