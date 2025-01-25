import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Planning Poker</h1>
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