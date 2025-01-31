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

  // Get color based on score
  const getColor = (score: number) => {
    switch (score) {
      case 3:
        return "text-green-500"; // Adjusted to text color
      case 2:
        return "text-yellow-500";
      case 1:
        return "text-red-500";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <div
        className={`flex items-center text-xs ${getColor(
          typeScores.combinedScore
        )}`}
      >
        <Clock size={14} className="mr-1" />
        <span className="font-medium capitalize">
          {type === "pickup" ? "Pickup Availability" : "Delivery Availability"}
        </span>
      </div>
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i < typeScores.combinedScore
                ? getColor(typeScores.combinedScore).replace("text-", "bg-") // Convert text color to background color
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailabilityScore;
