import { Hours, orderMethod, proposedLoc, UserRole } from "@prisma/client"

declare module "wishlist" {
    // in use in /api/wishlist/get/unique and /wishlist/[id]
    interface Wishlist_ID_Page { 
        id: string;
        proposedLoc?: proposedLoc | null;
        pickupDate?: Date
        deliveryDate?: Date
        orderMethod: orderMethod
        items: {
          quantity:number,
          price:number,
          listing: {
            id:string
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
            url?: string;
            name: string;
          };
        };
      }
    interface Wishlist_Selected_Time_Type extends Wishlist_ID_Page {
      selected_time_type: string | null
    }
}