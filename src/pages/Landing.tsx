import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from '@/context/SocketContext';
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  roomCode: z.string().optional(),
});

const Landing = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('join');

  const joinForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      roomCode: "",
    },
  });

  const createForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleCreateRoom = (values: z.infer<typeof formSchema>) => {
    if (!socket) return;
    
    socket.emit('create_room', { username: values.username }, (response: { roomId: string }) => {
      console.log('Room created:', response.roomId);
      navigate(`/room/${response.roomId}`);
    });
  };

  const handleJoinRoom = (values: z.infer<typeof formSchema>) => {
    if (!socket || !values.roomCode?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid room code",
        variant: "destructive",
      });
      return;
    }

    socket.emit('join_room', { 
      roomId: values.roomCode,
      username: values.username 
    }, (response: { success: boolean, error?: string }) => {
      if (response.success) {
        navigate(`/room/${values.roomCode}`);
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="join">Join Room</TabsTrigger>
              <TabsTrigger value="create">Create Room</TabsTrigger>
            </TabsList>
            <TabsContent value="join">
              <Form {...joinForm}>
                <form onSubmit={joinForm.handleSubmit(handleJoinRoom)} className="space-y-4">
                  <FormField
                    control={joinForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={joinForm.control}
                    name="roomCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter room code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Join Room
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="create">
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateRoom)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Create New Room
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;