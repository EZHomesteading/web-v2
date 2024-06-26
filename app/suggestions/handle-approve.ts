"use server";
import { Suggestion } from "@prisma/client";
//admin only suggestion page approve handler
import fs from "fs";
import path from "path";

export const handleApprove = (suggestion: Suggestion) => {
  const newProduct = {
    name: suggestion.name,
    category: suggestion.category,
    subCategory: suggestion.subCategory,
    photo: `/images/product-images/${suggestion.name
      .toLowerCase()
      .replace(/\s/g, "")}.webp`,
  };

  const productsFilePath = path.join(
    process.cwd(),
    "hooks",
    "listing",
    "products.js"
  );

  // Read the existing products from the file
  const existingProductsContent = fs.readFileSync(productsFilePath, "utf8");

  // Extract the products array from the file content
  const productsMatch = existingProductsContent.match(
    /export const products = (\[[\s\S]*?\])/
  );

  if (!productsMatch) {
    throw new Error("Products array not found in the file.");
  }

  const productsArrayString = productsMatch[1];
  const productsArray = eval(productsArrayString);

  // Append the new product to the products array
  const updatedProducts = [...productsArray, newProduct];

  // Generate the updated file content
  const updatedFileContent = `export const products = ${JSON.stringify(
    updatedProducts,
    null,
    2
  )}`;

  // Write the updated content back to the file
  fs.writeFileSync(productsFilePath, updatedFileContent, "utf8");
};
