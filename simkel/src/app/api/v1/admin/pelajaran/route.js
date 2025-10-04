import { CheckAuth } from "@/app/api/utils"
import prisma from "@/libs/prisma"

const output = {
    error: true,
    message: "Fetch failed"
}

export async function GET(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            const pelajaran = await prisma.pelajaran.findMany()

            output.error = false
            output.message = "Berhasil mengambil data"
            output.data = pelajaran
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

            await prisma.pelajaran.create({
                data: {
                    kode: body.get("kode"),
                    nama: body.get("nama"),
                    kategori: body.get("kategori")
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