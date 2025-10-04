import { CheckAuth } from "@/app/api/utils"
import prisma from "@/libs/prisma"

const hariUrut = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

const output = {
    error: true,
    message: "Fetch failed"
}

function parseJam(jam) {
    const [h, m] = jam.split(":").map(Number)
    return h * 60 + m
}

export async function GET(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            const roster = await prisma.roster.findMany({
                select: {
                    id: true,
                    hari: true,
                    jam_mulai: true,
                    jam_selesai: true,
                    class: {
                        select: {
                            kode: true,
                            nama: true
                        }
                    },
                    teacher: {
                        select: {
                            nip: true,
                            nama: true,
                            lesson: {
                                select: {
                                    kode: true,
                                    nama: true
                                }
                            }
                        }
                    }
                }
            })

            roster.sort((a, b) => {
                const hariA = hariUrut.indexOf(a.hari || "")
                const hariB = hariUrut.indexOf(b.hari || "")
                if (hariA !== hariB) return hariA - hariB

                const kelas = a.class.kode.localeCompare(b.class.kode)
                if (kelas !== 0) return kelas

                return parseJam(a.jam_mulai) - parseJam(b.jam_mulai)
            })

            const data = roster.reduce((data, i) => {
                const kelas = i.class.nama

                if (!data[kelas]) {
                    data[kelas] = []
                }

                data[kelas].push({
                    id: i.id,
                    class: i.class.kode,
                    kelas: i.class.nama,
                    teacher: i.teacher.nip,
                    guru: i.teacher.nama,
                    pelajaran: i.teacher.lesson.nama,
                    hari: i.hari,
                    jam_mulai: i.jam_mulai,
                    jam_selesai: i.jam_selesai
                })

                return data
            }, {})


            output.error = false
            output.message = "Fetch success"
            output.data = data
        } else {
            output.message = auth.message
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}

export async function POST(request) {
    try {
        const auth = CheckAuth(request)

        if (!auth.error && auth.message.role == "admin") {
            const body = await request.formData()
            const hari = body.get("hari")
            const kelas = body.get("kelas")
            const jamMulai = body.get("jam_mulai")
            const jamSelesai = body.get("jam_selesai")

            const roster = await prisma.roster.findFirst({
                where: {
                    hari: hari,
                    class: {
                        kode: kelas
                    },
                    AND: [{
                        jam_mulai: {
                            lt: jamSelesai
                        }
                    }, {
                        jam_selesai: {
                            gt: jamMulai
                        }
                    }]
                },
                select: {
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
            })

            if (!roster) {
                await prisma.roster.create({
                    data: {
                        hari: body.get("hari"),
                        jam_mulai: body.get("jam_mulai"),
                        jam_selesai: body.get("jam_selesai"),
                        class: {
                            connect: {
                                kode: body.get("kelas")
                            }
                        },
                        teacher: {
                            connect: {
                                nip: body.get("pelajaran")
                            }
                        }
                    }
                })

                output.error = false
                output.message = "Berhasil menambahkan data"
            } else {
                output.message = `Gagal menambahkan roster akibat bentrok dengan pelajaran ${roster.teacher.lesson.nama} - ${roster.teacher.nama}`
            }
        } else {
            output.message = auth.message
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}