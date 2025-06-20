import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
function filterHarvests(harvests: any[]) {
  const currentMonth = new Date().toLocaleString("default", { month: "short" });

  return harvests.filter(
    (harvest: any) =>
      !harvest.harvestDates.includes(currentMonth) || harvest.harvestType
  );
}
function pluralizeQuantityType(quantity: number, type: string) {
  if (quantity === 1) {
    return type;
  }

  switch (type.toLowerCase()) {
    case "lb":
      return "lbs";
    case "oz":
      return "oz";
    case "pint":
    case "quart":
    case "gallon":
    case "bushel":
    case "peck":
    case "crate":
    case "basket":
    case "bag":
    case "box":
    case "bunch":
      return type + "s";
    case "dozen":
      return "dozen";
    case "each":
      return "each";
    case "none":
      return "";
    default:
      return type;
  }
}
export async function GET(request: Request) {
  // Verify the request is from your cron service
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.CRON_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let usersWithProjHarvest = await prisma.listing.findMany({
      where: {
        harvestFeatures: true,
      },
      select: {
        userId: true,
      },
    });
    const uniqueUserIds = [
      ...new Set(usersWithProjHarvest.map((user) => user.userId)),
    ];
    //console.log(usersWithProjHarvest);
    //console.log(uniqueUserIds);
    uniqueUserIds.map(async (userId) => {
      let singleUserHarvestListings = await prisma.listing.findMany({
        where: {
          userId: userId,
          harvestFeatures: true,
        },
        select: {
          id: true,
          userId: true,
          title: true,
          harvestType: true,
          harvestDates: true,
          projectedStock: true,
          quantityType: true,
        },
      });
      const filteredHarvests = filterHarvests(singleUserHarvestListings);
      if (!filteredHarvests[0]) {
        return;
      }
      const newConversation = await prisma.conversation.create({
        data: {
          participantIds: [
            filteredHarvests[0].userId,
            "66fc429f3f6c8d3180c628f0",
          ],
        },
      });
      filteredHarvests.map(async (harvestListing: any) => {
        const newMessage = await prisma.message.create({
          include: {
            sender: true,
          },
          data: {
            body: `Your listing "${harvestListing.title}" is set to have ${
              harvestListing.projectedStock
            } ${pluralizeQuantityType(
              harvestListing.projectedStock,
              harvestListing.quantityType
            )} available this month. Please select an option.`,
            messageOrder: "HARVEST",
            listingId: harvestListing.id,
            conversation: {
              connect: { id: newConversation.id },
            },
            sender: {
              connect: { id: "66fc429f3f6c8d3180c628f0" },
            },
            seen: false,
          },
        });
      });

      //console.log(filteredHarvests);
    });

    return NextResponse.json(
      { message: "Cron job completed successfully" },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
