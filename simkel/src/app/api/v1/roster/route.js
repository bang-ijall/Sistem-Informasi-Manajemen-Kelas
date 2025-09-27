import prisma from "@/libs/prisma"
import { CheckAuth } from "../../utils.js"
import { select } from "@nextui-org/react";

const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export async function GET(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            let roster = null

            if (auth.message.role != "guru") {
                roster = await prisma.roster.findMany({
                    where: {
                        kelas: auth.message.kelas
                    },
                    select: {
                        hari: true,
                        jam_mulai: true,
                        jam_selesai: true,
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
            } else {
                roster = await prisma.roster.findMany({
                    where: {
                        guru: auth.message.id
                    },
                    select: {
                        hari: true,
                        jam_mulai: true,
                        jam_selesai: true,
                        class: {
                            select: {
                                nama: true
                            }
                        }
                    }
                })
            }

            if (roster.length > 0) {
                roster.sort((a, b) => {
                    const orderA = hari.indexOf(a.hari) !== -1 ? hari.indexOf(a.hari) : 99;
                    const orderB = hari.indexOf(b.hari) !== -1 ? hari.indexOf(b.hari) : 99;
                    if (orderA !== orderB) return orderA - orderB;

                    const timeA = a.jam_mulai.split(":").map(Number);
                    const timeB = b.jam_mulai.split(":").map(Number);
                    const minutesA = timeA[0] * 60 + timeA[1];
                    const minutesB = timeB[0] * 60 + timeB[1];
                    return minutesA - minutesB;
                });

                output.error = false
                output.message = "Berhasil mengambil data"

                if (auth.message.role != "guru") {
                    output.data = roster.map(i => ({
                        hari: i.hari,
                        jam_mulai: i.jam_mulai,
                        jam_selesai: i.jam_selesai,
                        guru: i.teacher.nama,
                        pelajaran: i.teacher.lesson.nama
                    }))
                } else {
                    output.data = roster.map(i => ({
                        hari: i.hari,
                        jam_mulai: i.jam_mulai,
                        jam_selesai: i.jam_selesai,
                        kelas: i.class.nama
                    }))
                }
            } else {
                output.message = "Tidak menemukan jadwal pelajaran anda"
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}