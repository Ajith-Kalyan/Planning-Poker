import { cn } from "@/lib/utils";
import { getCardColor } from "@/Models/constants";

interface PlanningCardProps {
  value: string;
  selected?: boolean;
  revealed?: boolean;
  onClick: () => void;
}

export const PlanningCard = ({
  value,
  selected,
  revealed,
  onClick,
}: PlanningCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={cn(
        "relative w-full h-32 rounded-lg border-2 transition-all duration-300 transform hover:scale-110", 
        "flex items-center justify-center text-2xl font-bold",
        selected
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : `border-gray-200 ${getCardColor(value)} text-gray-700 hover:border-blue-300`,
        revealed && "opacity-50",
        "card-animation"
      )}
    >
      {value}
    </button>
  );
};
