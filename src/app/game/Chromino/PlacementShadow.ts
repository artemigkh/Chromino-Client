import {Actor, Color} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';
import {Chromino} from './Chromino';
import {Constants} from '../Constants';
import {Utils} from '../Utils';
import {PlacementStatus} from './PlacementStatus';

export class PlacementShadow extends Actor {
  owner: Chromino;

  constructor(owner: Chromino) {
    super({width: Constants.SQUARE_SIZE * 3, height: Constants.SQUARE_SIZE});
    this.color = Color.Orange;
    this.owner = owner;
  }

  public update(engine: ChrominoGame, delta: number) {
    super.update(engine, delta);

    if (this.owner.getPlacementStatus() != PlacementStatus.placed) {
      this.color = this.owner.getPlacementStatus();
      this.rotation = this.owner.rotation;
      this.pos = Utils.getGridAlignedPos(this.owner.pos);
    }
  }
}
