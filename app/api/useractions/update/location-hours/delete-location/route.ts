import { currentUser } from "@/lib/auth"
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request:Request) {
    try {
        const body = await request.json()
        const locationId = body.locationId
        const user = await currentUser()
        if (!user) {
            return Response.json("Unauthorized")
        }
        const deletedListing = await prisma.location.delete({
           where:
            {
                id : locationId
            }
        })
        return NextResponse.json(deletedListing)
    } catch (error) {
        console.error(error)
    }
}