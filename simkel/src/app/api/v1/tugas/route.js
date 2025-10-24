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
                case "siswa":
                case "wali": {
                    const status = await prisma.status_tugas.findMany({
                        where: {
                            siswa: auth.message.id
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
                            dokumen_tugas: i.task.dokumen_tugas,
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

                case "guru": {
                    const tugas = await prisma.tugas.findMany({
                        where: {
                            guru: auth.message.id
                        },
                        select: {
                            id: true,
                            judul: true,
                            deskripsi: true,
                            batas_waktu: true,
                            jenis: true,
                            waktu_kuis: true,
                            soal_kuis: true,
                            dokumen_tugas: true,
                            tanggal: true,
                            class: {
                                select: {
                                    nama: true
                                }
                            },
                            status_tugas: {
                                where: {
                                    status: {
                                        in: ["sudah", "dinilai"]
                                    }
                                },
                                select: {
                                    id: true,
                                    status: true,
                                    deskripsi: true,
                                    berkas: true,
                                    tanggal: true,
                                    nilai: true,
                                    student: {
                                        select: {
                                            nama: true,
                                            user: {
                                                select: {
                                                    foto: true
                                                }
                                            }
                                        }
                                    },
                                }
                            }
                        }
                    })

                    output.error = false

                    if (tugas.length > 0) {
                        output.message = "Berhasil mengambil data"

                        output.data = tugas.map((i) => ({
                            id: i.id,
                            judul: i.judul,
                            deskripsi: i.deskripsi,
                            batas_waktu: i.batas_waktu,
                            jenis: i.jenis,
                            waktu_kuis: i.waktu_kuis,
                            soal_kuis: i.soal_kuis,
                            dokumen_tugas: i.dokumen_tugas,
                            tanggal: i.tanggal,
                            kelas: i.class.nama,
                            siswa: i.status_tugas.map((j) => ({
                                id: j.id,
                                foto: j.student.user.foto,
                                nama: j.student.nama,
                                deskripsi: j.deskripsi,
                                berkas: j.berkas,
                                tanggal: j.tanggal,
                                nilai: j.nilai,
                                status: j.status
                            }))
                        }))
                    } else {
                        output.message = "Selama ini anda tidak memberikan tugas apapun"
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
                case "siswa": {
                    const body = await request.formData()
                    const id = parseInt(body.get("id"))
                    const deskripsi = body.get("deskripsi")
                    const berkas = body.getAll("berkas[]")
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
                        if (id > 0 && (deskripsi != "" || berkas.length > 0)) {
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

                            await prisma.status_tugas.update({
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

                            output.error = false
                            output.message = "Tugas anda berhasil diserahkan"
                        }
                    }

                    break
                }

                case "guru": {
                    const body = await request.formData()
                    const judul = body.get("judul")
                    const deskripsi = body.get("deskripsi")
                    const batas_waktu = new Date(body.get("batas_waktu"))
                    const dokumen_tugas = body.getAll("dokumen_tugas[]")
                    const kelas = body.getAll("kelas[]")
                    let files = []

                    if (judul != "" && batas_waktu != "" && kelas.length > 0 && (deskripsi != "" || dokumen_tugas.length > 0)) {
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

                        for (const item of kelas) {
                            const siswa = await prisma.siswa.findMany({
                                where: {
                                    kelas: item
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
                                    class: {
                                        connect: {
                                            kode: item
                                        }
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
                        }

                        output.error = false
                        output.message = "Tugas anda berhasil dibuat"
                    }
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