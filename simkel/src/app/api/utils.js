import jwt from "jsonwebtoken";
import { formatInTimeZone } from "date-fns-tz"

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
    if (zone == "UTC") {
        return formatInTimeZone(date, zone, "yyyy-MM-dd'T'HH:mm:ss.SSS")
    } else {
        return formatInTimeZone(date, zone, "yyyy-MM-dd HH:mm:ss")
    }
}