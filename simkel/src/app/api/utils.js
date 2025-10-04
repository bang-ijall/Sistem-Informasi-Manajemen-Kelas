import jwt from "jsonwebtoken"
import CryptoJS from "crypto-js";
import { toZonedTime } from "date-fns-tz";

function isAuthValid(req) {
    const authHeader = req.headers.get("authorization");

    if (authHeader) {
        const bearer = authHeader.split(" ")[0]

        if (bearer != "Bearer") {
            return null
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return null
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (err) {
            return null
        }
    }
}

export function CheckAuth(req) {
    const user = isAuthValid(req);

    if (!user) {
        return { error: true, message: "Unauthorization" };
    }

    return { error: false, message: user };
}

export function GetDatetime(date, zone) {
    return toZonedTime(date, zone)
}

export function getPassword(id, length = 12) {
    const hmac = CryptoJS.HmacSHA256(id, "SiSeko_Key");
    const pw = CryptoJS.enc.Base64.stringify(hmac)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return pw.slice(0, length);
}