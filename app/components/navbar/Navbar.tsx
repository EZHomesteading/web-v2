import { SafeUser } from "@/app/types";

import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import FindListingsComponent from "@/app/components/listings/search-listings";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

// Navbar component
const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  return (
    // Render the navbar with fixed position, white background, and shadow
    <div className="relative w-full z-10 shadow-sm">
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
            <FindListingsComponent />
            {/* UserMenu component */}

            <UserMenu currentUser={currentUser} />
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
