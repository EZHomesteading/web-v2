import HowToTemplate from "@/app/(info_support_layout)/info/(components)/how-to.template";

const Page = () => {
  return (
    <HowToTemplate
      title="How to Reenable Location Permissions"
      explanation="EZHomesteading requests your location to show listings near you, giving you a smoother and smiplier experience. We will never sell your data or use it maliciously. When you allow EZH to use your location, it is a permission saved onto your device, we do not save your device's location under any circumstances."
      subtitle="To Reenable Location Permissions After You've Denied Them..."
      paragraphs={[
        "Click on the i icon to the left of the url",
        "Change the location permission to can ask",
        "Reload the site",
        "When EZH asks to use your location again, click allow",
      ]}
    />
  );
};

export default Page;
