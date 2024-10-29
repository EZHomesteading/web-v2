import HowToTemplate from "@/app/(info_support_layout)/info/(components)/how-to.template";

const AddPhoto = () => {
  return (
    <HowToTemplate
      title="How to Add Listing Photos"
      explanation="The images of your listing determines what users are expecting to buy when they are looking at listings from the market and your store page. It is important that these photos are representative of your actual items for sale. This will determine if a user can approve or deny an order upon delivery or pick up. If you post photos of ripe produce, then someone picks them up and sees their actually spoiled, they will be allowed to file a dispute and they will likely win. The first image in the gallery for a listing will be the primary photo on the market and your store page. To add your own photos..."
      subtitle="Follow these steps"
      paragraphs={[
        "Register as a Co-op or Producer if you have not already",
        "Set up store hours or delivery hours depending on your role",
        "Click on the + icon in the top right corner of your screen on any page except the info section",
        "Fill out all of the info prior to the images step for listings",
        "If you want to keep the stock photo, simply click on either of the buttons that say Upload Image",
        "If you don't want to keep the stock photo, you can click on the red icon in the top right of the photo, then click Upload Image",
        "On mobile, you can then choose a photo from your files, photos, or take a photo",
      ]}
      image1="/images/how-to/addPhotosMobile.jpg"
      aspectRatio="phone"
    />
  );
};

export default AddPhoto;
