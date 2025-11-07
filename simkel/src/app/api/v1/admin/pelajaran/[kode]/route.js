import { CheckAuth, getOutput } from "@/app/api/utils"
import prisma from "@/libs/prisma"

export async function PATCH(request, { params }) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            const { kode } = await params
            const body = await request.formData()

            await prisma.pelajaran.update({
                where: {
                    kode: kode
                },
                data: {
                    kode: body.get("kode"),
                    nama: body.get("nama"),
                    kategori: body.get("kategori")
                }
            })

            output.error = false
            output.message = "Berhasil memperbarui data"
        } else {
            output = auth
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function DELETE(request, { params }) {
    let output = getOutput()
    const { kode } = await params

    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            await prisma.pelajaran.delete({
                where: {
                    kode: kode
                }
            })

            output.error = false
            output.message = "Berhasil menghapus data"
        } else {
            output = auth
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}