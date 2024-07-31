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

  minionList: any[][] = [];
  minionsInPlay: any[][] = [];

  constructor(
    public shared: DataService
  ) { }

  ngOnInit(): void {
    //Invoked in villainSelectorComponent when finishing game (pressing "next phase" button when in last plan)
    this.shared.invokeResetSettings.subscribe((options: any) => {
      this.players = [];
      this.playersInput = 0;
    });
  }

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
    if (hero.allies)
      hero?.allies.forEach((ally: any) => {
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

  updateMinionHP(damage: number, minion: any, heroIndex?: any) {
    let auxMinion = this.minionsInPlay[heroIndex].find((x: any) => x.code == minion.code)
    auxMinion.current = auxMinion.current - damage;

    if (auxMinion.current < 0) auxMinion.current = 0;
    if (auxMinion.current >= auxMinion.end) auxMinion.ui = this.setMinionUI(auxMinion);

    auxMinion.ui.forEach((row: any[]) => {
      row.forEach(circles => {
        circles.state = true;
      })
    })

    auxMinion.ui.forEach((row: any[]) => {
      row.forEach(circle => {
        if (circle.index > auxMinion.current) circle.state = false;
      })
    })
  }

  putAllyInPlay(e: any, heroIndex: any) {
  }

  putMinionInPlay(e: any, heroIndex: any) {
    if (this.minionsInPlay[heroIndex] == undefined) this.minionsInPlay[heroIndex] = [];
    e.value.forEach((code: any) => {
      let minion = this.shared.minions.find((x: any) => x.code == code);

      //Set initial HP
      let playersMultiplier = (!minion.health_per_hero) ? this.playersInput : 1;
      let indexInPlay = this.minionsInPlay[heroIndex].findIndex((x: any) => x.code == code);

      //set UI only if scheme is not already in game
      if (indexInPlay == -1) {
        minion['current'] = minion['end'] = (minion.health * playersMultiplier);
        this.minionsInPlay[heroIndex].push({ ...minion });
        this.minionsInPlay[heroIndex][this.minionsInPlay[heroIndex].length - 1].ui = this.setMinionUI(this.minionsInPlay[heroIndex][this.minionsInPlay[heroIndex].length - 1]);
      }
    })
    console.log(this.minionsInPlay)
  }

  removeMinion(code: any, heroIndex: any) {
    let index = this.minionsInPlay[heroIndex].findIndex((x: any) => x.code == code)
    let plan = this.minionsInPlay[heroIndex].find((x: any) => x.code == code);
    this.minionsInPlay[heroIndex].splice(index, 1);
    // this.minionList.push(plan);
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

  setMinionUI(minion: any): any {
    let rows: any = [[]];
    let rowIndex = 0;
    let qty = 1;

    let max = (minion.current < minion.end) ? minion.end : minion.current;

    for (let i = 1; i <= max; i++) {
      const element = minion[i];
      if (rows[rowIndex] == undefined) rows[rowIndex] = [];
      rows[rowIndex].push({ state: minion.current >= i, index: i });
      if (i % 10 == 0) {
        rowIndex++;
        qty = 1;
      }
      qty++;

    }
    return rows;
  }

  setAllyUI(ally: any) {

    let rows: any = [[]];
    return rows;
  }

}
