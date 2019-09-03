import {Color, Engine, Loader, Scene, Texture, Vector} from 'excalibur';
import {Board} from './Board/Board';
import {MovableCamera} from './MovableCamera';
import {Interface} from './UserInterface/Interface';
import {_Draggable} from './Engine/_Draggable';
import {Chromino} from './Chromino/Chromino';
import {ChrominoInventory} from './Inventory/ChrominoInventory';
import {MultiplayerService} from './Engine/MultiplayerService';
import {Injectable} from '@angular/core';
import {ChrominoColorMap} from './Chromino/ChrominoColor';
import {PiecePlacement} from './Engine/PiecePlacement';

@Injectable()
export class ChrominoGame extends Engine {
  board: Board;
  mainScene: Scene;

  readonly chrominoOverlayTx: Texture;

  private chrominosInPlay: Chromino[] = [];

  private dragStartPointerPos: Vector = null;
  private mainCamera: _Draggable = null;
  inventory: ChrominoInventory = null;
  private dragTarget: _Draggable = null;
  private interface: Interface = null;

  constructor(private multiplayerService: MultiplayerService) {
    super();
    this.chrominoOverlayTx = new Texture('assets/chrominoOverlay.png');
    this.initializeGameObjects();
  }

  start() {
    const loader = new Loader([this.chrominoOverlayTx]);
    return super.start(loader).then(() => {
      this.goToScene('mainScene');
      this.initializeMultiplePlayerService();
      this.multiplayerService.createNewGame().subscribe(() => {
        console.log('new game created');
        this.multiplayerService.drawChrominosFromStock(8).subscribe(
          chrominoColorsCollection => {
            console.log(chrominoColorsCollection);
            chrominoColorsCollection.forEach(
              chrominoColors => this.inventory.storeNewChromino(
                chrominoColors.map(c => ChrominoColorMap.get(c)), this));
          },
          err => console.error(err)
        );
        this.multiplayerService.drawChrominoFromStock().subscribe(
          chrominoColors => {
            console.log(chrominoColors);
            this.putChrominoInPlay(Chromino.fromPiecePlacementEvent({
              playerId: 0,
              colors: chrominoColors,
              rotation: 0,
              x: 0,
              y: 0
            } as PiecePlacement));
          },
          err => console.error(err)
        );
      }, err => console.error(err));
    });
  }

  drawChrominoFromStock() {
    this.multiplayerService.drawChrominoFromStock().subscribe(
      chrominoColors => this.inventory.storeNewChromino(
        chrominoColors.map(c => ChrominoColorMap.get(c)), this),
      err => console.error(err)
    );
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
      if (chrominosUnderCursor.length > 0) {
        this.dragTarget = chrominosUnderCursor[0];
      } else if (this.inventory.containsCursorWorldPos(pointer.lastWorldPos)) {
        this.dragTarget = this.inventory;
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
        if (this.dragTarget == this.mainCamera) {
          console.log('dragging camera');
          this.dragTarget.onDragging(engine, pointer.lastScreenPos.sub(this.dragStartPointerPos));
          this.inventory.onDragging(engine, pointer.lastScreenPos.sub(this.dragStartPointerPos));
          this.chrominosInPlay.filter(chromino => chromino.moveWithInventory() && !chromino.isActiveDragTarget).forEach(
            chromino => chromino.onDragging(engine, pointer.lastScreenPos.sub(this.dragStartPointerPos))
          );
        } else if (this.dragTarget == this.inventory) {
          this.dragTarget.onDragging(engine, new Vector(pointer.lastScreenPos.sub(this.dragStartPointerPos).x, 0));
          this.chrominosInPlay.filter(chromino => chromino.moveWithInventory() && !chromino.isActiveDragTarget).forEach(
            chromino => chromino.onDragging(engine, new Vector(pointer.lastScreenPos.sub(this.dragStartPointerPos).x, 0))
          );
        } else {
          this.dragTarget.onDragging(engine, pointer.lastScreenPos.sub(this.dragStartPointerPos));
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

    this.interface = new Interface();
    this.mainScene.add(this.interface);

    const inventory = new ChrominoInventory();
    this.inventory = inventory;
    this.mainScene.add(inventory);
  }

  private initializeMultiplePlayerService() {
    this.multiplayerService.piecePlacements.subscribe(
      piecePlacement => {
        console.log('Placing piece from server: ', piecePlacement);
        this.putChrominoInPlay(Chromino.fromPiecePlacementEvent(piecePlacement));
      },
      err => console.error(err)
    );

    this.multiplayerService.gameStateChange.subscribe(
      gameState => this.interface.notifyStateChange(gameState),
      err => console.error(err)
    );
  }
}
