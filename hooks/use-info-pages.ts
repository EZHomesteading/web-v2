const infoPages = [
  { name: "How EZH Works", href: "/info/how-ezh-works" },
  { name: "Co-op vs Producer", href: "/info/co-op-vs-producer" },
  { name: "Privacy Policy", href: "/info/privacy-policy" },
  { name: "Terms & Conditions", href: "/info/terms-and-conditions" },
  { name: "About Us", href: "/info/about-us" },
  { name: "Contact Us", href: "/info/contact-us" },
  { name: "Registration Guide", href: "/info/registration-guide" },
  { name: "Adding a Listing", href: "/info/adding-a-listing" },
  { name: "Refund Policy", href: "/info/refund-policy" },
  { name: "FAQs", href: "/info/faqs" },
  { name: "User Guide", href: "/info/user-guide" },
  { name: "Community Guidelines", href: "/info/community-guidelines" },
  { name: "Payment Methods", href: "/info/payment-methods" },
  { name: "Customer Support", href: "/info/customer-support" },
  {
    name: "Product Quality Standards",
    href: "/info/product-quality-standards",
  },
  { name: "Searching for Listings", href: "/info/searching-for-listings" },
  { name: "Contacting a Co-op", href: "/info/contacting-a-co-op" },
  { name: "Registration Options", href: "/info/registration-options" },
  { name: "Listing Guidelines", href: "/info/listing-guidelines" },
  {
    name: "Co-op & Producer Verification Process",
    href: "/info/co-op-verification",
  },
  { name: "Producer Support Resources", href: "/info/producer-support" },
  {
    name: "Sustainability Practices",
    href: "/info/sustainability-practices",
  },
  {
    name: "Producer Spotlights",
    href: "/info/farmer-spotlights",
  },
  {
    name: "Local Food Movement",
    href: "/info/local-food-movement",
  },
  {
    name: "EZH Organic Certification",
    href: "/info/organic-certification",
  },
  {
    name: "Seasonal Produce Guide",
    href: "/info/seasonal-produce-guide",
  },

  {
    name: "Community Events",
    href: "/info/community-events",
  },
  {
    name: "Food Waste Reduction",
    href: "/info/food-waste-reduction",
  },
  {
    name: "Regenerative Agriculture",
    href: "/info/regenerative-agriculture",
  },
  {
    name: "Food Safety Standards",
    href: "/info/food-safety-standards",
  },
  {
    name: "Careers at EZHomesteading",
    href: "/info/careers-at-ezhomesteading",
  },

  {
    name: "Social Responsibility",
    href: "/info/social-responsibility",
  },
  {
    name: "Environmental Impact",
    href: "/info/environmental-impact",
  },
  {
    name: "Affiliate Program",
    href: "/info/affiliate-program",
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
