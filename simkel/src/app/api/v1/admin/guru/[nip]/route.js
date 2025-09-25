import prisma from "@/libs/prisma";

const output = {
    error: true,
    message: "Fetch failed",
};

export async function GET(request, { params }) {
    const { nip } = await params;

    try {
        const guru = await prisma.guru.findUnique({
            where: { nip: nip },
        });

        if (guru) {
            output.error = false
            output.message = "Fetch success"
            output.data = guru
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
        const { nip } = await params;
        const body = await request.json();

        const guru = await prisma.guru.update({
            where: { nip: nip },
            data: body,
        });

        if (guru) {
            output.error = false
            output.message = "Fetch success"
            output.data = guru
        } else {
            output.message = "Fetch refused for some reason"
        }
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}

export async function DELETE(request, { params }) {
    const { nip } = await params;

    try {
        const guru = await prisma.guru.delete({
            where: { nip: nip },
        });

        output.error = false
        output.message = "Fetch success"
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}