import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '@/context/SocketContext';
import { useToast } from "@/components/ui/use-toast";
import { RoomHeader } from '@/components/RoomHeader';
import { PlayersGrid } from '@/components/PlayersGrid';
import { CardsSelection } from '@/components/CardsSelection';

interface Player {
  id: string;
  name: string;
  vote: string | null;
}

// Mock data for development and testing
const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'John Doe', vote: '5' },
  { id: '2', name: 'Jane Smith', vote: '8' },
  { id: '3', name: 'Alice Johnson', vote: null },
  { id: '4', name: 'Bob Wilson', vote: '13' },
  { id: '5', name: 'Carol Brown', vote: '3' },
  { id: '6', name: 'David Clark', vote: null },
  { id: '7', name: 'Eve Davis', vote: '21' },
];

const Room = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  // Set isModerator to true for testing
  const [isModerator, setIsModerator] = useState(true);

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
    setRevealed(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <RoomHeader
          roomId={roomId || ''}
          isModerator={isModerator}
          onReveal={handleReveal}
          onReset={handleReset}
          onCopyCode={copyRoomCode}
          revealed={revealed}
        />
        <PlayersGrid players={players} revealed={revealed} />
        <CardsSelection
          selectedCard={selectedCard}
          revealed={revealed}
          onCardSelect={handleCardSelect}
        />
      </div>
    </div>
  );
};

export default Room;