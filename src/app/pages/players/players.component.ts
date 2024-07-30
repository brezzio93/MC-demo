import { Component, EventEmitter, Output } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})

export class PlayersComponent {

  playersInput = 0;
  playersOptions = [
    { text: 1 },
    { text: 2 },
    { text: 3 },
    { text: 4 },
  ];

  players: any = [];
  lifePointsUI: any = [];

  minionList = [];

  constructor(
    public shared: DataService
  ) { }

  selectPlayers(players: any) {
    this.playersInput = players;
    for (let i = 0; i < players; i++) {
      this.players.push();
    }
    this.shared.updatePlayers(this.playersInput)
  }

  selectHero(hero_card_set_code: any, index: number) {
    let hero = this.shared.heroes.find((x: any) => x.card_set_code == hero_card_set_code)
    hero.currentHP = hero.maxHP = hero.health;
    hero.alliesDropdown = [];
    hero.allies.forEach((ally: any) => {
      hero.alliesDropdown.push(ally);
    });
    this.shared.allies.forEach((ally: any) => {
      hero.alliesDropdown.push(ally);
    });
    this.setLifepointsUI(hero, index);
    this.players[index] = hero;
    console.log(hero)
  }

  updateHP(heroIndex: any, qty: any) {
    this.players[heroIndex].currentHP = this.players[heroIndex].currentHP - qty;
    if (this.players[heroIndex].currentHP < 0) this.players[heroIndex].currentHP = 0;
    if (this.players[heroIndex].currentHP >= this.players[heroIndex].maxHP) this.setLifepointsUI(this.players[heroIndex], heroIndex);

    this.lifePointsUI[heroIndex].forEach((row: any[]) => {
      row.forEach(circles => {
        circles.state = true;
      })
    })

    this.lifePointsUI[heroIndex].forEach((row: any[]) => {
      row.forEach(circle => {
        if (circle.index > this.players[heroIndex].currentHP) circle.state = false;
      })
    })
  }

  putAllyInPlay(e: any, heroIndex: any) {

  }

  setLifepointsUI(hero: any, index: number) {
    let rows: any = [[]];
    let rowIndex = 0;
    let qty = 1;

    for (let i = 1; i <= hero.currentHP; i++) {
      if (rows[rowIndex] == undefined) rows[rowIndex] = [];
      rows[rowIndex].push({ state: true, index: i });
      if (i % 10 == 0) {
        rowIndex++;
        qty = 1;
      }
      qty++;
    }

    this.lifePointsUI[index] = rows;
  }

}
