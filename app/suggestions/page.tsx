"use server";
import prisma from "@/lib/prisma";
import SuggestionClient from "./suggestion.client";
import { handleApprove } from "./handle-approve";
import { handleDeny } from "./handle-deny";

export const handleApproveWrapper = async (suggestion: any) => {
  const updatedProducts = await handleApprove(suggestion);
  return updatedProducts;
};

const SuggestionPage = async () => {
  const suggestions = await prisma.suggestion.findMany();

  return (
    <SuggestionClient
      suggestions={suggestions}
      handleApprove={handleApproveWrapper}
      handleDeny={handleDeny}
    />
  );
};

export default SuggestionPage;
