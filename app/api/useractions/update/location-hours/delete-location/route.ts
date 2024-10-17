import { currentUser } from "@/lib/auth"
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request:Request) {
    try {
        const body = await request.json()
        console.log(body)
        const { locationId } = body as {
            locationId:string
        }
        if (!locationId) {
            return NextResponse.json({ error: "Location ID is required" }, { status: 400 });
        }
        console.log(locationId)
        const user = await currentUser()
        if (!user) {
            return Response.json("Unauthorized")
        }
        const deletedListing = await prisma.location.delete({
           where:
            {id : locationId}
        })
        return NextResponse.json(deletedListing)
    } catch (error) {
        console.error(error)
    }
}