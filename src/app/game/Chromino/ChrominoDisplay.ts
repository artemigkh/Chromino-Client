import {Actor, Color, Texture} from 'excalibur';
import {Constants} from '../Constants';

export class ChrominoDisplay extends Actor {
  constructor(colors: Color[], overlay: Texture) {
    super({width: Constants.SQUARE_SIZE * 3, height: Constants.SQUARE_SIZE});
    let drawPos = -Constants.SQUARE_SIZE;
    colors.forEach(color => {
      this.add(new Actor(drawPos, 0, Constants.SQUARE_SIZE - 1, Constants.SQUARE_SIZE - 1, color));
      drawPos += Constants.SQUARE_SIZE;
    });
    const overlayDrawer = new Actor({width: Constants.SQUARE_SIZE * 3, height: Constants.SQUARE_SIZE});
    overlayDrawer.addDrawing(overlay.asSprite());
    this.add(overlayDrawer);
  }

}
