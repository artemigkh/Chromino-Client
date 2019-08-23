import {Actor, BaseAlign, Color, Label, TextAlign, Vector} from 'excalibur';
import {Chromino} from '../Chromino/Chromino';
import {ChrominoSquare} from '../Chromino/ChrominoSquare';
import {Grid} from './Grid';
import {ChrominoGame} from '../ChrominoGame';
import {Utils} from '../Utils';

export class Board extends Actor {
  private readonly grid: Grid;

  constructor() {
    super();
    this.grid = new Grid();
  }

  onInitialize(engine: ChrominoGame): void {
    this.height = engine.canvasHeight;
    this.width = engine.canvasWidth;

    Chromino.getAllChrominos().forEach(chromino => {
      this.add(chromino);
      this.scene.add(chromino);
    });

    this.add(new Actor(0, 0, 2000, 3, Color.Black));
    this.add(new Actor(0, 0, 3, 2000, Color.Black));
    for (let xt = -5; xt <= 5; xt++) {
      for (let yt = -5; yt <= 5; yt++) {
        const a = new Label('(' + String(xt) + ', ' + String(yt) + ')', xt * 50 + 25, yt * 50 - 25);
        a.fontSize = 16;
        a.baseAlign = BaseAlign.Middle;
        a.textAlign = TextAlign.Center;
        engine.mainScene.add(a);
        a.setZIndex(3);
      }
    }
  }

  registerPlacedPieceOnGrid(chromino: Chromino) {
    chromino.getChrominoSquares().forEach(square => {
      this.grid.put(square.boardX, square.boardY, square.color);
    });
  }

  isPositionObstructed(chromino: Chromino): boolean {
    return chromino.getChrominoSquares().reduce((obstructed: boolean, square: ChrominoSquare) =>
      obstructed || this.grid.get(square.boardX, square.boardY) != null, false);
  }

  isPositionValid(chromino: Chromino): boolean {
    const colorCount = chromino.getChrominoSquares().reduce((colorContactCount: number, square: ChrominoSquare) => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          // if (dx + dy != -1 && dx + dy != 1) {
          //   continue;
          // }
          const x = square.boardX + dx;
          const y = square.boardY + dy;
          if (this.grid.get(x, y) != null) {
            // console.log(x, y, this.grid.get(x, y), square.color);
          } else {
            if (x == 1 && y == 0 && !chromino.body.collider.bounds.contains(new Vector(25, 25))) {
              const grid = this.grid;
            }
            // console.log(x, y, this.grid);
          }
          if (!chromino.occupiesSquare(x, y) && Utils.colorsEqual(this.grid.get(x, y), square.color)) {
            // console.log('was a match');
            return ++colorContactCount;
          }
        }
      }
      return colorContactCount;
    }, 0);
    console.log('matching Colors', colorCount);
    return colorCount >= 2;
  }
}
