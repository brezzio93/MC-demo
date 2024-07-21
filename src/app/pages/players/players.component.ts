import { VillainsService } from 'src/app/shared/services/villains.service';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})

export class PlayersComponent {

  playersInput = 0;
  playersOptions = [
    {text:1},
    {text:2},
    {text:3},
    {text:4},
  ];

  constructor(
    private vService: VillainsService
  ){}

  selectPlayers(players: any) {
    this.playersInput = players;
    this.vService.updatePlayers(this.playersInput)
  }

}
