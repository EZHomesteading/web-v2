import getListings, { IListingsParams } from "@/app/actions/getListings";
import SearchModal from "./client";

interface HomeProps {
  searchParams: IListingsParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  const listings = await getListings(searchParams);
  const formattedData = listings.map((listing) => ({
    value: listing.title,
    cat: listing.subCategory,
    category: listing.category,
  }));
  return (
    <>
      <SearchModal data={formattedData} />
    </>
  );
};

export default Home;
