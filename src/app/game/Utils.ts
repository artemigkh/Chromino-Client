import {Color, Vector} from 'excalibur';
import {Constants} from './Constants';

export class Utils {
  static colorsEqual(c1: Color, c2: Color): boolean {
    if (c1 == null) {
      return c2 == null;
    } else if (c2 == null) {
      return false;
    } else {
      return c1.r == c2.r && c1.g == c2.g && c1.b == c2.b;
    }
  }

  static getGridAlignedPos(pos: Vector): Vector {
    return new Vector(
      Math.round((pos.x - Constants.SQUARE_CENTER_OFFSET) / Constants.SQUARE_SIZE) * Constants.SQUARE_SIZE + Constants.SQUARE_CENTER_OFFSET,
      Math.round((pos.y - Constants.SQUARE_CENTER_OFFSET) / Constants.SQUARE_SIZE) * Constants.SQUARE_SIZE + Constants.SQUARE_CENTER_OFFSET
    );
  }
}
