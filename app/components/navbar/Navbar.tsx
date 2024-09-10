//default navbar parent element
import { NavUser } from "@/actions/getUser";
import NavbarClient from "@/app/components/navbar/navbar.client"

interface p {
  user?: NavUser | null;
}

const apiKey = process.env.MAPS_KEY as string;

const Navbar = ({ user }: p) => {
  return (
    <NavbarClient user={user} apiKey={apiKey} /> 
  );
};

export default Navbar;
