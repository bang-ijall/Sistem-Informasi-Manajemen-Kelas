import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "../../utils.js"

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "siswa":
                case "wali": {
                    const kehadiran = await prisma.kehadiran.findMany({
                        where: {
                            siswa: auth.message.id
                        },
                        select: {
                            id: true,
                            tanggal: true,
                            status: true,
                            roster_: {
                                select: {
                                    id: true,
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
                            }
                        }
                    })

                    if (kehadiran.length > 0) {
                        output.error = false
                        output.message = "Berhasil mengambil data"

                        const grouped = kehadiran.reduce((data, k) => {
                            const id = k.roster_.id
                            const nama = k.roster_.teacher.lesson.nama

                            if (!data[id]) {
                                data[id] = {
                                    id: id,
                                    roster: nama,
                                    total: 0,
                                    hadir: 0,
                                    absen: 0,
                                    izin: 0
                                }
                            }

                            data[id].total++

                            switch (k.status) {
                                case "hadir":
                                    data[id].hadir++
                                    break
                                case "no_hadir":
                                    data[id].absen++
                                    break
                                case "izin":
                                    data[id].izin++
                                    break
                            }

                            return data
                        }, {})

                        output.data = Object.values(grouped)
                    } else {
                        output.message = "Selama ini catatan kehadiran Anda tidak ada"
                    }

                    break
                }
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        console.error(error.message)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function POST(request) {
    const output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const body = await request.formData()
                    const id = body.get("id")
                    const data = JSON.parse(body.getAll("data"))

                    if (id && data.length > 0) {
                        const now = new Date()

                        const hari = new Intl.DateTimeFormat("id-ID", {
                            weekday: "long"
                        }).format(now)

                        const jam = new Intl.DateTimeFormat("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit"
                        }).format(now).replace(".", ":")

                        const roster = await prisma.roster.findFirst({
                            where: {
                                id: id,
                                hari: hari,
                                jam_mulai: {
                                    lte: jam
                                },
                                jam_selesai: {
                                    gte: jam
                                }
                            }
                        })

                        if (roster) {
                            
                        }
                    }

                    break
                }
            }
        }
    } catch (_) {
        console.log(_)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}