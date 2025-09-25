import prisma from "@/libs/prisma";

const output = {
  error: true,
  message: "Fetch failed",
};

export async function GET(request, { params }) {
  const { nisn } = await params;

  try {
    const siswa = await prisma.siswa.findUnique({
      where: { nisn: nisn },
    });

    if (siswa) {
      output.error = false
      output.message = "Fetch success"
      output.data = siswa
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
    const { nisn } = await params;
    const body = await request.json();

    const siswa = await prisma.siswa.update({
      where: { nisn: nisn },
      data: body,
    });

    if (siswa) {
      output.error = false
      output.message = "Fetch success"
      output.data = siswa
    } else {
      output.message = "Fetch refused for some reason"
    }
  } catch (error) {
    output.message = error.message;
  }

  return Response.json(output)
}

export async function DELETE(request, { params }) {
  const { nisn } = await params;

  try {
    const siswa = await prisma.siswa.delete({
      where: { nisn: nisn },
    });

    output.error = false
    output.message = "Fetch success"
  } catch (error) {
    output.message = error.message;
  }

  return Response.json(output)
}