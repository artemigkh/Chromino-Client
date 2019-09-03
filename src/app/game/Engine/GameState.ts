export interface PlayerState {
  name: string;
}

export interface GameState {
  deckSize: number;
  players: PlayerState;
}
