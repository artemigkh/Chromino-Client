import {Camera, CameraStrategy, Engine, Vector} from 'excalibur';
import {ChrominoGame} from './ChrominoGame';
import {_Draggable} from './Engine/_Draggable';

export class MovableCamera implements CameraStrategy<void>, _Draggable {
  target: void;
  dragStartPos: Vector;
  isActiveDragTarget = false;
  pos: Vector;

  constructor() {
    this.pos = new Vector(0, 0);
  }

  action(target: void, camera: Camera, engine: ChrominoGame, delta: number): Vector {
    return this.isActiveDragTarget ? this.pos : camera.pos;
  }

  containsCursorWorldPos(worldPos: Vector): boolean {
    return true;
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
    this.dragStartPos = engine.mainScene.camera.pos.clone();
  }

  onDragging(engine: ChrominoGame, dragDelta: Vector) {
    this.pos = this.dragStartPos.sub(dragDelta);
  }

  onDragEnd(engine: ChrominoGame) {}

}
