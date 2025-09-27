import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"
import bcrypt from "bcryptjs"

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
                    case 1:
                        if (old && password) {
                            const user = await prisma.user.findUnique({
                                where: {
                                    id: auth.message.id,
                                    role: auth.message.role
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
                                            id: auth.message.id,
                                            role: auth.message.role
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
                    case 2:
                        // foto
                        break
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