import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from '@/context/SocketContext';

const Landing = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { toast } = useToast();
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = () => {
    if (!socket) return;
    
    socket.emit('create_room', {}, (response: { roomId: string }) => {
      console.log('Room created:', response.roomId);
      navigate(`/room/${response.roomId}`);
    });
  };

  const handleJoinRoom = () => {
    if (!socket || !roomCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid room code",
        variant: "destructive",
      });
      return;
    }

    socket.emit('join_room', { roomId: roomCode }, (response: { success: boolean, error?: string }) => {
      if (response.success) {
        navigate(`/room/${roomCode}`);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to join room",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Planning Poker</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="join">Join Room</TabsTrigger>
              <TabsTrigger value="create">Create Room</TabsTrigger>
            </TabsList>
            <TabsContent value="join">
              <div className="space-y-4">
                <Input
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                />
                <Button className="w-full" onClick={handleJoinRoom}>
                  Join Room
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="create">
              <Button className="w-full" onClick={handleCreateRoom}>
                Create New Room
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;