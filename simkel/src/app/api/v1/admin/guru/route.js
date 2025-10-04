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
            const guru = await prisma.user.findMany({
                where: {
                    role: "guru"
                },
                select: {
                    id: true,
                    foto: true,
                    guru: {
                        select: {
                            nama: true,
                            hp: true,
                            class: {
                                select: {
                                    kode: true,
                                    nama: true
                                }
                            },
                            lesson: {
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

            output.data = guru.map(i => ({
                nip: i.id,
                nama: i.guru.nama,
                foto: i.foto,
                hp: i.guru.hp,
                kelas: i.guru.class ? i.guru.class.nama : null,
                class: i.guru.class ? i.guru.class.kode : null,
                pelajaran: i.guru.lesson.nama,
                lesson: i.guru.lesson.kode
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
            const nip = body.get("nip")
            const nama = body.get("nama")
            const password = await bcrypt.hash(getPassword(nip), 12)
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

            await prisma.user.create({
                data: {
                    id: nip,
                    password: password,
                    old_password: password,
                    foto: foto,
                    role: "guru",
                    guru: {
                        create: {
                            nama: nama,
                            hp: body.get("hp"),
                            ...(body.get("kelas") && {
                                class: {
                                    connect: {
                                        kode: body.get("kelas"),
                                    },
                                },
                            }),
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
            output.message = "Berhasil menambahkan data"
        } else {
            output.message = auth.message
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}