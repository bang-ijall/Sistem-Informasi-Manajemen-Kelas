import bcrypt from "bcryptjs"
import prisma from "@/libs/prisma"

export async function POST(request) {
    const output = {
        error: true,
        message: "Fetch failed"
    }

    try {
        const request_data = await request.formData()
        const role = request_data.get("role")
        const [day, month, year] = request_data.get("tanggal_lahir").split("-").map(Number)
        const tanggal_lahir = new Date(Date.UTC(year, month - 1, day))
        const password = `${day}${month}${year}`
        const password_hash = await bcrypt.hash(password, 10)

        if (role == "siswa") {
            const nisn = request_data.get("nisn")
            const kelas = await prisma.kelas.findMany({
                where: {
                    nama: request_data.get("kelas")
                }
            })

            if (kelas.length == 1) {
                const id_kelas = kelas[0].id

                await prisma.siswa.create({
                    data: {
                        nisn: nisn,
                        nama: request_data.get("nama"),
                        tanggal_lahir: tanggal_lahir,
                        hp: request_data.get("hp"),
                        tahun_masuk: request_data.get("tahun_masuk"),
                        kelas: id_kelas,
                        nama_wali: request_data.get("nama_wali"),
                        hp_wali: request_data.get("hp_wali"),
                    }
                })

                await prisma.user.create({
                    data: {
                        username: nisn,
                        password: password_hash,
                        role: role
                    }
                })
    
                output.error = false
                output.message = "Data `siswa` berhasil ditambahkan."
            } else {
                output.message = "Data `kelas` tidak ditemukan."
            }
        } else if (role == "guru") {
            var id_kelas = null
            const nip = request_data.get("nip")

            if (request_data.get("kelas")) {
                const kelas = request_data.get("kelas")
                const kelas_db = await prisma.kelas.findMany({
                    where: {
                        nama: kelas
                    }
                })
    
                if (kelas_db.length == 1) {
                    id_kelas = kelas_db[0].id
                } else {
                    output.message = "Data `kelas` tidak ditemukan."
                }
            }

            await prisma.guru.create({
                data: {
                    nip: request_data.get("nip"),
                    nama: request_data.get("nama"),
                    hp: request_data.get("hp"),
                    kelas: id_kelas,
                    tanggal_lahir: tanggal_lahir,
                }
            })

            await prisma.user.create({
                data: {
                    username: nip,
                    password: password_hash,
                    role: role
                }
            })

            output.error = false
            // output.message = "Data `guru` berhasil ditambahkan."
            output.message = password
        }
    } catch (error) {
        if (error.code === "P2002") {
            output.message = "Data `siswa` tidak boleh duplikat."
        } else if (error.code === "P2025") {
            output.message = "Data tidak ditemukan."
        } else if (error.code) {
            output.message = "Kesalahan database."
        } else {
            output.message = "Error: " + error.message
        }
    }

    return Response.json(output)
}