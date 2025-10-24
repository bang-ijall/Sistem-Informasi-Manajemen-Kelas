import Page from "./client"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Server() {
    const cookie = await cookies()
    const token = cookie.get("token")?.value

    if (!token) {
        redirect("/login")
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    const body = await res.json()

    if (body.error) {
        redirect("/login")
    }

    return <Page data={body.data} />
}