import InfoTemplate from "@/app/(info_support_layout)/info/(components)/info-template";
const deliveryTime = () => {
  return (
    <InfoTemplate
      title="What is Delivery Time?"
      paragraphs={[
        "A delivery time is the average time it takes a Producer to have an order in a vehicle and on the way to the buyer, after the order has been placed.",
        "This is used to set earliest possible Delivery times for users purchasing your products, and is the value used to tell buyers how soon they can expect their order to be en-route to their location.",
        "This feature protects sellers from having to deliver items in an unreasonable amount of time after the order has been placed.",
      ]}
    />
  );
};

export default deliveryTime;
