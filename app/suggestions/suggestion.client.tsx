"use client";
//admin only suggestion page
import { useCurrentRole } from "@/hooks/user/use-current-role";
import { UserRole } from "@prisma/client";
import { Card, CardContent } from "../components/ui/card";
import useProducts from "@/hooks/listing/use-product";

interface p {
  suggestions: any;
  handleApprove: any;
  handleDeny: any;
}

const SuggestionClient = ({ suggestions, handleApprove, handleDeny }: p) => {
  const { getAll, setProducts } = useProducts();
  const products = getAll();
  const role = useCurrentRole();

  const handleApproveClick = async (suggestion: any) => {
    const updatedProducts = await handleApprove(suggestion);
    // Update the products state
    setProducts(updatedProducts);
  };

  const handleDenyClick = async (suggestionId: string) => {
    await handleDeny(suggestionId);
    // Optionally, you can refresh the suggestions list after denial
    // by making an API call or updating the state
  };

  return (
    <>
      {role === UserRole.ADMIN ? (
        <>
          {suggestions.map((suggestion: any, index: number) => (
            <Card key={index}>
              <CardContent>
                <div>
                  {JSON.stringify({
                    name: suggestion.name,
                    category: suggestion.category,
                    subCategory: suggestion.subCategory,
                    photo: `/images/product-images/${suggestion.name
                      .toLowerCase()
                      .replace(/\s/g, "")}.webp`,
                  })}
                </div>
                <button onClick={() => handleApproveClick(suggestion)}>
                  Approve
                </button>
                <button onClick={() => handleDenyClick(suggestion.id)}>
                  Deny
                </button>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <div className="bg-black text-white h-screen flex justify-center items-center">
          Admin Page
        </div>
      )}
    </>
  );
};

export default SuggestionClient;
