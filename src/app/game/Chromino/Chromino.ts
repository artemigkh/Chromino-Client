import {Actor, Color, Vector} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';
import {PlacementShadow} from './PlacementShadow';
import {ChrominoSquare} from './ChrominoSquare';
import {PlacementStatus} from './PlacementStatus';
import {ChrominoDisplay} from './ChrominoDisplay';
import {Constants} from '../Constants';
import {Utils} from '../Utils';
import {Draggable} from '../Engine/Draggable';
import {InventorySlot} from '../Inventory/InventorySlot';

export class Chromino extends Actor implements Draggable {
  private static allChrominos: Chromino[] = [];
  private readonly colors: Color[];

  private chrominoSquares: ChrominoSquare[] = [];
  dragStartPos: Vector;
  isActiveDragTarget = false;
  private placementShadow: PlacementShadow = null;
  placementStatus: Color = PlacementStatus.insufficientColorContact;
  inventorySlot: InventorySlot = null;

  static getAllChrominos(): Chromino[] {
    if (this.allChrominos.length == 0) {
      Chromino.allChrominos = [
        new Chromino(75, -25, 0, [Color.Red, Color.Blue, Color.Green]),
        new Chromino(175, 175, Math.PI / 2, [Color.Blue, Color.Green, Color.Violet])
      ];
    }
    return Chromino.allChrominos;
  }

  constructor(x: number, y: number, rotation: number, colors: Color[]) {
    super(x, y, Constants.SQUARE_SIZE * 3, Constants.SQUARE_SIZE);
    this.colors = colors;
    this.rotation = rotation;
  }

  public onInitialize(engine: ChrominoGame) {
    super.onInitialize(engine);
    this.add(new ChrominoDisplay(this.colors, engine.chrominoOverlayTx));
    this.setZIndex(4);
    this.placementShadow = new PlacementShadow(this);

    // engine.input.pointers.primary.on('up', event => {
    //   if ((this.dragStartObjectPos == null || this.dragStartObjectPos.equals(this.pos))
    //     && this.body.collider.bounds.contains(event.target.lastWorldPos) && this.placementStatus != PlacementStatus.placed) {
    //     this.rotation += Math.PI / 2;
    //   }
    // });
  }

  getChrominoSquares(): ChrominoSquare[] {
    return this.chrominoSquares;
  }

  getPlacementStatus(): Color {
    return this.placementStatus;
  }

  occupiesSquare(x: number, y: number): boolean {
    return this.chrominoSquares.reduce((contains: boolean, square: ChrominoSquare) =>
      contains || square.occupies(x, y), false);
  }

  onDragStart(engine: ChrominoGame) {
    this.setZIndex(4);
    this.placementStatus = PlacementStatus.insufficientColorContact;
    this.scene.add(this.placementShadow);
  }

  onDragging(engine: ChrominoGame, dragDelta: Vector) {
    if (this.placementStatus != PlacementStatus.inInventory) {
      this.pos = this.dragStartPos.add(dragDelta);
      this.updateChrominoSquares();
      if (engine.board.isPositionObstructed(this)) {
        this.placementStatus = PlacementStatus.obstructed;
      } else if (engine.board.isPositionValid(this)) {
        this.placementStatus = PlacementStatus.canPlace;
      } else {
        this.placementStatus = PlacementStatus.insufficientColorContact;
      }
    } else {
      this.pos = this.dragStartPos.sub(dragDelta);
    }
  }

  onDragEnd(engine: ChrominoGame) {
    this.scene.remove(this.placementShadow);

    if (engine.inventory.containsCursorWorldPos(engine.input.pointers.primary.lastWorldPos)) {
      if (this.inventorySlot == null) {
        this.pos = this.dragStartPos;
      } else {
        this.pos = this.inventorySlot.getWorldPos();
        this.placementStatus = PlacementStatus.inInventory;
      }
    } else {
      this.pos = Utils.getGridAlignedPos(this.pos);

      this.setZIndex(2);
      this.updateChrominoSquares();

      if (this.placementStatus != PlacementStatus.obstructed) {
        engine.board.registerPlacedPieceOnGrid(this);
        if (this.placementStatus == PlacementStatus.canPlace) {
          engine.board.registerPlacedPieceOnGrid(this);
          this.placementStatus = PlacementStatus.placed;
          console.log('placed!');
        }
      } else {
        this.pos = this.dragStartPos;
      }
    }
  }

  private updateChrominoSquares() {
    const distanceBetweenSquares = Vector.Right.scaleEqual(Constants.SQUARE_SIZE);
    const center: Vector = (this.placementStatus == PlacementStatus.placed ? this.center : this.placementShadow.center);
    this.chrominoSquares = [
      ChrominoSquare.fromEnginePos(center.add(distanceBetweenSquares.scale(-1).rotate(this.rotation, Vector.Zero)), this.colors[0]),
      ChrominoSquare.fromEnginePos(center, this.colors[1]),
      ChrominoSquare.fromEnginePos(center.add(distanceBetweenSquares.rotate(this.rotation, Vector.Zero)), this.colors[2])
    ];
  }

  containsCursorWorldPos(worldPos: Vector): boolean {
    return this.body.collider.bounds.contains(worldPos);
  }

  movable(): boolean {
    return this.placementStatus != PlacementStatus.placed;
  }

  moveWithInventory(): boolean {
    return this.placementStatus == PlacementStatus.inInventory;
  }

  moveWithViewport(): boolean {
    return this.placementStatus == PlacementStatus.inInventory;
  }
}
