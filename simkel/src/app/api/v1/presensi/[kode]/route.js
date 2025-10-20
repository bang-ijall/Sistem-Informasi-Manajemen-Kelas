import prisma from "@/libs/prisma"
import { CheckAuth, getOutput } from "../../../utils.js"

export async function GET(request, { params }) {
    const output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const { kode } = await params

                    let siswa = await prisma.siswa.findMany({
                        where: {
                            kelas: kode
                        },
                        select: {
                            nama: true,
                            kehadiran: {
                                where: {
                                    roster_: {
                                        guru: auth.message.id,
                                        kelas: kode
                                    }
                                },
                                select: {
                                    tanggal: true,
                                    status: true
                                }
                            }
                        }
                    })

                    if (siswa.length > 0) {
                        output.error = false
                        output.message = "Berhasil mengambil data"

                        siswa = siswa.sort((a, b) => a.nama.localeCompare(b.nama))
                        const nama = siswa.map(i => i.nama)
                        let kehadiran = {}

                        siswa.map(i => {
                            i.kehadiran.map(j => {
                                const tanggal = new Date(j.tanggal).toLocaleDateString("id-ID")

                                if (!kehadiran[tanggal]) {
                                    kehadiran[tanggal] = Array(nama.length).fill(null)
                                }

                                const index = nama.indexOf(i.nama)
                                kehadiran[tanggal][index] = j.status
                            })
                        })

                        output.data = {
                            siswa: nama,
                            kehadiran: Object.entries(kehadiran)
                            .sort(([a], [b]) => new Date(a) - new Date(b))
                            .map(([i, j]) => ({
                                tanggal: i,
                                status: j
                            }))
                        }
                    } else {
                        output.message = "Catatan kehadiran pada kelas ini belum ada"
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