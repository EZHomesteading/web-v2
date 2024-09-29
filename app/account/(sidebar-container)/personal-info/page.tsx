//display followers parent element

import ClientOnly from "@/app/components/client/ClientOnly";

import Page from "./client";

const SettingPage = async () => {
  const apiKey = process.env.MAPS_KEY as string;

  return (
    <ClientOnly>
      <Page apiKey={apiKey} />
    </ClientOnly>
  );
};

export default SettingPage;
