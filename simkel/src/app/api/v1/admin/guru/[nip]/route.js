import prisma from "@/libs/prisma"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"
import { CheckAuth, getPassword } from "@/app/api/utils"

const output = {
    error: true,
    message: "Fetch failed",
}

export async function PATCH(request, { params }) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            const { nip } = await params
            const body = await request.formData()
            const nip_ = body.get("nip")
            const nama = body.get("nama")
            const kelas = body.get("kelas")
            const password = await bcrypt.hash(getPassword(nip_), 12)
            const foto_type = body.get("foto_type")
            var foto = body.get("foto")

            if (foto_type == "file" && foto && foto.size > 0) {
                const buffer = Buffer.from(await foto.arrayBuffer())
                const folder = path.join(process.cwd(), "public", "guru", `${nama}_${nip}`)

                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true })
                }

                const file = path.join(folder, "profile.png")
                fs.writeFileSync(file, buffer)
                foto = `${process.env.NEXT_PUBLIC_BASE_URL}/guru/${nama}_${nip}/profile.png`
            }

            await prisma.user.update({
                where: {
                    id: nip,
                },
                data: {
                    id: nip_,
                    password: password,
                    old_password: password,
                    foto: foto,
                    role: "guru",
                    guru: {
                        update: {
                            nama: nama,
                            hp: body.get("hp"),
                            ...(kelas && kelas != "-" ? {
                                class: {
                                    connect: {
                                        kode: kelas,
                                    },
                                },
                            } : {}),
                            lesson: {
                                connect: {
                                    kode: body.get("pelajaran")
                                }
                            }
                        }
                    }
                }
            })

            output.error = false
            output.message = "Berhasil memperbarui data"
        } else {
            output.message = auth.message
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function DELETE(request, { params }) {
    const { nip } = await params

    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            await prisma.$transaction([
                prisma.guru.delete({
                    where: {
                        nip: nip
                    }
                }),
                prisma.user.delete({
                    where: {
                        id: nip
                    }
                })
            ])

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