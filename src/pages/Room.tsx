import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '@/context/SocketContext';
import { useToast } from "@/components/ui/use-toast";
import { RoomHeader } from '@/components/RoomHeader';
import { PlayersGrid } from '@/components/PlayersGrid';
import { CardsSelection } from '@/components/CardsSelection';
import { Player } from '@/Models/constants';

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

    // Fetch the list of players when entering the room
    socket.emit('get_players', { roomId });

    // Listen for the initial player list
    socket.on('player_list', (data: { players: Player[] }) => {
      console.log('Player list fetched:', data);
      setPlayers(data.players);
    });

    // Check if the current user is the moderator
    socket.emit('check_moderator', { roomId }, (response: { isModerator: boolean }) => {
      setIsModerator(response.isModerator);
    });

    // Listen for player-related events
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
      setPlayers((prevPlayers) => prevPlayers.map((p) => ({ ...p, vote: null })));
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
  
    // Safely retrieve and parse roomInfo from localStorage
    const storedRoomInfo = sessionStorage.getItem('roomInfo');
    if (storedRoomInfo) {
      try {
        const roomInfo = JSON.parse(storedRoomInfo);
        if (roomInfo?.userId) {
          const userId = roomInfo.userId;
  
          // Find the player who is voting and update their vote in the local state
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
              player.id === userId ? { ...player, vote: value } : player
            )
          );
  
          // Emit the vote to the server with the userId
          socket.emit('vote', { roomId, playerId: userId, vote: value });
        } else {
          console.error('User ID not found in room info');
        }
      } catch (error) {
        console.error('Error parsing room info from localStorage:', error);
      }
    } else {
      console.error('Room info not found in localStorage');
    }
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
