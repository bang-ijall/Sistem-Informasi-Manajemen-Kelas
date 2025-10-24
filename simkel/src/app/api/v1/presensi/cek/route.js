import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "@/app/api/utils"

export async function GET(request) {
    let output = getOutput()

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

                    const start = new Date();
                    start.setHours(0, 0, 0, 0);

                    const end = new Date();
                    end.setHours(23, 59, 59, 999);

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
                            id: true,
                            class: {
                                select: {
                                    siswa: {
                                        select: {
                                            nisn: true,
                                            nama: true
                                        }
                                    }
                                }
                            },
                            kehadiran: {
                                where: {
                                    tanggal: {
                                        gte: start,
                                        lte: end
                                    }
                                },
                                select: {
                                    id: true
                                }
                            }
                        }
                    })

                    if (roster && roster.kehadiran.length == 0) {
                        output.message = "Lakukan absensi terlebih dahulu"
                        output.data = {
                            roster: roster.id,
                            id: roster.class.siswa
                                .sort((a, b) => a.nama.localeCompare(b.nama))
                                .map(i => i.nisn),
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
        } else {
            output = auth
        }
    } catch (_) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}