import {Actor, Color} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';
import {Constants} from '../Constants';
import {ChrominoInventory} from './ChrominoInventory';
import {Chromino} from '../Chromino/Chromino';

export class InventorySlot extends Actor {
  inventoryPosition: number;
  inventory: ChrominoInventory;
  containedChromino: Chromino;

  constructor(inventoryPosition: number, inventory: ChrominoInventory) {
    super(inventoryPosition * Constants.SQUARE_SIZE * 1.5 - Constants.SQUARE_SIZE * 6,
      0, Constants.SQUARE_SIZE * 1.5, Constants.SQUARE_SIZE * 4);
    this.inventoryPosition = inventoryPosition;
    this.inventory = inventory;
  }

  onInitialize(engine: ChrominoGame): void {
    this.add(new Actor(0, 0, Constants.SQUARE_SIZE, Constants.SQUARE_SIZE * 3, Color.LightGray));
  }

  shiftLeft() {
    this.pos.x = this.pos.x - Constants.SQUARE_SIZE * 1.5;
    this.containedChromino.pos.x = this.containedChromino.pos.x - Constants.SQUARE_SIZE * 1.5;
  }

  notifyPlaced() {
    this.inventory.removeInventorySlot(this);
  }
}
