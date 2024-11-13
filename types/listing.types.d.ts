import { UserRole } from "@prisma/client";

declare module "listing-types" {
  type ListingSlug = {
    title: string;
    id: string;
    description: string;
    imageSrc: string;
    shelfLife: string | null;
    stock: number;
    quantityType?: string;
    price: number;
    rating: number[];
    user: {
      id: string;
      name: string;
      createdAt: Date;
      emailVerified: boolean | null;
      role: UserRole;
      url?: string | null;
    };
    location: {
      id: string;
      hours?: {
        date: Date;
        capacity: number | null;
        timeSlots: { open: number; close: number }[];
      } | null;
      address: string;
      coordinates?: number[];
    };
  };
}
