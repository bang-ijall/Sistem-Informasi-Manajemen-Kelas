import { CheckAuth, getOutput } from "@/app/api/utils";

export async function GET(request, { params }) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const { kode } = await params

                    let siswa = await prisma.siswa.findMany({
                        where: {
                            kelas: kode,
                        },
                        select: {
                            nama: true,
                            status_tugas: {
                                where: {
                                    task: {
                                        guru: auth.message.id,
                                        kelas: {
                                            some: {
                                                kode: kode
                                            }
                                        }
                                    }
                                },
                                select: {
                                    nilai: true,
                                    task: {
                                        select: {
                                            judul: true
                                        }
                                    }
                                }
                            }
                        }
                    })

                    siswa = siswa.sort((a, b) => a.nama.localeCompare(b.nama))
                    const nama = siswa.map(i => i.nama)
                    let nilai = {}

                    siswa.map(i => {
                        i.status_tugas.map(j => {
                            if (!nilai[j.task.judul]) {
                                nilai[j.task.judul] = Array(nama.length).fill(null)
                            }

                            const index = nama.indexOf(i.nama)
                            nilai[j.task.judul][index] = j.nilai
                        })
                    })

                    output.error = false
                    output.message = "Berhasil mengambil data"
                    output.data = {
                        siswa: nama,
                        nilai: Object.entries(nilai)
                            .sort(([a], [b]) => new Date(a) - new Date(b))
                            .map(([i, j]) => ({
                                judul: i,
                                nilai: j
                            }))
                    }
                    break
                }
            }
        } else {
            output = auth
        }
    } catch (_) {
        console.log(_)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}