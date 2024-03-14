//import getListings, { IListingsParams } from "@/app/actions/getListings";
import Search from "./client";
//import { listingValue } from "@/app/components/client/SearchClientName";
import { listings } from "@/app/actions/getAllListings";

const SearchPage = () => {
  const formattedData = listings.map((listing) => ({
    value: listing.title,
  }));
  return (
    <>
      <Search data={formattedData} />
    </>
  );
};

export default SearchPage;
