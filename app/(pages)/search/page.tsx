import { listings } from "@/app/actions/getAllListings";
import Search from "./client";

const searchpage = () => {
  const formattedData = listings.map((listing) => ({
    value: listing.title,
  }));

  return (
    <>
      <Search data={formattedData} />
    </>
  );
};
export default searchpage;
