import {Vector} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';
import {Pointer} from 'excalibur/dist/Input';

export interface Draggable {
  pos: Vector;
  dragStartPos: Vector;
  isActiveDragTarget: boolean;

  containsCursorWorldPos(worldPos: Vector): boolean;

  movable(): boolean;

  moveWithViewport(): boolean;

  moveWithInventory(): boolean;

  onDragStart(engine: ChrominoGame);

  onDragging(engine: ChrominoGame, dragDelta: Vector);

  onDragEnd(engine: ChrominoGame);
}
