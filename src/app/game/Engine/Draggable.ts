import {Vector} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';

export interface Draggable {
  pos: Vector;
  dragStartPos: Vector;
  isActiveDragTarget: boolean;



  movable(): boolean;

  containsCursorWorldPos(worldPos: Vector): boolean;

  onDragStart(engine: ChrominoGame);

  onDragging(engine: ChrominoGame, dragDelta: Vector);

  onDragEnd(engine: ChrominoGame);
}
