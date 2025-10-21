import { CheckAuth, getOutput } from "@/app/api/utils";

export async function PATCH(request, { params }) {
    let output = getOutput()

    try {
        const auth = CheckAuth(request)

        if (!auth.error) {
            switch (auth.message.role) {
                case "guru": {
                    const body = await request.formData()
                    const { id } = await params
                    const judul = body.get("judul")
                    const deskripsi = body.get("deskripsi")
                    const modul = body.getAll("modul[]")
                    const kelas = body.get("kelas")

                    if (parseInt(id) > 0 && judul != "" && deskripsi != "" && modul.length > 0 && kelas != "") {
                        
                    }

                    break
                }
            }
        }
    }
}