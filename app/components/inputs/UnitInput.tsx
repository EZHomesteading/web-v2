"use client";
//category selector input component
interface UnitBoxProps {
  label: string; // Label for the category
  selected?: boolean; // Optional prop indicating if the category is selected
  onClick: (value: string) => void; // Function to handle click event
}

const CategoryBox: React.FC<UnitBoxProps> = ({
  label, // Label received as prop
  selected, // Optional prop indicating if the category is selected
  onClick, // Function to handle click event received as prop
}) => {
  return (
    <div
      onClick={() => onClick(label)} // Handling click event by invoking onClick function with label
      className={`
        rounded-xl
        border-2
        p-4
        flex
        flex-col
        gap-3
        hover:border-black
        transition
        cursor-pointer
        ${selected ? "border-black" : "border-neutral-200"}
      `}
    >
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryBox; // Exporting CategoryBox component
