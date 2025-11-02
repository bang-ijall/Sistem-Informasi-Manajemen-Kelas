import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"
import fs from "fs"
import path from "path"

export async function GET(request, { params }) {
    let output = getOutput()
    let code = 200

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            const param = await params
            const id = param.id

            switch (auth.message.role) {
                case "siswa":
                case "wali": {
                    const status = await prisma.status_tugas.findMany({
                        where: {
                            siswa: auth.message.id,
                            status: id
                        },
                        select: {
                            id: true,
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
                                    waktu_kuis: true,
                                    soal_kuis: true,
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

                    if (status.length > 0) {
                        output.message = "Berhasil mengambil data"

                        output.data = status.map(i => ({
                            id: i.task.id,
                            tanggal: i.task.tanggal,
                            judul: i.task.judul,
                            deskripsi: i.task.deskripsi,
                            batas_waktu: i.task.batas_waktu,
                            berkas: i.task.dokumen_tugas,
                            waktu_kuis: i.task.waktu_kuis,
                            soal_kuis: i.task.soal_kuis.length,
                            jenis: i.task.jenis,
                            guru: i.task.teacher.nama,
                            pelajaran: i.task.teacher.lesson.nama,
                            status: i.status,
                            data: {
                                id: i.id,
                                deskripsi: i.deskripsi,
                                berkas: i.berkas,
                                tanggal: i.tanggal,
                                nilai: i.nilai
                            }
                        }))
                    } else {
                        output.message = "Tidak menemukan tugas anda"
                    }

                    break
                }
            }
        } else {
            output = auth
            code = 403
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
        code = 500
    }

    return Response.json(output, {
        status: code
    })
}

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
                                id: id,
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
                                    guru: auth.message.id
                                }
                            }
                        })

                        await prisma.tugas.delete({
                            where: {
                                id: id,
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