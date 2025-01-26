import { Card } from "@/components/ui/card";
import { PlayersGridProps } from "@/Models/constants";


const getInitials = (name: string) => {
  const nameParts = name.split(' ');
  const initials = nameParts.map(part => part[0].toUpperCase()).join('');
  return initials.length > 2 ? initials.substring(0, 2) : initials; // Ensure it's always 2 characters max
};

export const PlayersGrid = ({ players, revealed }: PlayersGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {players.map((player) => (
        <Card key={player.id} className="p-4 w-40 h-56 border-2 border-gray-300 rounded-lg flex flex-col items-center justify-between">
          <div className="text-center text-lg font-semibold">
            {player.name.length > 10 ? getInitials(player.name) : player.name.toUpperCase()}
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="text-4xl font-bold">
              {revealed ? (
                player.vote || '?'
              ) : (
                player.vote ? '🎯' : '⏳'
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
