import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {PiecePlacement} from './PiecePlacement';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {ChrominoColor} from '../Chromino/ChrominoColor';
import {GameState} from './GameState';

@Injectable()
export class MultiplayerService {
  private piecePlacementSubject: WebSocketSubject<PiecePlacement>
    = webSocket('ws://localhost:8844/piecePlacement');
  private gameStateSubject: WebSocketSubject<GameState>
    = webSocket('ws://localhost:8844/stateChange');

  piecePlacements = this.piecePlacementSubject.asObservable();
  gameStateChange = this.gameStateSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  createNewGame(): Observable<null> {
    return this.http.post<null>('http://localhost:8844/createNewGame', {});
  }

  drawChrominosFromStock(count: number): Observable<ChrominoColor[][]> {
    return this.http.get<ChrominoColor[][]>('http://localhost:8844/drawFromStock?count=' + String(count));
  }

  drawChrominoFromStock(): Observable<ChrominoColor[]> {
    return this.http.get<ChrominoColor[]>('http://localhost:8844/drawFromStock?count=1');
  }
}
