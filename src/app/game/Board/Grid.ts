import {Color} from 'excalibur';

export class Grid {
  private grid: Map<number, Map<number, Color>>;

  constructor() {
    this.grid = new Map();
  }

  get(x: number, y: number): Color {
    if (!this.grid.has(x) || !this.grid.get(x).has(y)) {
      return null;
    } else {
      return this.grid.get(x).get(y);
    }
  }

  put(x: number, y: number, color: Color) {
    console.log('putting', x, y, color);
    if (!this.grid.has(x)) {
      this.grid.set(x, new Map());
    }
    this.grid.get(x).set(y, color);
    console.log(this.grid);
  }
}
