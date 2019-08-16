import {Engine} from 'excalibur';

export class Chromino {
  engine: Engine;
  constructor() {
    this.engine = new Engine();
  }

  start() {
    this.engine.start();
  }
}
