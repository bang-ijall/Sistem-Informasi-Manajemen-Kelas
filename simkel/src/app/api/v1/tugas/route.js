import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"
import fs from "fs"
import path from "path"

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            const status = await prisma.status_tugas.findMany({
                where: {
                    siswa: auth.message.id
                },
                select: {
                    nilai: true,
                    deskripsi: true,
                    berkas: true,
                    tanggal: true,
                    status: true,
                    task: {
                        select: {
                            id: true,
                            judul: true,
                            deskripsi: true,
                            batas_waktu: true,
                            dokumen_tugas: true,
                            jenis: true,
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

            if (status.length > 0) {
                output.error = false
                output.message = "Berhasil mengambil data"
                output.data = status.map(i => ({
                    id: i.task.id,
                    tanggal: i.task.tanggal,
                    judul: i.task.judul,
                    deskripsi: i.task.deskripsi,
                    batas_waktu: i.task.batas_waktu,
                    dokumen_tugas: i.task.dokumen_tugas,
                    jenis: i.task.jenis,
                    guru: i.task.teacher.nama,
                    pelajaran: i.task.teacher.lesson.nama,
                    status: i.status,
                    data: {
                        deskripsi: i.deskripsi,
                        berkas: i.berkas,
                        tanggal: i.tanggal,
                        nilai: i.nilai
                    }
                }))
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function POST(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "siswa": {
                    const body = await request.formData()
                    const id = parseInt(body.get("id"))
                    const deskripsi = body.get("deskripsi")
                    const berkas = JSON.parse(body.getAll("berkas"))
                    let files = []

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
                        for (const file of berkas) {
                            if (typeof file === "string") {
                                files.push(file)
                                continue
                            }

                            const ext = path.extname(file.name)
                            const buffer = Buffer.from(await file.arrayBuffer())
                            const folder = path.join(process.cwd(), "public", "siswa", `${auth.message.nama}_${auth.message.id}`, `tugas`)

                            if (!fs.existsSync(folder)) {
                                fs.mkdirSync(folder, { recursive: true })
                            }

                            const name = `${tugas.teacher.lesson.nama} - ${tugas.judul}_${new Date().getTime()}${ext}`
                            const file_ = path.join(folder, name)
                            fs.writeFileSync(file_, buffer)

                            files.push(`${process.env.NEXT_PUBLIC_BASE_URL}/siswa/${auth.message.nama}_${auth.message.id}/tugas/${name}`)
                        }

                        if (id && deskripsi && files && (deskripsi != "" || files.length > 0)) {
                            const status = await prisma.status_tugas.update({
                                where: {
                                    siswa_tugas: {
                                        siswa: auth.message.id,
                                        tugas: id
                                    },
                                    status: {
                                        in: ["belum", "sudah"]
                                    }
                                },
                                data: {
                                    status: "sudah",
                                    deskripsi: deskripsi,
                                    berkas: files,
                                    tanggal: new Date()
                                }
                            })

                            if (status) {
                                output.error = false
                                output.message = "Tugas anda berhasil diserahkan"
                            }
                        }
                    }

                    break
                }

                case "guru": {
                    const body = await request.formData()
                    const judul = body.get("judul")
                    const deskripsi = body.get("deskripsi")
                    const batas_waktu = new Date(body.get("batas_waktu"))
                    // const jenis = body.get("jenis")
                    // const waktu_kuis = parseInt(body.get("waktu_kuis"))
                    // const soal_kuis = body.get("soal_kuis[]")
                    const dokumen_tugas = body.getAll("dokumen_tugas[]")
                    const kelas = body.getAll("kelas[]")
                    let files = []

                    if (judul && deskripsi && batas_waktu && kelas.length > 0 && dokumen_tugas.length > 0) {
                    // if (judul && batas_waktu && jenis && kelas.length > 0 && ((jenis == "submission" && dokumen_tugas.length > 0) || (jenis == "kuis" && waktu_kuis && soal_kuis.length > 0))) {
                        for (const file of dokumen_tugas) {
                            if (typeof file === "string") {
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

                        const siswa = await prisma.siswa.findMany({
                            where: {
                                kelas: {
                                    in: kelas
                                }
                            },
                            select: {
                                nisn: true
                            }
                        })

                        await prisma.tugas.create({
                            data: {
                                judul: judul,
                                deskripsi: deskripsi,
                                batas_waktu: batas_waktu,
                                jenis: "submission",
                                waktu_kuis: null,
                                soal_kuis: null,
                                dokumen_tugas: files,
                                tanggal: new Date(),
                                kelas: {
                                    connect: kelas.map(k => ({
                                        kode: k
                                    }))
                                },
                                teacher: {
                                    connect: {
                                        nip: auth.message.id
                                    }
                                },
                                status_tugas: {
                                    create: siswa.map(i => ({
                                        siswa: i.nisn,
                                        status: "belum"
                                    }))
                                }
                            }
                        })

                        output.error = false
                        output.message = "Tugas anda berhasil dibuat"
                    }
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