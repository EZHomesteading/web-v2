import { outfitFont } from "@/components/fonts";

const WishlistPage = () => {
  return (
    <div className={`${outfitFont.className} px-8 pt-6`}>
      <div className={`text-2xl font-medium`}>Wishlists</div>
      <div className={`grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}>
        <div className={`aspect-square rounded border`}></div>
        <div className={`aspect-sqaure rounded border`}></div>
      </div>
    </div>
  );
};

export default WishlistPage;
