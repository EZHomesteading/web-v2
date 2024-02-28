// Import necessary components and types
import { SafeUser } from "@/app/types";

import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { ModeToggle } from "../ui/mode-toggle";

// Define props interface for the Navbar component
interface NavbarProps {
  // Current user data or null if no user is logged in
  currentUser?: SafeUser | null;
}

// Navbar component
const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  return (
    // Render the navbar with fixed position, white background, and shadow
    <div className="fixed w-full z-10 shadow-sm">
      <div
        className="
          py-4 
          border-b-[1px]
        "
      >
        {/* Container to control the width of navbar content */}
        <Container>
          {/* Flex container to align items and provide gap */}
          <div
            className="
              flex 
              flex-row 
              items-center 
              justify-between
              gap-3
              md:gap-0
            "
          >
            {/* Logo component */}
            <Logo />

            {/* Search component */}
            <Search />
            {/* UserMenu component */}
            <div className="flex items-center justify-end">
              <div className="mr-2">
                <UserMenu currentUser={currentUser} />
              </div>
              <ModeToggle />
            </div>
          </div>
        </Container>
      </div>
      {/* Categories component */}
      <Categories />
    </div>
  );
};

// Export the Navbar component
export default Navbar;
