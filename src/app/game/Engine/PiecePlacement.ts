import {ChrominoColor} from '../Chromino/ChrominoColor';

export interface PiecePlacement {
  playerId: number;
  colors: ChrominoColor[];
  rotation: number;
  x: number;
  y: number;
}
