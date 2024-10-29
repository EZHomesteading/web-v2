import InfoTemplate from "@/app/(info_support_layout)/info/(components)/info-template";
const setOutTime = () => {
  return (
    <InfoTemplate
      title="What is Set out Time?"
      paragraphs={[
        "A set out time is the average time it takes a Co-Op to have an order ready after the order has been placed.",
        "This is used to set earliest possible pick-up times for users purchasing your products and is the value used to tell consumers how soon they can expect to be able to receive an order from your store.",
        "This feature protects sellers from being forced to have items ready in an unreasonable amount of time after the order has been placed.",
      ]}
    />
  );
};

export default setOutTime;
