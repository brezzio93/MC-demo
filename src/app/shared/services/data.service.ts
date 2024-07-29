import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  villains: any = [];
  modularSets: any = [];
  heroes: any = [];
  settingsReady = false;

  constructor(private http: HttpClient) { }

  getEncounterCardsData(): Observable<any> {
    return this.http.get('https://es.marvelcdb.com/api/public/cards/?encounter=1');
  }

  invokePlayersInput = new EventEmitter();

  updatePlayers(playersInput: number) {
    this.invokePlayersInput.emit(playersInput);
  }
}
