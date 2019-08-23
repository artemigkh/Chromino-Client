import {Color, Engine, Loader, Scene, Texture, Vector} from 'excalibur';
import {Board} from './Board/Board';
import {MovableCamera} from './MovableCamera';
import {Interface} from './UserInterface/Interface';
import {Draggable} from './Engine/Draggable';
import {Chromino} from './Chromino/Chromino';
import {ChrominoInventory} from './Inventory/ChrominoInventory';

export class ChrominoGame extends Engine {
  board: Board;
  mainScene: Scene;

  readonly chrominoOverlayTx: Texture;

  private chrominosInPlay: Chromino[] = [];

  private dragStartPointerPos: Vector = null;
  private mainCamera: Draggable = null;
  inventory: ChrominoInventory = null;
  private dragTarget: Draggable = null;

  constructor() {
    super();
    this.chrominosInPlay = this.chrominosInPlay.concat(Chromino.getAllChrominos());
    this.chrominoOverlayTx = new Texture('assets/chrominoOverlay.png');
    this.initializeGameObjects();
  }

  start() {
    const loader = new Loader([this.chrominoOverlayTx]);
    return super.start(loader).then(() => {
      this.goToScene('mainScene');
      this.inventory.storeNewChromino(new Chromino(0, 0, 0, [Color.Violet, Color.Red, Color.Blue]), this);
      this.inventory.storeNewChromino(new Chromino(0, 0, 0, [Color.Red, Color.Blue, Color.Violet]), this);
    });
  }

  putChrominoInPlay(chromino: Chromino) {
    this.chrominosInPlay.push(chromino);
    this.mainScene.add(chromino);
  }

  onPreUpdate(engine: ChrominoGame, delta: number): void {
    super.onPreUpdate(engine, delta);
    const pointer = engine.input.pointers.primary;
    if (pointer == null) {
      return;
    }

    if (pointer.isDragStart) {
      this.dragStartPointerPos = pointer.lastScreenPos.clone();

      // Find drag target - check chrominos, then inventory, and default to camera
      const movableChrominos = this.chrominosInPlay.filter(chromino => chromino.movable());
      const chrominosUnderCursor = movableChrominos.filter(chromino => chromino.containsCursorWorldPos(pointer.lastWorldPos));
      console.log(chrominosUnderCursor);
      if (chrominosUnderCursor.length > 0) {
        this.dragTarget = chrominosUnderCursor[0];
      } else if (this.inventory.containsCursorWorldPos(pointer.lastWorldPos)) {
        return;
        // this.dragTarget = this.inventory;
      } else {
        this.dragTarget = this.mainCamera;
      }

      this.inventory.dragStartPos = this.inventory.pos.clone();

      this.dragTarget.isActiveDragTarget = true;

      this.dragTarget.dragStartPos = this.dragTarget.pos.clone();
      this.chrominosInPlay.filter(chromino => chromino.moveWithInventory() && !chromino.isActiveDragTarget).forEach(
        chromino => chromino.dragStartPos = chromino.pos.clone()
      );

      this.dragTarget.onDragStart(engine);
    } else if (this.dragTarget != null) {
      if (pointer.isDragging) {
        this.dragTarget.onDragging(engine, pointer.lastScreenPos.sub(this.dragStartPointerPos));
        if (this.dragTarget == this.mainCamera) {
          this.inventory.onDragging(engine, pointer.lastScreenPos.sub(this.dragStartPointerPos));
          this.chrominosInPlay.filter(chromino => chromino.moveWithInventory() && !chromino.isActiveDragTarget).forEach(
            chromino => chromino.onDragging(engine, pointer.lastScreenPos.sub(this.dragStartPointerPos))
          );
        }

      } else if (pointer.isDragEnd) {
        this.dragTarget.isActiveDragTarget = false;
        this.dragTarget.onDragEnd(engine);
        this.dragTarget = null;
      }
    }
  }

  private initializeGameObjects() {
    this.mainScene = new Scene(this);
    this.add('mainScene', this.mainScene);

    this.board = new Board();
    this.mainScene.add(this.board);

    const movableCamera = new MovableCamera();

    const camera = this.mainScene.camera;
    camera.move(Vector.Zero, 0);
    camera.addStrategy<void>(movableCamera);
    this.mainCamera = movableCamera;

    this.mainScene.add(new Interface());

    const inventory = new ChrominoInventory();
    this.inventory = inventory;
    this.mainScene.add(inventory);
  }
}
