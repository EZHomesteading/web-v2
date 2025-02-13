import { OutfitFont } from "@/components/fonts";
import { Clock } from "lucide-react";

interface AvailabilityScoreProps {
  scores: {
    pickup: {
      workingmanScore: number;
      retireeScore: number;
      combinedScore: number;
    };
    delivery: {
      workingmanScore: number;
      retireeScore: number;
      combinedScore: number;
    };
  };
  type: "pickup" | "delivery";
}

const AvailabilityScore = ({ scores, type }: AvailabilityScoreProps) => {
  const typeScores = scores[type];

  const getColor = (score: number) => {
    switch (score) {
      case 3:
        return "text-green-500";
      case 2:
        return "text-yellow-500";
      case 1:
        return "text-red-500";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="flex items-center justify-between space-x-1">
      <div
        className={`flex items-center text-xs ${getColor(
          typeScores.combinedScore
        )}`}
      >
        <Clock size={14} className="mr-1" />
        <span className={`${OutfitFont.className} font-medium`}>
          {type === "pickup" ? "Pickup Availability" : "Delivery Availability"}
        </span>
      </div>
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < typeScores.combinedScore
                ? getColor(typeScores.combinedScore).replace("text-", "bg-")
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailabilityScore;
