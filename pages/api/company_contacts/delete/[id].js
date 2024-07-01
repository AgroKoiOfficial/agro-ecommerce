import { prisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).end();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.query;

    try {
        const contact = await prisma.companyContact.delete({
            where: {
                id
            }
        });
        return res.status(200).json(contact);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
