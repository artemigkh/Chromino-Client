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
import {PiecePlacement} from '../Engine/PiecePlacement';
import {ChrominoColorMap} from './ChrominoColor';

export class Chromino extends Actor implements Draggable {
  private static allChrominos: Chromino[] = [];
  private readonly colors: Color[];

  private chrominoSquares: ChrominoSquare[] = [];
  dragStartPos: Vector;
  isActiveDragTarget = false;
  private gridAlignedPos: Vector;
  private placementShadow: PlacementShadow = null;
  placementStatus: Color = PlacementStatus.insufficientColorContact;
  inventorySlot: InventorySlot = null;

  static fromPiecePlacementEvent(piecePlacement: PiecePlacement) {
    console.log(piecePlacement.colors.map(c => ChrominoColorMap.get(c)));
    console.log(ChrominoColorMap);
    return new Chromino(
      piecePlacement.x * Constants.SQUARE_SIZE + Constants.SQUARE_CENTER_OFFSET,
      piecePlacement.y * Constants.SQUARE_SIZE - Constants.SQUARE_CENTER_OFFSET,
      piecePlacement.rotation * Math.PI / 180,
      piecePlacement.colors.map(c => ChrominoColorMap.get(c)),
      PlacementStatus.placed
    );
  }

  constructor(x: number, y: number, rotation: number, colors: Color[], placementStatus: Color) {
    super(x, y, Constants.SQUARE_SIZE * 3, Constants.SQUARE_SIZE);
    this.colors = colors;
    console.log(this.colors);
    this.rotation = rotation;
    this.placementStatus = placementStatus;
  }

  public onInitialize(engine: ChrominoGame) {
    super.onInitialize(engine);
    this.add(new ChrominoDisplay(this.colors, engine.chrominoOverlayTx));
    this.gridAlignedPos = this.pos;
    this.placementShadow = new PlacementShadow(this);
    if (this.placementStatus == PlacementStatus.inInventory) {
      this.setZIndex(4);
    } else {
      this.setZIndex(2);
      if (this.placementStatus == PlacementStatus.placed) {
        console.log('initializing placed piece');
        this.updateChrominoSquares();
        engine.board.registerPlacedPieceOnGrid(this);
      }
    }
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
    this.updateChrominoSquares();
    if (this.placementStatus != PlacementStatus.inInventory) {
      this.pos = this.dragStartPos.add(dragDelta);
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
    if (engine.inventory.containsCursorWorldPos(engine.input.pointers.primary.lastWorldPos)) {
      if (this.inventorySlot == null) {
        this.pos = this.dragStartPos;
      } else {
        this.scene.remove(this.placementShadow);
        this.rotation = Math.PI / 2;
        this.pos = this.inventorySlot.getWorldPos();
        this.placementStatus = PlacementStatus.inInventory;
      }
    } else {
      this.setZIndex(2);
      if ((this.placementStatus == PlacementStatus.insufficientColorContact ||
        this.placementStatus == PlacementStatus.obstructed)
        && this.dragStartPos.equals(this.pos)) {
        this.rotation += Math.PI / 2;
      }
      if (this.placementStatus != PlacementStatus.obstructed) {
        // engine.board.registerPlacedPieceOnGrid(this);
        if (this.placementStatus == PlacementStatus.canPlace) {
          this.scene.remove(this.placementShadow);
          this.pos = Utils.getGridAlignedPos(this.pos);
          this.updateChrominoSquares();
          engine.board.registerPlacedPieceOnGrid(this);
          this.placementStatus = PlacementStatus.placed;
          this.inventorySlot.notifyPlaced();
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
