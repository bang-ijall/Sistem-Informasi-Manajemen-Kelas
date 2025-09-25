import bcrypt from "bcryptjs"
import prisma from "@/libs/prisma"

const output = {
    error: true,
    message: "Fetch failed"
}

export async function GET() {
    try {
        var pelajaran = await prisma.pelajaran.findMany()

        if (pelajaran) {
            pelajaran = pelajaran.map((k, idx) => ({
                no: idx + 1,
                ...k,
            }));

            output.error = false
            output.message = "Fetch success"
            output.data = pelajaran
        } else {
            output.message = "Fetch refused for some reason"
        }
    } catch (error) {
        output.message = error.message
    }

    return Response.json(output)
}

export async function POST(request) {
    try {
        const body = await request.json();

        const pelajaran = await prisma.pelajaran.create({
            data: body
        });

        output.error = false
        output.message = "Fetch success"
        output.data = pelajaran
    } catch (error) {
        console.log(error)
        output.message = error.message;
    }

    return Response.json(output)
}