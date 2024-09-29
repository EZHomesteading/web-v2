import StoreSettings from "./settings";

const Page = () => {
  const apiKey = process.env.MAPS_KEY;
  return apiKey ? <StoreSettings apiKey={apiKey} /> : <></>;
};

export default Page;
