import bcrypt from "bcryptjs"
import prisma from "@/libs/prisma"
import CryptoJS from "crypto-js";

const output = {
    error: true,
    message: "Fetch failed"
}

function getPassword(id, length = 12) {
    const hmac = CryptoJS.HmacSHA256(id, "SiSeko_Key");
    const pw = CryptoJS.enc.Base64.stringify(hmac)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return pw.slice(0, length);
}

export async function GET() {
    try {
        const user = await prisma.user.findMany({
            select: {
                id: true,
                role: true,
            }
        });

        if (user && user.length > 0) {
            output.error = false
            output.message = "Fetch success"
            output.data = user
        } else {
            output.message = "Data user kosong"
        }
    } catch (error) {
        output.message = error.message
    }

    return Response.json(output)
}

export async function POST(request) {
    try {
        const body = await request.json();
        body.password = await bcrypt.hash(getPassword(body.id), 12);
        body.old_password = body.password

        const user = await prisma.user.create({
            data: body
        });

        output.error = false
        output.message = "Fetch success"
        output.data = user
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}