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
            const { nisn } = await params
            const body = await request.formData()
            const nisn_ = body.get("nisn")
            const nama = body.get("nama")
            const password = await bcrypt.hash(getPassword(nisn_), 12)
            const foto_type = body.get("foto_type")
            var foto = body.get("foto")

            if (foto_type == "file" && foto && foto.size > 0) {
                const buffer = Buffer.from(await foto.arrayBuffer())
                const folder = path.join(process.cwd(), "public", "siswa", `${nama}_${nisn}`)

                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true })
                }

                const file = path.join(folder, "profile.png")
                fs.writeFileSync(file, buffer)
                foto = `${process.env.NEXT_PUBLIC_BASE_URL}/siswa/${nama}_${nisn}/profile.png`
            }

            await prisma.user.update({
                where: {
                    id: nisn,
                },
                data: {
                    id: nisn_,
                    password: password,
                    old_password: password,
                    foto: foto,
                    role: "siswa",
                    siswa: {
                        update: {
                            nama: nama,
                            hp: body.get("hp"),
                            tahun_masuk: body.get("tahun_masuk"),
                            nama_wali: body.get("nama_wali"),
                            hp_wali: body.get("hp_wali"),
                            class: {
                                connect: {
                                    kode: body.get("kelas")
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
    const { nisn } = await params

    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            await prisma.$transaction([
                prisma.siswa.delete({
                    where: { nisn: nisn }
                }),
                prisma.user.delete({
                    where: { id: nisn }
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