"use server";
//admin only suggestion page parent element
import prisma from "@/lib/prisma";
import SuggestionClient from "./suggestion.client";
import { handleApprove } from "./handle-approve";
import { handleDeny } from "./handle-deny";
import { Suggestion } from "@prisma/client";

export const handleApproveWrapper = async (suggestion: Suggestion) => {
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
