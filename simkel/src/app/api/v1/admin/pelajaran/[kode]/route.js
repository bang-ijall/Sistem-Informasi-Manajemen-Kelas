import prisma from "@/libs/prisma";

const output = {
    error: true,
    message: "Fetch failed",
};

export async function GET(request, { params }) {
    const { kode } = await params;

    try {
        const pelajaran = await prisma.pelajaran.findUnique({
            where: { kode: kode },
        });

        if (pelajaran) {
            output.error = false
            output.message = "Fetch success"
            output.data = pelajaran
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
        const { kode } = await params;
        const body = await request.json();

        const pelajaran = await prisma.pelajaran.update({
            where: { kode: kode },
            data: body,
        });

        if (pelajaran) {
            output.error = false
            output.message = "Fetch success"
            output.data = pelajaran
        } else {
            output.message = "Fetch refused for some reason"
        }
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}

export async function DELETE(request, { params }) {
    const { kode } = await params;

    try {
        const pelajaran = await prisma.pelajaran.delete({
            where: { kode: kode },
        });

        output.error = false
        output.message = "Fetch success"
    } catch (error) {
        output.message = error.message;
    }

    return Response.json(output)
}