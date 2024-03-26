"use client";

import { UserInfoPage } from "@/app/components/user-info";
import { useCurrentUser } from "@/app/hooks/use-current-user";

const ClientPage = () => {
  const user = useCurrentUser();

  return <UserInfoPage label="📱 Client component" user={user} />;
};

export default ClientPage;
