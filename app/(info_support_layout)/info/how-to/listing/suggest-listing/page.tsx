import HowToTemplate from "@/app/(info_support_layout)/info/(components)/how-to.template";
const ezhOrganicRating = () => {
  return (
    <HowToTemplate
      title="How to Suggest A Listing"
      explanation="We have a set number of listing titles because each of these has a unique set of subcategories and description to improve search results for buyers and sellers. This means that we can't add everything users might want to list because we simply don't know everything people will want to list. However, it is very easy to suggest a listing, and we generally respond to these requests within one day."
      subtitle="To Suggest a Listing..."
      paragraphs={[
        "From the first step of the create a listing page, click on the button labeled Suggest a Listing",
        "Please enter the exact name of the produce or other item you'd like to add, Ex: Beefsteak Tomato, not Tomato",
        "Under sub-category, please enter the general type of produce or other item it is. For example the subcategory for a Fuji Apple is Fruit",
        "Lastly, please enter a brief description of keywords so we know what the item is, for example Fuji Apple would say Red Apple Fruit Seeds Grows on Tree, and whatever other information you think is important",
      ]}
    />
  );
};

export default ezhOrganicRating;
