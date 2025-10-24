import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"

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
                    const batas_waktu = new Date(body.get("batas_waktu"))
                    const dokumen_tugas = body.getAll("dokumen_tugas[]")
                    const kelas = body.get("kelas")
                    let files = []

                    if (id > 0 && judul != "" && batas_waktu != "" && (deskripsi != "" || dokumen_tugas.length > 0) && kelas != "") {
                        for (const file of dokumen_tugas) {
                            if (typeof file == "string") {
                                files.push(file)
                                continue
                            }

                            const ext = path.extname(file.name)
                            const buffer = Buffer.from(await file.arrayBuffer())
                            const folder = path.join(process.cwd(), "public", "guru", `${auth.message.nama}_${auth.message.id}`, `tugas`)

                            if (!fs.existsSync(folder)) {
                                fs.mkdirSync(folder, { recursive: true })
                            }

                            const name = `${kelas} - ${judul}_${new Date().getTime()}${ext}`
                            const file_ = path.join(folder, name)
                            fs.writeFileSync(file_, buffer)

                            files.push(`${process.env.NEXT_PUBLIC_BASE_URL}/guru/${auth.message.nama}_${auth.message.id}/tugas/${name}`)
                        }

                        await prisma.tugas.update({
                            where: {
                                id: parseInt(id),
                                jenis: "submission",
                                guru: auth.message.id
                            },
                            data: {
                                judul: judul,
                                deskripsi: deskripsi,
                                batas_waktu: batas_waktu,
                                dokumen_tugas: files,
                                tanggal: new Date()
                            }
                        })

                        output.error = false
                        output.message = "Berhasil memperbarui tugas"
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
                        await prisma.status_tugas.deleteMany({
                            where: {
                                task: {
                                    id: id,
                                    jenis: "submission",
                                    guru: auth.message.id
                                }
                            }
                        })

                        await prisma.tugas.delete({
                            where: {
                                id: id,
                                jenis: "submission",
                                guru: auth.message.id
                            }
                        })

                        output.error = false
                        output.message = "Berhasil menghapus tugas"
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