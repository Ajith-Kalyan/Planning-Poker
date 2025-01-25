import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Player {
  id: string;
  name: string;
  vote: string | null;
}

interface PlayersGridProps {
  players: Player[];
  revealed: boolean;
}

export const PlayersGrid = ({ players, revealed }: PlayersGridProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {players.map((player) => (
        <Card key={player.id} className="p-4">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <div className="font-semibold">{player.name}</div>
              <div className="mt-2 text-2xl">
                {revealed ? (
                  player.vote || '?'
                ) : (
                  player.vote ? '🎯' : '⏳'
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};