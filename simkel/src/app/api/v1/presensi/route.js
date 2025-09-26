import prisma from "@/libs/prisma"
import { CheckAuth } from "../auth/auth.js"
import { select } from "@nextui-org/react"

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role != "guru") {
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