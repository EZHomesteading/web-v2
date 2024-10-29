
declare module "location-types" {
interface LocationObj  {
    type: string;
    coordinates: float[];
    address: string[];
    hours: Hours?;
    role: UserRole;
    isDefault: boolean?;
  }
}