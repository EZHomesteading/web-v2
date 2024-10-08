import { UserRole } from "@prisma/client";

export function formatDateTime(dateTime: Date | null | undefined, userRole: UserRole): string {
    if (!dateTime) {
      return userRole === UserRole.COOP 
        ? "No Pickup Time Set" 
        : "No Delivery Time Set";
    }
  
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const dayOfWeek = days[dateTime.getDay()];
    const month = months[dateTime.getMonth()];
    const day = dateTime.getDate();
    let hours = dateTime.getHours();
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
  
    return `${dayOfWeek} ${month} ${day}, ${hours}:${minutes}${ampm}`;
  }