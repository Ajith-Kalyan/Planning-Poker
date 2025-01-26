import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

interface RoomHeaderProps {
  roomId: string;
  isModerator: boolean;
  onReveal: () => void;
  onReset: () => void;
  onCopyCode: () => void;
  revealed: boolean;
}

export const RoomHeader = ({
  roomId,
  isModerator,
  onReveal,
  onReset,
  onCopyCode,
  revealed,
}: RoomHeaderProps) => {
  const navigate = useNavigate(); // Initialize navigate

  // Handle click on Planning Poker to reset session and navigate
  const handleResetAndNavigate = () => {
    sessionStorage.clear(); // Clear all session storage data
    navigate("/"); // Redirect to the landing page ("/")
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold cursor-pointer" onClick={handleResetAndNavigate}>
        Planning Poker
      </h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCopyCode}>
          Room: {roomId}
        </Button>
        {isModerator && (
          <div className="flex gap-2">
            <Button onClick={onReveal} disabled={revealed}>
              Reveal Cards
            </Button>
            <Button onClick={onReset}>
              Reset Round
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
