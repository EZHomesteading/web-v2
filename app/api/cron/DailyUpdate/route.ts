import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
function filterHarvests(harvests: any[]) {
  const currentMonth = new Date().toLocaleString("default", { month: "short" });

  return harvests.filter(
    (harvest: any) =>
      (!harvest.harvestDates.includes(currentMonth) &&
        harvest.harvestType === "addMonthly") ||
      harvest.harvestType === "maxMonthly"
  );
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
          stock: true,
          harvestType: true,
          harvestDates: true,
          projectedStock: true,
        },
      });
      const filteredHarvests = filterHarvests(singleUserHarvestListings);
      if (!filteredHarvests[0]) {
        return;
      }

      filteredHarvests.map(async (harvestListing: any) => {
        if (harvestListing.harvestType === "addDaily") {
          await prisma.listing.update({
            where: { id: harvestListing.id },
            data: {
              stock: harvestListing.stock + harvestListing.projectedStock,
            },
          });
        } else {
          await prisma.listing.update({
            where: { id: harvestListing.id },
            data: {
              stock: harvestListing.projectedStock,
            },
          });
        }
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
