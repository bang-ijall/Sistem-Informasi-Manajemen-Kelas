import bcrypt from "bcryptjs"
import prisma from "@/libs/prisma"
import jwt from "jsonwebtoken"

export async function POST(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const body = await request.formData()

        const email = body.get("email")
        const password = body.get("password")

        if (email && password) {
            const admin = await prisma.admin.findUnique({
                where: {
                    email: email
                },
                select: {
                    nama: true,
                    password: true,
                    foto: true
                }
            });

            if (admin) {
                console.log(await bcrypt.hash(password, 12))
                const is_valid = await bcrypt.compare(password, admin.password);

                if (is_valid) {
                    const token = jwt.sign({
                        email: email,
                        nama: admin.nama,
                        foto: admin.foto,
                        role: "admin"
                    }, process.env.JWT_SECRET, {
                        expiresIn: "1h"
                    })

                    output.error = false
                    output.message = "Berhasil login"
                    output.data = token
                } else {
                    output.message = "Username atau password salah"
                }
            } else {
                output.message = "Login gagal"
            }
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}