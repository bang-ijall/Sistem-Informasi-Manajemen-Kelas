import bcrypt from "bcryptjs"
import prisma from "@/libs/prisma"

const output = {
    error: true,
    message: "Fetch failed"
}

export async function GET() {
    try {
        var kelas = await prisma.kelas.findMany()

        if (kelas && kelas.length > 0) {
            kelas = kelas.map((k, idx) => ({
                no: idx + 1,
                ...k,
            }));

            output.error = false
            output.message = "Fetch success"
            output.data = kelas
        } else {
            output.message = "Data kelas kosong"
        }
    } catch (error) {
        output.message = error.message
    }

    return Response.json(output)
}

export async function POST(request) {
    try {
        const body = await request.json();

        const kelas = await prisma.kelas.create({
            data: body
        });

        output.error = false
        output.message = "Fetch success"
        output.data = kelas
    } catch (error) {
        console.log(error)
        output.message = error.message;
    }

    return Response.json(output)
}