import {Color, Vector} from 'excalibur';
import {Constants} from '../Constants';

export class ChrominoSquare {
  boardX: number;
  boardY: number;
  color: Color;

  static fromEnginePos(pos: Vector, color: Color) {
    return new ChrominoSquare(
      Math.floor(pos.x / Constants.SQUARE_SIZE), Math.ceil(pos.y / Constants.SQUARE_SIZE), color);
  }

  occupies(x: number, y: number): boolean {
    return x == this.boardX && y == this.boardY;
  }

  private constructor(boardX: number, boardY: number, color: Color) {
    this.boardX = boardX;
    this.boardY = boardY;
    this.color = color;
  }
}
