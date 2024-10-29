import HowToTemplate from "@/app/(info_support_layout)/info/(components)/how-to.template";
const ezhOrganicRating = () => {
  return (
    <HowToTemplate
      title="What is the EZH Organic Rating"
      explanation="The EZHomesteading Organic rating, which is visible from the market, store, and listings pages, represents the methods of a seller's growing and harvesting.  EZHomesteading anonymously & arbitrarily purchases produce from both EZH Co-ops & Producers to test and verify the legitimacy of their certification and to maintain our commitment to fresh, local, & organic produce. Everytime a seller creates a listing for anything edible, they select all the qualities of growing that apply to said produce."
      subtitle="These Qualities Include..."
      paragraphs={[
        "This produce is not genetically modified",
        "This produce was not grown with inorganic fertilizers",
        "This produce was not grown with inorganic pestacides",
        "This produce was not modified after harvest",
      ]}
    />
  );
};

export default ezhOrganicRating;
