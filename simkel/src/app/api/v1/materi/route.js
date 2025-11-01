import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"
import fs from "fs"
import path from "path"

export async function GET(request) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const materi = await prisma.materi.findMany({
                        where: {
                            guru: auth.message.id
                        },
                        select: {
                            judul: true,
                            deskripsi: true,
                            modul: true,
                            tanggal: true,
                            class: {
                                select: {
                                    kode: true,
                                    nama: true
                                }
                            }
                        }
                    })

                    output.error = false

                    if (materi.length > 0) {
                        output.message = "Berhasil mengambil data"

                        output.data = materi.map((i) => ({
                            judul: i.judul,
                            deskripsi: i.deskripsi,
                            modul: i.modul,
                            tanggal: i.tanggal,
                            class: i.class.kode,
                            kelas: i.class.nama
                        }))
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

export async function POST(request) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const body = await request.formData()
                    const judul = body.get("judul")
                    const deskripsi = body.get("deskripsi")
                    const modul = body.getAll("modul[]")
                    const kelas = body.getAll("kelas[]")
                    let files = []

                    if (judul != "" && (deskripsi != "" || modul.length > 0) && kelas.length > 0) {
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
                    }

                    await prisma.materi.createMany({
                        data: kelas.map((i) => ({
                            judul: judul,
                            deskripsi: deskripsi,
                            modul: files,
                            tanggal: new Date(),
                            guru: auth.message.id,
                            kelas: i
                        }))
                    })

                    output.error = false
                    output.message = "Berhasil mengirim materi"
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