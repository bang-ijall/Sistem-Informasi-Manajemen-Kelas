import Page from "./client"
import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export default async function Server() {
    const cookie = await cookies()
    const token = cookie.get("token")?.value

    if (!token) {
        redirect("/login")
    }

    let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/pelajaran`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    let body = await res.json()

    const pelajaran = body.data
    const field = pelajaran > 0 ? Object.keys(pelajaran[0]) : []

    return <Page pelajaran={pelajaran} field={field} />
}