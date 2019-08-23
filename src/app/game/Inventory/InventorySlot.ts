import {Actor, Color} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';
import {Constants} from '../Constants';

export class InventorySlot extends Actor {
  onInitialize(engine: ChrominoGame): void {
    this.add(new Actor(0, 0, Constants.SQUARE_SIZE, Constants.SQUARE_SIZE * 3, Color.LightGray));
  }
}
