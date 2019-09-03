import {Color, UIActor} from 'excalibur';
import {ChrominoGame} from '../ChrominoGame';
import {Constants} from '../Constants';
import {DrawFromStockButton} from './DrawFromStockButton';
import {GameState} from '../Engine/GameState';

export class Interface extends UIActor {
  private drawFromStockButton: DrawFromStockButton;

  onInitialize(engine: ChrominoGame): void {
    super.onInitialize(engine);
    this.drawFromStockButton = new DrawFromStockButton(engine.canvasWidth - 100, engine.halfCanvasHeight - 200, 100, 75);
    engine.mainScene.add(this.drawFromStockButton);
  }

  notifyStateChange(gameState: GameState) {
    this.drawFromStockButton.setDeckSize(gameState.deckSize);
    console.log(gameState);
  }
}
