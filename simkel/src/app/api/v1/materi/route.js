import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"
import fs from "fs"
import path from "path"

const output = {
    error: true,
    message: "Server kami menolak permintaan dari anda!"
}

export async function GET(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            // if (auth.message.role != "guru") {
            const kelas = await prisma.kelas.findUnique({
                where: {
                    kode: auth.message.kelas
                },
                select: {
                    materi: {
                        select: {
                            id: true,
                            judul: true,
                            deskripsi: true,
                            modul: true,
                            tanggal: true,
                            teacher: {
                                select: {
                                    nama: true,
                                    lesson: {
                                        select: {
                                            nama: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            output.error = false
            output.message = "Berhasil mengambil data"
            output.data = kelas.materi.map(i => ({
                id: i.id,
                tanggal: i.tanggal,
                judul: i.judul,
                deskripsi: i.deskripsi,
                berkas: i.modul,
                guru: i.teacher.nama,
                pelajaran: i.teacher.lesson.nama
            }))
            // } else {
            //     const materi = await prisma.materi.findMany({
            //         where: {
            //             guru: auth.message.id
            //         },
            //         select: {
            //             id: true,
            //             judul: true,
            //             deskripsi: true,
            //             modul: true,
            //             tanggal: true,
            //             class: {
            //                 select: {
            //                     nama: true
            //                 }
            //             }
            //         }
            //     })

            //     output.data = materi.map(i => ({
            //         id: i.id,
            //         tanggal: i.tanggal,
            //         judul: i.judul,
            //         deskripsi: i.deskripsi,
            //         berkas: i.modul,
            //         kelas: i.class.nama
            //     }))
            // }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function POST(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role == "guru") {
                const body = await request.formData()
                const judul = body.get("judul")
                const deskripsi = body.get("deskripsi")
                const modul = body.getAll("modul[]")
                const kelas = body.getAll("kelas[]")
                let files = []

                if (judul && ((deskripsi && deskripsi != "") || (modul.length > 0)) && kelas.length > 0) {
                    for (const file of modul) {
                        if (typeof file === "string") {
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

                await prisma.materi.create({
                    data: {
                        judul: judul,
                        deskripsi: deskripsi,
                        modul: files,
                        tanggal: new Date(),
                        guru: auth.message.id,
                        kelas: {
                            connect: kelas.map(k => ({
                                kode: k
                            }))
                        }
                    }
                })

                output.error = false
                output.message = "Berhasil mengirim materi"
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function PATCH(request, { params }) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role == "guru") {
                const body = await request.formData()
                const { id } = await params
                const judul = body.get("judul")
                const deskripsi = body.get("deskripsi")
                const modul = body.getAll("modul[]")
                let files = []

                if (judul != "" && deskripsi != "" && modul.length > 0) {
                    const materi = await params.materi.findUnique({
                        where: {
                            id: id,
                            guru: auth.message.id
                        },
                        select: {
                            
                        }
                    })
                    for (const file of modul) {
                        if (typeof file === "string") {
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

                await prisma.materi.update({
                    where: {
                        id: id,
                        guru: auth.message.id
                    },
                    data: {
                        judul: judul,
                        deskripsi: deskripsi,
                        modul: modul,
                        kelas: kelas
                    }
                })

                output.error = false
                output.message = "Berhasil mengirim materi"
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}