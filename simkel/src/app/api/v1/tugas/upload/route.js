import prisma from "@/libs/prisma"
import { CheckAuth } from "../../../utils.js"
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
                const id = parseInt(body.get("id"))
                const file = body.get("file")

                if (file && file.size > 0) {
                    switch (auth.message.role) {
                        case "siswa":
                            {
                                const tugas = await prisma.tugas.findUnique({
                                    where: {
                                        id: id
                                    },
                                    select: {
                                        judul: true,
                                        teacher: {
                                            select: {
                                                lesson: {
                                                    select: {
                                                        nama: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                })

                                if (tugas) {
                                    const ext = path.extname(file.name)
                                    const buffer = Buffer.from(await file.arrayBuffer())
                                    const folder = path.join(process.cwd(), "public", "siswa", `${auth.message.nama}_${auth.message.id}`, `tugas`)

                                    if (!fs.existsSync(folder)) {
                                        fs.mkdirSync(folder, { recursive: true })
                                    }

                                    const name = `${tugas.teacher.lesson.nama} - ${tugas.judul}_${new Date().getTime()}${ext}`
                                    const file_ = path.join(folder, name)
                                    fs.writeFileSync(file_, buffer)

                                    const new_file = `${process.env.NEXT_PUBLIC_BASE_URL}/siswa/${auth.message.nama}_${auth.message.id}/tugas/${name}`

                                    output.error = false
                                    output.message = "Berhasil mengupload berkas Anda"

                                    output.data = {
                                        file: new_file
                                    }
                                }

                                break
                            }
                        case "guru":
                            {
                                const tugas = await prisma.tugas.findUnique({
                                    select: {
                                        judul: true,
                                        teacher: {
                                            select: {
                                                lesson: {
                                                    select: {
                                                        nama: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                })

                                if (tugas) {
                                    const ext = path.extname(file.name)
                                    const buffer = Buffer.from(await file.arrayBuffer())
                                    const folder = path.join(process.cwd(), "public", "siswa", `${auth.message.nama}_${auth.message.id}`, `tugas`)

                                    if (!fs.existsSync(folder)) {
                                        fs.mkdirSync(folder, { recursive: true })
                                    }

                                    const name = `${tugas.teacher.lesson.nama} - ${tugas.judul}_${new Date().getTime()}${ext}`
                                    const file_ = path.join(folder, name)
                                    fs.writeFileSync(file_, buffer)

                                    const new_file = `${process.env.NEXT_PUBLIC_BASE_URL}/siswa/${auth.message.nama}_${auth.message.id}/tugas/${name}`

                                    output.error = false
                                    output.message = "Berhasil mengupload berkas Anda"

                                    output.data = {
                                        file: new_file
                                    }
                                }

                                break
                            }
                    }
                }
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        console.log(error)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    console.log(output.message)
    return Response.json(output)
}