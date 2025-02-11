import bcrypt from "bcryptjs"
import prisma from "@/libs/prisma"

export async function POST(request) {
    const output = {
        error: true,
        message: "Fetch failed"
    }

    try {
        const request_data = await request.formData()
        const user = await prisma.user.findUnique({
            where: {
                username: request_data.get("username")
            }
        })

        if (user) {
            const is_pw_valid = await bcrypt.compare(request_data.get("password"), user.password)

            if (is_pw_valid) {
                output.error = false
                output.message = "Login berhasil"
            } else {
                output.message = "Username atau password salah"
            }
        } else {
            output.message = "Username atau password salah"
        }
    } catch (error) {
        if (error.code === "P2002") {
            output.message = "Data `siswa` tidak boleh duplikat."
        } else if (error.code === "P2025") {
            output.message = "Data tidak ditemukan."
        } else if (error.code) {
            output.message = "Kesalahan database."
        } else {
            output.message = "Error: " + error.message
        }
    }

    return Response.json(output)
}