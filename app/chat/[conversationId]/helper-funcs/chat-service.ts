import axios from "axios";
import { OrderStatus } from "@prisma/client";

interface UpdateOrderParams {
  orderId: string;
  status: OrderStatus;
  message?: string;
  pickupDate?: Date;
}

export const chatService = {
  async updateOrderStatus({ orderId, status, message, pickupDate }: UpdateOrderParams) {
    if (message) {
      await axios.post("/api/chat/messages", { 
        message,
        orderId,
        status 
      });
    }
    
    await axios.post("/api/useractions/checkout/update-order", {
      orderId,
      status,
      ...(pickupDate && { pickupDate })
    });
  },
  
  async uploadImage(orderId: string, imageUrl: string) {
    await axios.post("/api/chat/messages", {
      message: imageUrl,
      messageOrder: "img",
      orderId
    });
  }
};