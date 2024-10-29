import InfoTemplate from "@/app/(info_support_layout)/info/(components)/info-template";
const minOrder = () => {
  return (
    <InfoTemplate
      title="What is a Minimum Order"
      paragraphs={[
        "A minimum order prevents buyers from purchasing so little of what an EZH Co-op or Producer has in stock that they end up losing money on the transaciton.",
        "This is especially important for producers, who generally want to sell all of their proudce at once, or atleast in large quantities because they do not want to sell like co-ops.",
        "Given the units a seller has set, the minimum order acts as a threshold of purchase. So if Johnny Producer is selling 25 lbs of apples at $2 a pound with a minimum order of 5, a Co-op must buy atleast 5 lbs or $10 worth. This same logic applies to EZH buyers purchasing from Co-ops.",
      ]}
    />
  );
};

export default minOrder;
