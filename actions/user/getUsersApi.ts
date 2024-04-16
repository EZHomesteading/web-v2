import prisma from "@/lib/prismadb";
import haversine from "haversine-distance";
import Fuse from "fuse.js";
import { currentUser } from "@/lib/auth";

interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IUsersParams {
  lat?: string;
  lng?: string;
  location?: ILocation;
  q?: string;
  radius?: string;
}

export default async function GetUsers(
  params: IUsersParams,
  page: number,
  perPage: number
) {
  try {
    const { lat, lng, radius, q } = params;

    let query: any = {};

    let Users = await prisma.user.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        listings: true,
      },
    });

    if (lat && lng && radius) {
      const UserLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      };

      const radiusInMeters = parseFloat(radius) * 1000;

      Users = Users.filter((user) => {
        const userLocation = user.location as unknown as {
          coordinates: [number, number];
        };
        const userCoordinates = {
          latitude: userLocation.coordinates[1],
          longitude: userLocation.coordinates[0],
        };

        const distance = haversine(userCoordinates, UserLocation);
        return distance <= radiusInMeters;
      });
    }
    const User = await currentUser();
    if (User?.role === "PRODUCER") {
      const fuseOptions = { keys: ["User.role"], threshold: 0.3 };
      const fuse = new Fuse(Users, fuseOptions);
      const results = fuse.search("coop");
      Users = results.map((result) => result.item);
      //remove producer Users from users array.
    }
    if (User?.role === "CONSUMER") {
      const fuseOptions = { keys: ["User.role"], threshold: 0.3 };
      const fuse = new Fuse(Users, fuseOptions);
      const results = fuse.search("coop");
      Users = results.map((result) => result.item);
      //remove producer Users from users array.
    }
    if (q) {
      const fuseOptions = {
        keys: ["User.name", "User.role"],
        threshold: 0.3,
      };
      const fuse = new Fuse(Users, fuseOptions);
      const results = fuse.search(q);
      Users = results.map((result) => result.item);
    }

    const totalItems = Users.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = Users.slice(startIndex, endIndex);

    const safeUsers = paginatedUsers.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    }));

    return { Users: safeUsers, totalItems };
  } catch (error: any) {
    throw new Error(error);
  }
}
