import prisma from "@/libs/prisma"
import { CheckAuth } from "../../../utils.js"
import { select } from "@nextui-org/react"

export async function POST(request) {
    const output = {
        error: true,
        message: "Server kami menolak permintaan dari anda!"
    }

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            if (auth.message.role != "wali") {
                const body = await req.formData()
                const id = body.get("id")
                const type = body.get("type")
                const file = body.get("file")

                if (file) {
                    switch (auth.message.role) {
                        case "siswa":
                            break
                    }
                }
            }
        } else {
            return Response.json(auth)
        }
    } catch (error) {
        console.error(error)
        output.message = "Ada masalah pada server kami. Silahkan coba lagi nanti"
    }

    return Response.json(output)
}