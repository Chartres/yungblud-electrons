export interface ElectronConfig {
  n: number;
  subshell: 's' | 'p' | 'd' | 'f';
  electrons: number;
  maxElectrons: number;
}

export interface ElementData {
  symbol: string;
  name: string;
  number: number;
  config: string; // e.g. "1s2 2s2 2p6"
}

export enum GameState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST'
}
