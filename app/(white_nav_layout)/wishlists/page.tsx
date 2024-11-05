import { currentUser } from "@/lib/auth";
import WishlistCard from "./wishlists.cards";
import { getActiveWishlists } from "@/actions/wishlist/get/active";
import { outfitFont } from "@/components/fonts";

export interface Wishlist {
  id: string;
  createdAt: Date;
  items: {
    listing: {
      imageSrc: string[];
    };
  }[];
  location: {
    displayName?: string;
    image?: string;
    user: {
      name: string;
      image?: string;
    };
  };
}

const WishlistPage = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const response = await getActiveWishlists();
  const { wishlists } = response;
  // const wishlists = [
  //   {
  //     id: "67292f15ac8d532985db19b4",
  //     createdAt: "2024-11-04T20:31:17.331Z",
  //     items: [
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //     ],
  //     location: {
  //       displayName: null,
  //       image: null,
  //       user: { name: "coopTest", image: null },
  //     },
  //   },
  //   {
  //     id: "67292f27ac8d532985db19b7",
  //     createdAt: "2024-11-04T20:31:35.907Z",
  //     items: [
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //     ],
  //     location: {
  //       displayName: null,
  //       image: null,
  //       user: { name: "coopTest3", image: null },
  //     },
  //   },
  //   {
  //     id: "67292f27ac8d532985db19b7",
  //     createdAt: "2024-11-04T20:31:35.907Z",
  //     items: [
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //     ],
  //     location: {
  //       displayName: null,
  //       image: null,
  //       user: { name: "coopTest3", image: null },
  //     },
  //   },
  //   {
  //     id: "67292f27ac8d532985db19b7",
  //     createdAt: "2024-11-04T20:31:35.907Z",
  //     items: [
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //     ],
  //     location: {
  //       displayName: null,
  //       image: null,
  //       user: { name: "coopTest3", image: null },
  //     },
  //   },
  //   {
  //     id: "67292f27ac8d532985db19b7",
  //     createdAt: "2024-11-04T20:31:35.907Z",
  //     items: [
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },

  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //     ],
  //     location: {
  //       displayName: null,
  //       image: null,
  //       user: { name: "coopTest3", image: null },
  //     },
  //   },
  //   {
  //     id: "67292f27ac8d532985db19b7",
  //     createdAt: "2024-11-04T20:31:35.907Z",
  //     items: [
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },

  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //     ],
  //     location: {
  //       displayName: null,
  //       image: null,
  //       user: { name: "coopTest3", image: null },
  //     },
  //   },
  //   {
  //     id: "67292f27ac8d532985db19b7",
  //     createdAt: "2024-11-04T20:31:35.907Z",
  //     items: [
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //     ],
  //     location: {
  //       displayName: null,
  //       image: null,
  //       user: { name: "coopTest3", image: null },
  //     },
  //   },
  //   {
  //     id: "67292f27ac8d532985db19b7",
  //     createdAt: "2024-11-04T20:31:35.907Z",
  //     items: [
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },

  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //     ],
  //     location: {
  //       displayName: null,
  //       image: null,
  //       user: { name: "coopTest3", image: null },
  //     },
  //   },
  //   {
  //     id: "67292f27ac8d532985db19b7",
  //     createdAt: "2024-11-04T20:31:35.907Z",
  //     items: [
  //       {
  //         listing: {
  //           imageSrc: ["/images/product-images/beefsteak-tomato.webp"],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },

  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },

  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //       {
  //         listing: {
  //           imageSrc: [
  //             "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
  //           ],
  //         },
  //       },
  //     ],
  //     location: {
  //       displayName: null,
  //       image: null,
  //       user: { name: "coopTest3", image: null },
  //     },
  //   },
  // ];

  return (
    <div
      className={`${outfitFont.className} px-2 sm:px-8 md:px-16 lg:px-24 2xl:px-32 pt-6 max-w-screen-2xl mx-auto`}
    >
      <div className={`text-4xl font-medium pb-6`}>Wishlists</div>
      <div
        className={`grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4  w-full`}
      >
        {wishlists.map((wishlist: Wishlist) => (
          <WishlistCard wishlist={wishlist} key={wishlist.id} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
