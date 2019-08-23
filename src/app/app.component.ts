import { Component } from '@angular/core';
import {ChrominoGame} from './game/ChrominoGame';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ChrominoGame-Client';

  constructor() {
    (new ChrominoGame()).start();
  }
}
