import {
  Conversation,
  Message,
  Listing,
  User,
  Prisma,
  $Enums,
  Location,
} from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
  user: User & {
    locations: Location[];
  };
  location: Location;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};

export type FullListing = {
  createdAt: string;
  user: {
    createdAt: string;
    updatedAt: string;
    // emailVerified: boolean | false;
    id: string;
    name: string;
    email: string;
    firstName: string | null;
    phoneNumber: string | null;
    street: string | null;
    city: string | null;
    zip: string | null;
    state: string | null;
    location?: {
      type: "Point";
      coordinates: [number, number];
    };
    image: string | null;
    hoursOfOperation: Prisma.JsonValue;
    role: $Enums.UserRole;
    password: string | null;
    stripeAccountId: string | null;
    conversationIds: string[];
    seenMessageIds: string[];
    favoriteIds: string[];
    cartIds: string[];
    subscriptions: string | null;
  };
  id: string;
  title: string;
  species: string | null;
  category: string;
  subCategory: string;
  stock: number;
  quantityType: string;
  price: number;
  description: string;
  imageSrc: string;
  shelfLife: number;
  street: string;
  city: string;
  zip: string;
  state: string;
  location?: {
    type: "Point";
    coordinates: number[];
    address: string[];
  };
  coopRating: number | null;
  userId: string;
} | null;
