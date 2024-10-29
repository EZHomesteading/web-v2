import HowToTemplate from "@/app/(info_support_layout)/info/(components)/how-to.template";

const AddListingTitle = () => {
  return (
    <HowToTemplate
      title="How to Add a Listing Title"
      explanation="The title of your listing determines what users are expecting to buy when they are searching and looking at listings. In an attempt to optimize our search algorithmn, we have create a set number of possible listings for you to choose from. To choose from one of these options..."
      subtitle="Follow these steps"
      paragraphs={[
        "Register as a Co-op or Producer if you have not already",
        "Set up store hours or delivery hours depending on your role",
        "Click on the + icon in the top right corner of your screen on any page except the info section",
        "Click inside of the input that says Enter A Product Name",
        "Search for whatever your trying to add and then fill out the rest of the info",
        "If you can't find the name of the product you're trying to add in the drop down, consider changing the wording",
        "If you still can't find it, you can press on the Suggest A New Listing Button on the first step of the create a listing page and send us a request",
      ]}
      image1="/images/how-to/addTitle.jpg"
    />
  );
};

export default AddListingTitle;
