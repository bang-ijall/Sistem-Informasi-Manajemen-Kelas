import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "../../../utils.js"

export async function GET(request, { params }) {
    const output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    output.error = false

                    let now = new Date()

                    const hari = new Intl.DateTimeFormat("id-ID", {
                        weekday: "long"
                    }).format(now)

                    const jam = new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }).format(now).replace(".", ":")
                    console.log(hari, jam)

                    const roster = await prisma.roster.findFirst({
                        where: {
                            guru: auth.message.id,
                            hari: hari,
                            jam_mulai: {
                                lte: jam
                            },
                            jam_selesai: {
                                gte: jam
                            }
                        },
                        select: {
                            class: {
                                select: {
                                    siswa: {
                                        select: {
                                            nama: true
                                        }
                                    }
                                }
                            }
                        }
                    })

                    if (roster) {
                        output.message = "Lakukan absensi terlebih dahulu"
                        output.data = {
                            siswa: roster.class.siswa
                                .sort((a, b) => a.nama.localeCompare(b.nama))
                                .map(i => i.nama)
                        }
                    } else {
                        output.message = "Kamu sedang diluar jadwal ngajar"
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