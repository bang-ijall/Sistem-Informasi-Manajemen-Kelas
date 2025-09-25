import prisma from "@/libs/prisma";

const output = {
  error: true,
  message: "Fetch failed",
};

export async function GET(request, { params }) {
  var { id } = await params;
  id = parseInt(id, 10)

  try {
    const roster = await prisma.roster.findUnique({
      where: { id: id },
    });

    if (roster) {
      output.error = false
      output.message = "Fetch success"
      output.data = roster
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
    var { id } = await params;
    id = parseInt(id, 10)
    const body = await request.json();

    const roster = await prisma.roster.update({
      where: { id: id },
      data: body,
    });

    if (roster) {
      output.error = false
      output.message = "Fetch success"
      output.data = roster
    } else {
      output.message = "Fetch refused for some reason"
    }
  } catch (error) {
    output.message = error.message;
  }

  return Response.json(output)
}

export async function DELETE(request, { params }) {
  var { id } = await params;
  id = parseInt(id, 10)

  try {
    await prisma.roster.delete({
      where: { id: id },
    });

    output.error = false
    output.message = "Fetch success"
  } catch (error) {
    output.message = error.message;
  }

  return Response.json(output)
}