import {
  basket_time_type,
  Hours,
  orderMethod,
  proposedLoc,
  UserRole,
} from "@prisma/client";

declare module "basket" {
  // in use in /api/basket/get/unique and /basket/[id]
  interface Basket_ID_Page {
    id: string;
    proposedLoc?: proposedLoc | null;
    pickupDate: Date | null;
    deliveryDate: Date | null;
    orderMethod: orderMethod;
    time_type: basket_time_type;
    items: {
      quantity: number;
      price: number;
      listing: {
        id: string;
        title: string;
        quantityType: string;
        imageSrc: string[];
        stock: number;
        price: number;
        minOrder: number;
        shelfLife: string;
        rating: number[];
        createdAt: Date;
      };
    }[];
    location: {
      id: string;
      displayName: string;
      image: string | null;
      type: string;
      coordinates: number[] | null;
      address: string[] | null;
      hours: Hours;
      role: UserRole;
      user: {
        id: string;
        url?: string;
        name: string;
      };
    };
  }
  interface Basket_Selected_Time_Type extends Basket_ID_Page {
    selected_time_type: string | null;
  }
}
