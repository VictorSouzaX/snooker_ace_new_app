export interface GameMode {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  statusText?: string;
  playersOnline?: string;
  buttonText: string;
  buttonType: 'green' | 'yellow' | 'outline';
  backgroundImage?: string;
  highlightColor?: string;
}

export interface UserStats {
  name: string;
  level: number;
  tokens: number;
  diamonds: number;
  avatarUrl: string;
}
