"use client";

import { useSearchParams } from "next/navigation";

const ResetPasswordPage = () => {
  const params = useSearchParams();
  console.log(params);
  return <></>;
};

export default ResetPasswordPage;
