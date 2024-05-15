import getDisputes from "@/actions/getDisputes";
import DisputeComponent from "./dispute.client";

const DisputePage = async () => {
  const disputes = await getDisputes();
  return (
    <>
      <DisputeComponent disputes={disputes} />
    </>
  );
};

export default DisputePage;
