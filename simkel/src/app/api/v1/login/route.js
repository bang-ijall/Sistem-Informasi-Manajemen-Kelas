import bcrypt from "bcryptjs"
import prisma from "@/libs/prisma"
import jwt from "jsonwebtoken";
import { select } from "@nextui-org/react";

export async function POST(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const body = await request.text()
        const params = new URLSearchParams(body)

        const id = params.get("id")
        const password = params.get("password")
        const role = params.get("role")

        if (id && password && role) {
            const is_wali = role === "wali";

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    password: !is_wali,
                    old_password: is_wali,
                    foto: true,
                    role: true
                }
            });

            if (user) {
                const pw = is_wali ? user.old_password : user.password;
                const is_valid = await bcrypt.compare(password, pw);

                if (is_valid) {
                    let data = null

                    switch (role) {
                        case "siswa":
                        case "wali":
                            {
                                const today = new Date();
                                const day_name = today.toLocaleDateString("in", { weekday: "long" })
                                const lastWeek = new Date();
                                lastWeek.setDate(today.getDate() - 7);
                                const nextWeek = new Date();
                                nextWeek.setDate(today.getDate() + 7);

                                const siswa = await prisma.siswa.findUnique({
                                    where: {
                                        nisn: id
                                    },
                                    select: {
                                        nama: true,
                                        class: {
                                            select: {
                                                kode: true,
                                                nama: true,
                                                roster: {
                                                    select: {
                                                        id: true,
                                                        hari: true,
                                                        jam_mulai: true,
                                                        jam_selesai: true,
                                                        teacher: {
                                                            select: {
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
                                                }
                                            }
                                        },
                                        kehadiran: {
                                            where: {
                                                siswa: id,
                                                tanggal: {
                                                    gte: lastWeek,
                                                    lte: today
                                                }
                                            },
                                            select: {
                                                status: true
                                            }
                                        },
                                        status_tugas: {
                                            where: {
                                                siswa: id,
                                                status: "belum",
                                                task: {
                                                    batas_waktu: {
                                                        gte: today,
                                                        lte: nextWeek
                                                    }
                                                }
                                            }
                                        }
                                    }
                                })

                                if (siswa) {
                                    const pelajaran = []

                                    const token = jwt.sign({
                                        id: id,
                                        nama: siswa.nama,
                                        role: role,
                                        kelas: siswa.class.kode
                                    },
                                        process.env.JWT_SECRET,
                                        {
                                            expiresIn: "1d"
                                        })

                                    const total = siswa.kehadiran.length;
                                    const hadir = siswa.kehadiran.filter(k => k.status === "hadir").length;
                                    let presentase = 0;

                                    if (total > 0) {
                                        presentase = Math.round((hadir / total) * 100);
                                    }

                                    for (const r of siswa.class.roster) {
                                        const lesson = r.teacher.lesson;
                                        const exists = pelajaran.some(p => p.kode == lesson.kode);

                                        if (!exists) {
                                            pelajaran.push(lesson);
                                        }
                                    }

                                    data = {
                                        token: token,
                                        nama: siswa.nama,
                                        kelas: siswa.class.nama,
                                        foto: user.foto,
                                        role: role,
                                        kehadiran: presentase,
                                        tugas: siswa.status_tugas.length,
                                        pelajaran: pelajaran,
                                        roster: siswa.class.roster.filter(r => r.hari == day_name)
                                            .map(r => ({
                                                id: r.id,
                                                jam_mulai: r.jam_mulai,
                                                jam_selesai: r.jam_selesai,
                                                guru: r.teacher.nama,
                                                pelajaran: r.teacher.lesson.nama
                                            }))
                                    }
                                }

                                break
                            }
                        case "guru":
                            {
                                const today = new Date();
                                const day_name = today.toLocaleDateString("in", { weekday: "long" })

                                const guru = await prisma.guru.findUnique({
                                    where: {
                                        nip: id
                                    },
                                    select: {
                                        nama: true,
                                        class: {
                                            select: {
                                                kode: true,
                                                nama: true
                                            }
                                        },
                                        lesson: {
                                            select: {
                                                kode: true,
                                                nama: true
                                            }
                                        },
                                        roster: {
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
                                                }
                                            }
                                        }
                                    }
                                })

                                if (guru) {
                                    const kelas = []

                                    const token = jwt.sign({
                                        id: id,
                                        nama: guru.nama,
                                        role: role,
                                        kelas: guru.class ? guru.class.kode : null,
                                        pelajaran: guru.lesson.kode
                                    }, process.env.JWT_SECRET, {
                                        expiresIn: "1d"
                                    })

                                    for (const r of guru.roster) {
                                        const class_ = r.class;
                                        const exists = kelas.some(p => p.kode == class_.kode);

                                        if (!exists) {
                                            kelas.push(class_);
                                        }
                                    }

                                    data = {
                                        token: token,
                                        nama: guru.nama,
                                        pelajaran: guru.lesson.nama,
                                        wali: guru.class ? guru.class.nama : null,
                                        foto: user.foto,
                                        role: role,
                                        kelas: kelas,
                                        roster: guru.roster.filter(r => r.hari == day_name)
                                            .map(r => ({
                                                id: r.id,
                                                jam_mulai: r.jam_mulai,
                                                jam_selesai: r.jam_selesai,
                                                kelas: r.class.nama
                                            }))
                                    }
                                }

                                break
                            }
                    }

                    if (data) {
                        output.error = false
                        output.message = "Yey! Login berhasil"
                        output.data = data
                    } else {
                        output.message = "Duh kami tidak menemukan akun anda"
                    }
                } else {
                    output.message = "Username atau password anda salah"
                }
            } else {
                output.message = "Duh kami tidak menemukan akun anda"
            }
        }
    } catch (error) {
        console.log(error)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}