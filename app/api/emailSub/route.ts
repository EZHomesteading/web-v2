//update listings with list of emails subscribed to send notifications when stock is updated.
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getListingById from "@/actions/listing/getListingById";

export async function POST(request: Request) {
  function containsString(arr: any, str: any) {
    return arr.some((item: any) => item === str);
  }
  const body = await request.json();

  const { id, email } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });
  const listingId = id;
  const oldlisting = await getListingById({ listingId });
  if (!oldlisting) {
    return NextResponse.error();
  }
  if (oldlisting.emailList === null) {
    const listing = await prisma.listing.update({
      where: { id: id },
      data: {
        emailList: { list: [email] },
      },
    });

    return NextResponse.json(listing);
  } else {
    const oldArray = oldlisting?.emailList?.list;
    if (containsString(oldArray, email)) {
      return NextResponse.json(
        { error: "that email is already subscribed." },
        { status: 400 }
      );
    }
    const newEmailList = [...oldArray, email];
    const listing = await prisma.listing.update({
      where: { id: id },
      data: {
        emailList: { list: newEmailList },
      },
    });

    return NextResponse.json(listing);
  }
}
