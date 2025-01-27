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
    <div className="flex justify-between items-center bg-white px-8 py-4 rounded-lg shadow-md">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={handleResetAndNavigate}
      >
        Planning Poker
      </h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onCopyCode}
          className="rounded-lg border-2 border-black-500 text-black-500 px-4 py-2 font-semibold hover:bg-gray-100 hover:text-black transition duration-200 shadow-md"
        >
          Room: {roomId}
        </Button>
        {isModerator && (
          <div className="flex gap-2">
            <Button
              onClick={onReveal}
              disabled={revealed}
              className={`rounded-lg px-4 py-2 font-semibold ${revealed
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-white-500 text-black border-black-100 border-2 hover:bg-green-100 hover:border-green-500 hover:text-green-500"
                } transition duration-200 shadow-md`}
            >
              Reveal Cards
            </Button>
            <Button
              onClick={onReset}
              className="rounded-lg px-4 py-2 font-semibold bg-white-200 text-black border-black-100 border-2 hover:bg-red-100 hover:border-red-500 hover:text-red-500 transition duration-200 shadow-md"
            >
              Reset Round
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}  
