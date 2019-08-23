import {Actor, Color, Vector} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';
import {Chromino} from '../Chromino/Chromino';
import {Draggable} from '../Engine/Draggable';
import {Constants} from '../Constants';
import {InventorySlot} from './InventorySlot';
import {PlacementStatus} from '../Chromino/PlacementStatus';

export class ChrominoInventory extends Actor implements Draggable {
  dragStartPos: Vector;
  isActiveDragTarget = false;

  private container: Actor;
  private inventorySlots: InventorySlot[] = [];

  constructor() {
    super();
  }

  onInitialize(engine: ChrominoGame): void {
    super.onInitialize(engine);
    this.setZIndex(3);
    this.height = Constants.SQUARE_SIZE * 4;
    this.width = engine.canvasWidth;
    this.x = 0;
    this.y = engine.halfCanvasHeight - Constants.SQUARE_SIZE * 2;

    this.container = new Actor(
      0, 0,
      engine.canvasWidth,
      Constants.SQUARE_SIZE * 4,
      Color.Gray
    );
    this.add(this.container);
    console.log('initialized');
  }

  storeNewChromino(chromino: Chromino, engine: ChrominoGame) {
    const inventorySlot = new InventorySlot(
      this.inventorySlots.length * Constants.SQUARE_SIZE * 1.5, 0, Constants.SQUARE_SIZE * 1.5, Constants.SQUARE_SIZE * 4);
    this.inventorySlots.push(inventorySlot);
    this.container.add(inventorySlot);
    chromino.pos = inventorySlot.getWorldPos();
    chromino.rotation = Math.PI / 2;
    chromino.placementStatus = PlacementStatus.inInventory;
    chromino.inventorySlot = inventorySlot;
    engine.putChrominoInPlay(chromino);
  }

  containsCursorWorldPos(worldPos: Vector): boolean {
    return this.body.collider.bounds.contains(worldPos);
  }

  movable(): boolean {
    return true;
  }

  moveWithInventory(): boolean {
    return false;
  }

  moveWithViewport(): boolean {
    return true;
  }

  onDragStart(engine: ChrominoGame) {
  }

  onDragging(engine: ChrominoGame, dragDelta: Vector) {
    this.pos = this.dragStartPos.sub(dragDelta);
  }

  onDragEnd(engine: ChrominoGame) {
  }
}
