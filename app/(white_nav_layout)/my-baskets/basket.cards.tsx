import React from "react";
import Link from "next/link";

interface BasketCardProps {
  basket: {
    id: string;
    items: Array<{
      listing: {
        imageSrc: string[];
      };
    }>;
    location: {
      displayName?: string;
      user: {
        name: string;
      };
    };
  };
}

const BasketCard = ({ basket }: BasketCardProps) => {
  const { id, items, location } = basket;
  const images = items.map((item) => item.listing.imageSrc[0]).slice(0, 9);

  const layoutConfigs = {
    1: {
      containerStyle: "grid-cols-1 grid-rows-1",
      imageStyles: ["w-full h-full"],
    },
    2: {
      containerStyle: "grid-rows-2 grid-cols-1",
      imageStyles: ["w-full h-ful"],
    },
    3: {
      containerStyle: "grid-cols-2 grid-rows-2",
      imageStyles: [
        "w-full h-full col-span-2",
        "w-full h-full",
        "w-full h-full",
      ],
    },
    4: {
      containerStyle: "grid-cols-2 grid-rows-2",
      imageStyles: ["w-full h-full"],
    },
    5: {
      containerStyle: "grid-cols-2 grid-rows-3",
      imageStyles: [
        "w-full h-full col-span-2",
        "w-full h-full",
        "w-full h-full",
        "w-full h-full",
        "w-full h-full",
      ],
    },
    6: {
      containerStyle: "grid-cols-2 grid-rows-3",
      imageStyles: ["w-full h-full"],
    },
    7: {
      containerStyle: "grid-cols-3 grid-rows-3",
      imageStyles: [
        "w-full h-full col-span-3",
        "w-full h-full",
        "w-full h-full",
        "w-full h-full",
        "w-full h-full",
      ],
    },
    8: {
      containerStyle: "grid-cols-2 grid-rows-4",
      imageStyles: ["w-full h-full "],
    },
    9: {
      containerStyle: "grid-cols-3 grid-rows-3",
      imageStyles: ["w-full h-full"],
    },
  };

  const config =
    layoutConfigs[images.length as keyof typeof layoutConfigs] ||
    layoutConfigs[1];

  return (
    <Link href={`/basket/${id}`} className="max-w-[300px]">
      <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-md transition-shadow duration-200">
        <div className="relative w-full  pt-[100%]">
          <div
            className={`absolute top-0 left-0 w-full h-full grid gap-1 p-1 ${config.containerStyle}`}
          >
            {images.map((src, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg ${
                  config.imageStyles[index]
                } 
                  ${index === 0 && images.length === 3 ? "col-span-2" : ""}`}
              >
                <img
                  src={src}
                  alt={`Basket item ${index + 1}`}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
      <div className="pl-1 font-medium text-sm text-start">
        {location.displayName || location.user.name}
        <div className={`text-neutral-700 font-light mt-[-5px] text-xs`}>
          {items.length} saved
        </div>
      </div>
    </Link>
  );
};

export default BasketCard;
