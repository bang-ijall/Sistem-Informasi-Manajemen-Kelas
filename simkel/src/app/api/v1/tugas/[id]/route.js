import prisma from "@/libs/prisma"
import { CheckAuth } from "../../../utils.js"
import { select } from "@nextui-org/react"

const output = {
    error: true,
    message: "Server kami menolak permintaan dari anda!"
}