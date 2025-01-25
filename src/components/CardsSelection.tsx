import { PlanningCard } from "@/components/PlanningCard";

interface CardsSelectionProps {
  selectedCard: string | null;
  revealed: boolean;
  onCardSelect: (value: string) => void;
}

const CARDS = ['1', '2', '3', '5', '8', '13', '21', '?'];

export const CardsSelection = ({
  selectedCard,
  revealed,
  onCardSelect,
}: CardsSelectionProps) => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {CARDS.map((value) => (
          <PlanningCard
            key={value}
            value={value}
            selected={selectedCard === value}
            revealed={revealed}
            onClick={() => onCardSelect(value)}
          />
        ))}
      </div>
    </div>
  );
};