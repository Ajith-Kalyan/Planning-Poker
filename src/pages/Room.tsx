import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSocket } from '@/context/SocketContext';
import { useToast } from "@/components/ui/use-toast";
import { PlanningCard } from '@/components/PlanningCard';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Player {
  id: string;
  name: string;
  vote: string | null;
}

const CARDS = ['1', '2', '3', '5', '8', '13', '21', '?'];

const Room = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('check_moderator', { roomId }, (response: { isModerator: boolean }) => {
      setIsModerator(response.isModerator);
    });

    socket.on('player_joined', (data: { players: Player[] }) => {
      console.log('Player joined:', data);
      setPlayers(data.players);
    });

    socket.on('player_voted', (data: { players: Player[] }) => {
      console.log('Player voted:', data);
      setPlayers(data.players);
    });

    socket.on('votes_revealed', () => {
      console.log('Votes revealed');
      setRevealed(true);
    });

    socket.on('round_reset', () => {
      console.log('Round reset');
      setRevealed(false);
      setSelectedCard(null);
      setPlayers(players.map(p => ({ ...p, vote: null })));
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_voted');
      socket.off('votes_revealed');
      socket.off('round_reset');
    };
  }, [socket, roomId]);

  const handleCardSelect = (value: string) => {
    if (!socket || revealed) return;
    
    setSelectedCard(value);
    socket.emit('vote', { roomId, vote: value });
  };

  const handleReveal = () => {
    if (!socket) return;
    socket.emit('reveal_votes', { roomId });
  };

  const handleReset = () => {
    if (!socket) return;
    socket.emit('reset_round', { roomId });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId || '');
    toast({
      title: "Room code copied!",
      description: "Share this code with your team members",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Planning Poker</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyRoomCode}>
              Room: {roomId}
            </Button>
            {isModerator && (
              <div className="flex gap-2">
                <Button onClick={handleReveal} disabled={revealed}>
                  Reveal Cards
                </Button>
                <Button onClick={handleReset}>
                  Reset Round
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Players Grid */}
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

        {/* Cards Selection */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {CARDS.map((value) => (
              <PlanningCard
                key={value}
                value={value}
                selected={selectedCard === value}
                revealed={revealed}
                onClick={() => handleCardSelect(value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;