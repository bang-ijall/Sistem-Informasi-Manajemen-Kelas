import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

export async function POST(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role != "wali") {
                const body = await request.formData()
                const type = parseInt(body.get("type"))
                const old = body.get("old")
                const password = body.get("password")
                const foto = body.get("foto")

                switch (type) {
                    //password
                    case 1:
                        {
                            if (old && password) {
                                const user = await prisma.user.findUnique({
                                    where: {
                                        id: auth.message.id
                                    },
                                    select: {
                                        password: true
                                    }
                                })

                                if (user) {
                                    const is_valid = await bcrypt.compare(old, user.password)

                                    if (is_valid) {
                                        await prisma.user.update({
                                            where: {
                                                id: auth.message.id
                                            },
                                            data: {
                                                password: await bcrypt.hash(password, 12)
                                            }
                                        })

                                        output.error = false
                                        output.message = "Berhasil mengganti kata sandi Anda"
                                    }
                                }
                            }

                            break
                        }

                    //foto
                    case 2:
                        {
                            let new_foto = null

                            if (foto && foto.size > 0) {
                                const buffer = Buffer.from(await foto.arrayBuffer())
                                const folder = path.join(process.cwd(), "public", "siswa", `${auth.message.nama}_${auth.message.id}`)

                                if (!fs.existsSync(folder)) {
                                    fs.mkdirSync(folder, { recursive: true })
                                }

                                const file = path.join(folder, "profile.png")
                                fs.writeFileSync(file, buffer)
                                new_foto = `${process.env.NEXT_PUBLIC_BASE_URL}/siswa/${auth.message.nama}_${auth.message.id}/profile.png`
                            }

                            if (new_foto != null) {
                                await prisma.user.update({
                                    where: {
                                        id: auth.message.id
                                    },
                                    data: {
                                        foto: new_foto
                                    }
                                })

                                output.error = false
                                output.message = "Berhasil mengganti foto Anda"

                                output.data = {
                                    foto: new_foto
                                }
                            }

                            break
                        }
                }
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}