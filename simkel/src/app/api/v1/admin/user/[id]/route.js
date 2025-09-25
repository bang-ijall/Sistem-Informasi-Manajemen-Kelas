import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs/dist/bcrypt";
import CryptoJS from "crypto-js";

const output = {
    error: true,
    message: "Fetch failed",
};

function getPassword(id, length = 12) {
    const hmac = CryptoJS.HmacSHA256(id, "SiSeko_Key");
    const pw = CryptoJS.enc.Base64.stringify(hmac)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return pw.slice(0, length);
}

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        if (user) {
            output.error = false
            output.message = "Fetch success"
            output.data = user
        } else {
            output.message = "Fetch refused for some reason"
        }
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        body.password = await bcrypt.hash(getPassword(body.password), 12)

        const user = await prisma.user.update({
            where: { id: id },
            data: body,
        });

        if (user) {
            output.error = false
            output.message = "Fetch success"
            output.data = user
        } else {
            output.message = "Fetch refused for some reason"
        }
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}

export async function DELETE(request, { params }) {
    const { id } = await params;

    try {
        const user = await prisma.user.delete({
            where: { id: id },
        });

        output.error = false
        output.message = "Fetch success"
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}