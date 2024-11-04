declare module "cart-types" {

    interface CartSellerGroup {
        sellerId: string;
        sellerName: string;
        sellerRole: UserRole;
        locationId: string;
        address: string[];
        items: CartItem[];
        
        // Timing related
        sodt: number;               // Seller's set out/delivery time
        earliestExpiry?: Date;      // Earliest expiry among items
        
        // Delivery/Pickup preferences
        deliveryPreference?: {
        method?: 'PICKUP' | 'DELIVERY';
        locationId?: string;      // Buyer's location ID if delivery
        preferredTime?: Date;
        };
        
        // Validation and status
        isValid: boolean;           // All items available, quantities valid, etc.
        validationMessage?: string;
    }
  
    interface CartItem  {
        id: string;
        quantity: number;
        listing: {
          id: string;
          title: string;
          price: number;
          reports: number;
          stock: number;
          SODT: number | null;
          quantityType: string | null;
          shelfLife: number;
          rating: number[];
          createdAt: string;
          location: {
            type: string;
            coordinates: number[];
            address: string[];
            hours: Availability;
          };
          imageSrc: string[];
          userId: string;
          subCategory: string;
          minOrder: number;
          user: {
            id: string;
            SODT: number | null;
            name: string;
            role: UserRole;
          };
        };
      };
}