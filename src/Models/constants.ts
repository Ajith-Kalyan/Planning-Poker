export interface Player {
    id: string;
    name: string;
    vote: string | null;
    isModerator?: boolean;
  }
  
  export interface PlayersGridProps {
    players: Player[];
    revealed: boolean;
  }
  
  export const getCardColor = (value: string) => {
    switch (value) {
      case '1':
        return "bg-gray-200";
      case '2':
        return "bg-green-100";
      case '3':
        return "bg-green-200";
      case '5':
        return "bg-green-300";
      case '8':
        return "bg-yellow-100";
      case '13':
        return "bg-yellow-200";
      case '21':
        return "bg-red-200";
      default:
        return "bg-white";
    }
  };