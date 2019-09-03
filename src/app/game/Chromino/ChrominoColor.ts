import {Color} from 'excalibur';

export enum ChrominoColor {
  BLUE = 'BLUE',
  RED = 'RED',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  PURPLE = 'PURPLE'
}

export const ChrominoColorMap: Map<ChrominoColor, Color> = new Map([
  [ChrominoColor.BLUE, Color.Blue],
  [ChrominoColor.RED, Color.Red],
  [ChrominoColor.GREEN, Color.Green],
  [ChrominoColor.YELLOW, Color.Yellow],
  [ChrominoColor.PURPLE, Color.Violet],
]);
