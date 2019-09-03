import {Actor, Color, Label, UIActor} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';

export class DrawFromStockButton extends UIActor {
  private deckSize: number;
  private label: Label;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.deckSize = 80;
  }

  onInitialize(engine: ChrominoGame): void {
    this.color = Color.White;
    this.label = new Label('Draw  ' + String(this.deckSize));
    this.label.fontSize = 16;
    this.label.x = 0;
    this.label.y = 50;
    this.add(this.label);
    this.enableCapturePointer = true;

    this.on('pointerup', () => engine.drawChrominoFromStock());
  }

  setDeckSize(deckSize: number) {
    this.deckSize = deckSize;
    this.label.text = 'Draw  ' + String(this.deckSize);
  }
}
