import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"
import fs from "fs"
import path from "path"

export async function PATCH(request, { params }) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const body = await request.formData()
                    const param = await params
                    const id = parseInt(param.id)
                    const judul = body.get("judul")
                    const deskripsi = body.get("deskripsi")
                    const modul = body.getAll("modul[]")
                    let files = []

                    if (id > 0 && judul != "" && (deskripsi != "" || modul.length > 0)) {
                        for (const file of modul) {
                            if (typeof file == "string") {
                                files.push(file)
                                continue
                            }

                            const ext = path.extname(file.name)
                            const buffer = Buffer.from(await file.arrayBuffer())
                            const folder = path.join(process.cwd(), "public", "guru", `${auth.message.nama}_${auth.message.id}`, `materi`)

                            if (!fs.existsSync(folder)) {
                                fs.mkdirSync(folder, { recursive: true })
                            }

                            const name = `${kelas} - ${judul}_${new Date().getTime()}${ext}`
                            const file_ = path.join(folder, name)
                            fs.writeFileSync(file_, buffer)

                            files.push(`${process.env.NEXT_PUBLIC_BASE_URL}/guru/${auth.message.nama}_${auth.message.id}/materi/${name}`)
                        }

                        await prisma.materi.update({
                            where: {
                                id: id,
                                guru: auth.message.id
                            },
                            data: {
                                judul: judul,
                                deskripsi: deskripsi,
                                modul: modul
                            }
                        })

                        output.error = false
                        output.message = "Berhasil mengirim materi"
                    }

                    break
                }
            }
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

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const param = await params
                    const id = parseInt(param.id)

                    if (id > 0) {
                        await prisma.materi.delete({
                            where: {
                                id: id,
                                guru: auth.message.id
                            }
                        })

                        output.error = false
                        output.message = "Berhasil menghapus materi"
                    }

                    break
                }
            }
        } else {
            output = auth
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}