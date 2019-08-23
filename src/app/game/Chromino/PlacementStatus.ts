import {Color} from 'excalibur';

export class PlacementStatus {
  static placed: Color = null;
  static canPlace: Color = Color.Green;
  static insufficientColorContact = Color.Orange;
  static obstructed = Color.Red;
  static inInventory = Color.LightGray;
}
