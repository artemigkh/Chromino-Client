import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ChrominoGame} from './game/ChrominoGame';
import {MultiplayerService} from './game/Engine/MultiplayerService';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    ChrominoGame,
    MultiplayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
