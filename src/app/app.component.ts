import { Component } from '@angular/core';
import {Chromino} from './game/Chromino';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Chromino-Client';

  constructor() {
    (new Chromino()).start();
  }
}
