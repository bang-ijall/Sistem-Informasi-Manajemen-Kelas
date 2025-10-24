import Page from "./client"
import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export default async function Server() {
    const cookie = await cookies()
    const token = cookie.get("token")?.value

    if (!token) {
        redirect("/login")
    }

    let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/guru`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    let body = await res.json()

    if (body.error) {
        redirect("/login")
    }

    const guru = body.data
    const field = Object.keys(body.data[0]).filter((f) => f != "class" && f != "lesson")

    res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/kelas`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    body = await res.json()

    const kelas = body.data

    res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/pelajaran`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    body = await res.json()

    const pelajaran = body.data

    return <Page guru={guru} kelas={kelas} pelajaran={pelajaran} field={field} />
}