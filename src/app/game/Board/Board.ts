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

    // this.add(new Actor(0, 0, 2000, 3, Color.Black));
    // this.add(new Actor(0, 0, 3, 2000, Color.Black));
    // for (let xt = -5; xt <= 5; xt++) {
    //   for (let yt = -5; yt <= 5; yt++) {
    //     const a = new Label('(' + String(xt) + ', ' + String(yt) + ')', xt * 50 + 25, yt * 50 - 25);
    //     a.fontSize = 16;
    //     a.baseAlign = BaseAlign.Middle;
    //     a.textAlign = TextAlign.Center;
    //     engine.mainScene.add(a);
    //     a.setZIndex(3);
    //   }
    // }
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
    let noDifferentColorContact = true;
    const colorCount = chromino.getChrominoSquares().reduce((colorContactCount: number, square: ChrominoSquare) => {
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(d => {
        const x = square.boardX + d[0];
        const y = square.boardY + d[1];
        if (!chromino.occupiesSquare(x, y)) {
          const colorOnGrid = this.grid.get(x, y);
          if (Utils.colorsEqual(colorOnGrid, square.color)) {
            colorContactCount++;
          } else if (colorOnGrid != null) {
            noDifferentColorContact = false;
          }
        }
      });
      return colorContactCount;
    }, 0);
    console.log('matching Colors', colorCount);
    return colorCount >= 2 && noDifferentColorContact;
  }
}
