import { Hours, orderMethod, UserRole } from "@prisma/client"

declare module "wishlist" {
    interface WishlistItemListing {
        id:string,
        title:string,
        quantityType?:string,
        imageSrc?:string[],
        stock:number,
        price:number,
        minOrder:number,
        shelfLife:number,
        rating: number[]
        createdAt: Date
    }

    interface WishlistGroupLoc {
        id:string,
        displayName?:string,
        image?:string,
        type: orderMethod
        coordinates: number[]
        address: string[]
        hours?: Hours
        role: UserRole
        user: any
    }

}