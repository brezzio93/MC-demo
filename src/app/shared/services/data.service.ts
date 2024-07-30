import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  settingsReady = false;
  villains: any = [];
  modularSets: any = [];
  planList: any = [];
  heroes: any = [];
  allies: any = [];
  minions: any;

  constructor(private http: HttpClient) { }

  getEncounterCardsData(): Observable<any> {
    return this.http.get('https://es.marvelcdb.com/api/public/cards/?encounter=1');
  }

  invokePlayersInput = new EventEmitter();

  updatePlayers(playersInput: number) {
    this.invokePlayersInput.emit(playersInput);
  }
}
