import { PlanningCard } from "@/components/PlanningCard";
import { motion } from "framer-motion"; // Import Framer Motion

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
      <motion.div
        className="grid grid-cols-4 md:grid-cols-8 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              delayChildren: 0.2,
              staggerChildren: 0.1, // Delay each card for cascading effect
            },
          },
        }}
      >
        {CARDS.map((value, index) => (
          <motion.div
            key={value}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <PlanningCard
              value={value}
              selected={selectedCard === value}
              revealed={revealed}
              onClick={() => onCardSelect(value)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
