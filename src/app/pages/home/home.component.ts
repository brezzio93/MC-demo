import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {


  villains: any;
  modularSets: any;
  constructor(
    public service: DataService,
  ) { }

  ngOnInit() {
    this.service.getEncounterCardsData().subscribe((res: any) => {
      let heroesPacks: any[] = [];
      let encounterPacks: any[] = [];
      let typeCode: any[] = [];
      res.forEach((card: any) => {
        if (typeCode.find((x: any) => { x == card.type_code }) == undefined) typeCode.push(card.type_code)
        if (card.type_code == 'villain' || card.type_code == 'main_scheme' || card.type_code == 'side_scheme' || card.type_code == 'minion') {
          if (encounterPacks[card.card_set_code] == undefined) encounterPacks[card.card_set_code] = [];
          encounterPacks[card.card_set_code].card_set_code = card.card_set_code;
          encounterPacks[card.card_set_code].text = card.card_set_name;

          if (card.type_code == 'villain') {
            if (encounterPacks[card.card_set_code].villain_phases == undefined) encounterPacks[card.card_set_code].villain_phases = [];
            encounterPacks[card.card_set_code].villain_phases.push(card)
          }

          if (card.type_code == 'main_scheme') {
            if (encounterPacks[card.card_set_code].main_scheme == undefined) encounterPacks[card.card_set_code].main_scheme = [];
            encounterPacks[card.card_set_code].main_scheme.push(card)
          }

          if (card.type_code == 'side_scheme') {
            if (encounterPacks[card.card_set_code].side_scheme == undefined) encounterPacks[card.card_set_code].side_scheme = [];
            encounterPacks[card.card_set_code].side_scheme.push(card)
          }

          if (card.type_code == 'minion') {
            if (encounterPacks[card.card_set_code].minion == undefined) encounterPacks[card.card_set_code].minion = [];
            encounterPacks[card.card_set_code].minion.push(card)
          }

        }
        if (card.type_code == 'hero') {
          if (heroesPacks[card.card_set_code] == undefined) heroesPacks[card.card_set_code] = [];
          heroesPacks[card.card_set_code] = card;
          heroesPacks[card.card_set_code].text = card.card_set_name;

          let colors = [
            "linear-gradient(110deg," + card.meta?.colors[0] + " 65%, transparent 66%)",
            "linear-gradient(110deg," + card.meta?.colors[2] + " 67%, transparent 68%)",
            "linear-gradient(110deg," + card.meta?.colors[1] + " 75%, " + card.meta?.colors[1] + " 75%)",
          ]
          if (card.meta) heroesPacks[card.card_set_code].colors = colors[0] + "," + colors[1] + "," + colors[2];

        }
        if (card.type_code == 'ally') {
          if (heroesPacks[card.card_set_code] == undefined) heroesPacks[card.card_set_code] = [];
          if (heroesPacks[card.card_set_code].allies == undefined) heroesPacks[card.card_set_code].allies = [];
          heroesPacks[card.card_set_code].allies.push(card)
        }
      });

      typeCode = [...new Set(typeCode)];
      console.log(typeCode);

      let mainSets: any[] = [];
      let modularSets: any[] = [];
      for (const key in encounterPacks) {
        const pack = encounterPacks[key];
        if (pack.main_scheme != undefined) {
          if (pack.villain_phases) {
            pack.villain_phases.forEach((villain_phase: any) => {
              villain_phase.card_text = villain_phase.text;
              villain_phase.text = villain_phase.name + ' ' + villain_phase.stage;
            });
          }
          mainSets.push(pack);
        }
        else {
          if (!pack.card_set_code.includes("_nemesis"))
            modularSets.push(pack);
        }
      }

      let heroSets: any[] = [];
      let allySets: any[] = [];
      for (const key in heroesPacks) {
        const pack = heroesPacks[key];
        if (pack.card_set_code) {
          heroSets.push(pack);
        }
        else {
          console.log(pack)
          pack.allies.forEach((ally: any) => {
            allySets.push(ally);
          });
        }
      }
      console.log(heroSets);
      console.log(allySets);

      this.service.villains = this.villains = mainSets;
      this.service.modularSets = this.modularSets = modularSets;
      this.service.heroes = heroSets;

    });
  }

  startGame() {
    this.service.settingsReady = true;
  }
}
