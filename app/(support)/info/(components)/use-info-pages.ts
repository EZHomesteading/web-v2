const infoPages = [
  { name: "How EZH Works", href: "/info/how-ezh-works" },
  { name: "Co-op vs Producer", href: "/info/user/co-op-vs-producer" },
  { name: "Privacy Policy", href: "/info/privacy-policy" },
  { name: "Terms & Conditions", href: "/info/terms-and-conditions" },
  { name: "About Us", href: "/info/about-us" },
  { name: "Contact Us", href: "/info/contact-us" },
  { name: "Registration Guide", href: "/info/registration-guide" },
  { name: "Adding a Listing", href: "/info/adding-a-listing" },
  { name: "Refund Policy", href: "/info/refund-policy" },
  { name: "FAQs", href: "/info/general/faqs" },
  { name: "Community Guidelines", href: "/info/general/community-guidelines" },
  { name: "Customer Support", href: "/info/general/support" },
  {
    name: "Product Quality Standards",
    href: "/info/product-quality-standards",
  },
  {
    name: "Searching for Listings",
    href: "/info/how-to/listings/searching-for-listings",
  },
  {
    name: "Registration Options",
    href: "/info/specifics/user/registration-options",
  },
  { name: "Listing Guidelines", href: "/info/specifics/listing/guidelines" },
  {
    name: "How to Add a Listing Title",
    href: "/info/how-to/listing/add-title",
  },
  {
    name: "How to Add Listing Photos",
    href: "/info/how-to/listing/add-photos",
  },
  {
    name: "What Does Shelf Life Mean",
    href: "/info/specifics/listing/shelf-life",
  },
  {
    name: "What Does Minimum Order Mean",
    href: "/info/specifics/listing/min-order",
  },
  {
    name: "What Does Minimum Order Mean",
    href: "/info/specifics/listing/min-order",
  },
];

const formattedInfoPages = infoPages.map((infoPage) => ({
  value: infoPage.name,
  label: infoPage.name,
  href: infoPage.href,
}));

const useInfoPages = () => {
  const getAll = () => formattedInfoPages;

  const getByValue = (value: string) => {
    return formattedInfoPages.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useInfoPages;
