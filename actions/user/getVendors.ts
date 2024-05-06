import prisma from "@/lib/prismadb";
import haversine from "haversine-distance";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IvendorsParams {
  lat?: string;
  lng?: string;
  location?: ILocation;
  q?: string;
  radius?: string;
}

export default async function GetVendors(
  params: IvendorsParams,
  page: number,
  perPage: number
) {
  try {
    const { lat, lng, radius, q } = params;

    let query: any = {};

    let vendors = await prisma.user.findMany({
      where: {
        NOT: {
          role: UserRole.CONSUMER,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        listings: true,
      },
    });
    if (lat && lng && radius) {
      const userLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };

      const radiusInMeters = parseFloat(radius) * 1000;

      vendors = vendors.filter((vendor) => {
        const vendorLocation = vendor.location as unknown as {
          coordinates: [number, number];
        };
        const vendorCoordinates = {
          latitude: vendorLocation.coordinates[1],
          longitude: vendorLocation.coordinates[0],
        };

        const distance = haversine(vendorCoordinates, userLocation);
        console.log("distance:", distance);
        return distance <= radiusInMeters;
      });
    }
    const user = await currentUser();
    // if (user?.role === "PRODUCER") {
    //   const fuseOptions = { keys: ["vendor.role"], threshold: 0.3 };
    //   const fuse = new Fuse(vendors, fuseOptions);
    //   const results = fuse.search("coop");
    //   vendors = results.map((result) => result.item);
    //   //remove producer vendors from users array.
    // }
    // if (user?.role === "CONSUMER") {
    //   const fuseOptions = { keys: ["vendor.role"], threshold: 0 };
    //   const fuse = new Fuse(vendors, fuseOptions);
    //   const results = fuse.search("coop");
    //   vendors = results.map((result) => result.item);
    //   //remove producer vendors from users array.
    // }
    // if (q) {
    //   const fuseOptions = {
    //     keys: ["vendor.name", "vendor.role"],
    //     threshold: 0.3,
    //   };
    //   const fuse = new Fuse(vendors, fuseOptions);
    //   const results = fuse.search(q);
    //   vendors = results.map((result) => result.item);
    // }

    const totalvendors = vendors.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedvendors = vendors.slice(startIndex, endIndex);

    const safevendors = paginatedvendors.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));
    return { vendors: safevendors, totalvendors };
  } catch (error: any) {
    throw new Error(error);
  }
}
