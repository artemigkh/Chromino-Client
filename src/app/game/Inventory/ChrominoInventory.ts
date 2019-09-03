import {Actor, Color, Vector} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';
import {Chromino} from '../Chromino/Chromino';
import {_Draggable} from '../Engine/_Draggable';
import {Constants} from '../Constants';
import {InventorySlot} from './InventorySlot';
import {PlacementStatus} from '../Chromino/PlacementStatus';

export class ChrominoInventory extends Actor implements _Draggable {
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
    this.width = engine.canvasWidth * 20;
    this.x = 0;
    this.y = engine.halfCanvasHeight - Constants.SQUARE_SIZE * 2;

    this.container = new Actor(
      0, 0,
      engine.canvasWidth * 20,
      Constants.SQUARE_SIZE * 4,
      Color.Gray
    );
    this.add(this.container);
    console.log('initialized');
  }

  storeNewChromino(colors: Color[], engine: ChrominoGame) {
    const inventorySlot = new InventorySlot(this.inventorySlots.length, this);
    this.inventorySlots.push(inventorySlot);
    this.container.add(inventorySlot);

    const chromino = new Chromino(
      inventorySlot.getWorldPos().x,
      inventorySlot.getWorldPos().y,
      Math.PI / 2,
      colors,
      PlacementStatus.inInventory
    );
    chromino.inventorySlot = inventorySlot;
    inventorySlot.containedChromino = chromino;
    engine.putChrominoInPlay(chromino);
  }

  removeInventorySlot(inventorySlot: InventorySlot) {
    this.container.remove(inventorySlot);
    this.inventorySlots = this.inventorySlots.filter(i => i != inventorySlot);
    this.inventorySlots.forEach(i => {
      if (i.inventoryPosition > inventorySlot.inventoryPosition) {
        i.shiftLeft();
      }
    });
    console.log('remove inventory slot at position', inventorySlot.inventoryPosition);
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
    this.dragStartPos = this.pos.clone();
  }

  onDragging(engine: ChrominoGame, dragDelta: Vector) {
    this.pos = this.dragStartPos.sub(dragDelta);
  }

  onDragEnd(engine: ChrominoGame) {
  }
}
