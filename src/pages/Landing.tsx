import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!socket) {
      toast({
        title: "Error",
        description: "Socket connection failed. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [socket, toast]);

  const handleCreateRoom = (values: z.infer<typeof formSchema>) => {
    if (!socket) {
      toast({
        title: "Error",
        description: "Socket not connected. Try again later.",
        variant: "destructive",
      });
      return;
    }

    socket.emit("create_room", { username: values.username }, (response: { roomId: string, userId: string, isModerator:boolean }) => {
      if (response?.roomId) {
        sessionStorage.setItem('roomInfo', JSON.stringify(response));
        navigate(`/room/${response.roomId}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to create room. Try again.",
          variant: "destructive",
        });
      }
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
    }, (response: { success: boolean, error?: string, userId: string }) => {
      if (response.success) {
        sessionStorage.setItem('roomInfo', JSON.stringify(response));
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
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
      <Card className="w-full max-w-md min-h-[400px] bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center font-sans text-white">
            Planning Poker
          </CardTitle>

        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 text-white bg-white/20 rounded-lg">
              <TabsTrigger value="join" className="text-white data-[state=active]:bg-purple-500">Join Room</TabsTrigger>
              <TabsTrigger value="create" className="text-white data-[state=active]:bg-purple-500">Create Room</TabsTrigger>
            </TabsList>
            <TabsContent value="join">
              <Form {...joinForm}>
                <form onSubmit={joinForm.handleSubmit(handleJoinRoom)} className="space-y-4">
                  <FormField
                    control={joinForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Username</FormLabel>
                        <FormControl>
                          <Input className="bg-gray-700 text-white" placeholder="Enter your name" {...field} />
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
                        <FormLabel className="text-white">Room Code</FormLabel>
                        <FormControl>
                          <Input className="bg-gray-700 text-white" placeholder="Enter room code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-500">
                    Join Room
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="create">
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateRoom)} className="flex flex-col space-y-6">

                  <FormField
                    control={createForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Username</FormLabel>
                        <FormControl>
                          <Input className="bg-gray-700 text-white" placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-500">
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
