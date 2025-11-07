import Page from "./client"
import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export default async function Server() {
    const cookie = await cookies()
    const token = cookie.get("token")?.value

    if (!token) {
        redirect("/login")
    }

    let res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/roster`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    let body = await res.json()

    const roster = body.data
    const field = roster[Object.keys(roster)[0]] != null && roster[Object.keys(roster)[0]].length > 0 ? Object.keys(roster[Object.keys(roster)[0]][0]).filter((f) => f != "class" && f != "teacher" && f != "id") : []

    res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/kelas`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    body = await res.json()

    const kelas = body.data

    res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/guru`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    body = await res.json()

    const pelajaran = body.data

    return <Page roster={roster} kelas={kelas} pelajaran={pelajaran} field={field} />
}