//action to get listings based on search params in the market pages.
import mongoose from "mongoose";
import Fuse from "fuse.js";
import { UserRole } from "@prisma/client";
import { currentUser } from "@/lib/auth";
import { LocationEZH } from "@/next-auth";
import connectMongoose from "@/lib/mongoose";

// Interface for defining the search parameters
type sort = "htl" | "lth" | "1" | "2" | "3" | "4" | "5";

export type FinalListing = {
  id: string;
  title: string;
  price: number;
  stock: number;
  rating: number[];
  reports: number;
  SODT: number | null;
  quantityType: string | null;
  shelfLife: number;
  harvestFeatures: boolean;
  projectedStock: number;
  harvestDates: string[];
  createdAt: string;
  location: LocationEZH;
  keyWords: string[];
  imageSrc: string[];
  userId: string;
  subCategory: string;
  minOrder: number | null;
  review: boolean | null;
  user: {
    id: string;
    SODT: number | null;
    name: string;
    role: UserRole;
  };
};
export type FinalListing1 = {
  id: string;
  title: string;
  price: number;
  stock: number;
  rating: number[];
  quantityType: string | null;
  createdAt: string;
  location: LocationEZH;
  keyWords: string[];
  imageSrc: string[];
  subCategory: string;
  minOrder: number | null;
  review: boolean | null;
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
};

// Main function to fetch listings based on search parameters
const GetMarket = async (
  params: IListingsParams,
  page: number,
  perPage: number
) => {
    console.log("Starting GetListingsMarket function");

    const connection = await connectMongoose();
    console.log("Mongoose connection state:", mongoose.connection.readyState); 
    if (connection) {
      console.log("Connected to MongoDB:", connection?.connection?.db?.databaseName);
    }
  
    const collections = await connection?.connection?.db?.listCollections().toArray();
    console.log("Collections found in the database:", collections?.map(col => col.name));
  
    const user = await currentUser();
    console.log("Current user:", user);
  try {

    const { lat, lng, radius, q, pm, c, p, s, ra, pr, cat, subcat } = params;
    console.log("Search parameters:", params);

    let query: any = {};
    if (subcat) {
      query.subCategory = subcat;
      console.log("Filtering by subCategory:", subcat);
    }
    if (cat) {
      query.category = cat;
      console.log("Filtering by category:", cat);
    }

    // Connect to MongoDB using Mongoose for geospatial querying
    const ListingModel = mongoose.models.Listing 
    // || mongoose.model(
    //     "Listing",
    //     new mongoose.Schema({
    //       title: String,
    //       quantityType: String,
    //       subCategory: String,
    //       category: String,
    //       price: Number,
    //       keyWords: [String],
    //       imageSrc: [String],
    //       minOrder: Number,
    //       createdAt: Date,
    //       rating: [Number],
    //       stock: Number,
    //       description: String,
    //       location: {
    //         type: {
    //           type: String,
    //           enum: ["Point"],
    //           required: true,
    //         },
    //         coordinates: {
    //           type: [Number],
    //           required: true,
    //         },
    //       },
    //       review: Boolean,
    //       user: {
    //         id: String,
    //         role: String,
    //         name: String,
    //       },
    //     }),
    //     "listings" // Explicitly set the collection name here
    //   );
    const allListings = await ListingModel.find().exec();
    console.log("All listings found:", allListings.length)
    // Build Mongoose query
    if (!user || user?.role === UserRole.CONSUMER) {
      query["user.role"] = UserRole.COOP;
      console.log("User is consumer or not logged in, filtering by COOP role");
    } else if (user?.role === UserRole.COOP || user?.role === UserRole.PRODUCER || user?.role === UserRole.ADMIN) {
      if (c === "t" && p === "t") {
        query["user.role"] = { $in: [UserRole.COOP, UserRole.PRODUCER] };
        console.log("User is COOP, PRODUCER, or ADMIN, filtering by COOP and PRODUCER roles");
      } else if (c === "t") {
        query["user.role"] = UserRole.COOP;
        console.log("Filtering by COOP role");
      } else if (p === "t") {
        query["user.role"] = UserRole.PRODUCER;
        console.log("Filtering by PRODUCER role");
      }
    }

    if (s === "f") {
      query.stock = { $lt: 1 };
      console.log("Filtering by stock less than 1");
    } else {
      query.stock = { $gt: 0 };
      console.log("Filtering by stock greater than 0");
    }

    if (lat && lng && radius) {
      query.location = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], parseFloat(radius) / 6378.1],
        },
      };
      console.log("Filtering by geospatial location with lat, lng, radius:", lat, lng, radius);
    }

    console.log("Final query:", JSON.stringify(query));

    // Execute Mongoose query
    let listings = await ListingModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    console.log("Listings found:", listings.length);

    // If a search query is provided, filter listings by title, description, etc.
    if (q) {
      console.log("Applying Fuse.js search with query:", q);
      const fuseOptions = {
        includeScore: true,
        keys: [
          "user.name",
          "title",
          "category",
          "subCategory",
          "description",
          "keyWords",
        ],
        threshold: 0.3,
      };
      const fuse = new Fuse(listings, fuseOptions);
      const results = fuse.search(q);
      listings = results.map((result) => result.item);
      console.log("Listings after Fuse.js search:", listings.length);
    }

    // Sort by rating or price if applicable
    if (ra) {
      console.log("Sorting by rating with option:", ra);
      const sort = ra as sort;
      function sortByArrayLength(arr: FinalListing1[], ascending = true) {
        return arr.sort((a, b) => {
          let lengthA = a.rating.length;
          let lengthB = b.rating.length;
          return ascending ? lengthA - lengthB : lengthB - lengthA;
        });
      }
      function showOnlyNumber(arr: FinalListing1[], targetLength: number) {
        return arr.filter((item) => item.rating.length === targetLength);
      }

      if (sort === "htl") {
        listings = sortByArrayLength(listings, false);
        console.log("Sorted listings by rating (high to low)");
      }
      if (sort === "lth") {
        listings = sortByArrayLength(listings);
        console.log("Sorted listings by rating (low to high)");
      }
      if (sort === "1") {
        listings = showOnlyNumber(listings, 1);
        console.log("Filtered listings with rating length 1");
      }
      if (sort === "2") {
        listings = showOnlyNumber(listings, 2);
        console.log("Filtered listings with rating length 2");
      }
      if (sort === "3") {
        listings = showOnlyNumber(listings, 3);
        console.log("Filtered listings with rating length 3");
      }
      if (sort === "4") {
        listings = showOnlyNumber(listings, 4);
        console.log("Filtered listings with rating length 4");
      }
      if (sort === "5") {
        listings = showOnlyNumber(listings, 5);
        console.log("Filtered listings with rating length 5");
      }
    }

    if (pr) {
      console.log("Sorting by price with option:", pr);
      const sort = pr as sort;
      function sortByArrayPrice(arr: FinalListing1[], ascending = true) {
        return arr.sort((a, b) => {
          let lengthA = a.price;
          let lengthB = b.price;
          return ascending ? lengthA - lengthB : lengthB - lengthA;
        });
      }
      if (sort === "htl") {
        listings = sortByArrayPrice(listings, false);
        console.log("Sorted listings by price (high to low)");
      } else {
        listings = sortByArrayPrice(listings);
        console.log("Sorted listings by price (low to high)");
      }
    }

    // Convert createdAt dates to ISO strings
    const safeListings = listings.map((Listing) => {
      return {
        ...Listing,
        createdAt: Listing.createdAt.toISOString(),
      };
    });
    console.log("Final listings to return:", safeListings.length);
    return { listings: safeListings, totalItems: listings.length };
  } catch (error: any) {
    console.error("Error in GetListingsMarket:", error);
    throw new Error(error);
  }
};
export default GetMarket
export interface IListingsParams {
  lat?: string;
  lng?: string;
  q?: string;
  ra?: string;
  radius?: string;
  pm?: string;
  c?: string;
  p?: string;
  s?: string;
  pr?: string;
  cat?: string;
  subcat?: string;
}
