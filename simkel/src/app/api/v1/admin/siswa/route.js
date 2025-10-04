import prisma from "@/libs/prisma"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"
import { CheckAuth, getPassword } from "@/app/api/utils"

const output = {
    error: true,
    message: "Fetch failed"
}

export async function GET(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            const siswa = await prisma.user.findMany({
                where: {
                    role: "siswa"
                },
                select: {
                    id: true,
                    foto: true,
                    siswa: {
                        select: {
                            nama: true,
                            hp: true,
                            tahun_masuk: true,
                            nama_wali: true,
                            hp_wali: true,
                            class: {
                                select: {
                                    kode: true,
                                    nama: true
                                }
                            }
                        }
                    }
                }
            })

            output.error = false
            output.message = "Berhasil mengambil data"

            output.data = siswa.map(i => ({
                nisn: i.id,
                nama: i.siswa.nama,
                foto: i.foto,
                hp: i.siswa.hp,
                tahun_masuk: i.siswa.tahun_masuk,
                kelas: i.siswa.class.nama,
                class: i.siswa.class.kode,
                nama_wali: i.siswa.nama_wali,
                hp_wali: i.siswa.hp_wali
            }))
        } else {
            output.message = auth.message
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function POST(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
        const body = await request.formData()
        const nisn = body.get("nisn")
        const nama = body.get("nama")
        const password = await bcrypt.hash(getPassword(nisn), 12)
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

        await prisma.user.create({
            data: {
                id: nisn,
                password: password,
                old_password: password,
                foto: foto,
                role: "siswa",
                siswa: {
                    create: {
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
        output.message = "Berhasil menambahkan data"
    } else {
        output.message = auth.message
    }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}