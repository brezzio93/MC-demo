import { Component, Input, OnInit } from '@angular/core';
import { SingleMultipleAllOrNone } from 'devextreme/common';
import { VillainsService } from 'src/app/shared/services/villains.service';

@Component({
  selector: 'app-villain-selector',
  templateUrl: './villain-selector.component.html',
  styleUrls: ['./villain-selector.component.scss']
})

export class VillainSelectorComponent implements OnInit {

  settingsReady = false;

  villains: any = [];
  villain: any;
  villainPhase: any;

  modularSets: any;
  modularSetsSelection: SingleMultipleAllOrNone = 'single';

  currentScheme = 0;
  schemePhase = 0;
  accelToken = 0;

  planList: any = [];
  plansInPlay: any = [];

  lifePointsUI: { state: boolean; index: number }[][] = [];
  mainSchemeUI: { state: boolean; index: number }[][] = [];

  @Input() players: number = 0;

  constructor(
    private vService: VillainsService,
  ) { }

  ngOnInit(): void {
    this.vService.getEncounterCardsData().subscribe((res: any) => {
      let packs: any[] = [];
      let typeCode: any[] = [];
      res.forEach((card: any) => {
        if (typeCode.find((x: any) => { x == card.type_code }) == undefined) typeCode.push(card.type_code)
        if (card.type_code == 'villain' || card.type_code == 'main_scheme' || card.type_code == 'minion') {
          if (packs[card.card_set_code] == undefined) packs[card.card_set_code] = [];
          packs[card.card_set_code].text = card.card_set_name;
          packs[card.card_set_code].id = card.card_set_code;

          if (card.type_code == 'villain') {
            if (packs[card.card_set_code].villain_phases == undefined) packs[card.card_set_code].villain_phases = [];
            packs[card.card_set_code].villain_phases.push(card)
          }

          if (card.type_code == 'main_scheme') {
            if (packs[card.card_set_code].main_scheme == undefined) packs[card.card_set_code].main_scheme = [];
            packs[card.card_set_code].main_scheme.push(card)
          }

          if (card.type_code == 'minion') {
            if (packs[card.card_set_code].minion == undefined) packs[card.card_set_code].minion = [];
            packs[card.card_set_code].minion.push(card)
          }

        }
      });

      let mainSets: any[] = [];
      let modularSets: any[] = [];
      for (const key in packs) {
        const pack = packs[key];
        if (pack.main_scheme != undefined) {
          if (pack.villain_phases) {
            pack.villain_phases.forEach((villain_phase: any) => {
              villain_phase.card_text = villain_phase.text;
              villain_phase.text = villain_phase.name + ' ' + villain_phase.stage;
            });
          }
          mainSets.push(pack);
        }
        else
          modularSets.push(pack);
      }

      // typeCode = [...new Set(typeCode)];
      // console.log(typeCode);

      console.log(mainSets);

      this.villains = mainSets;
      this.modularSets = modularSets;

    });

    // this.modularSets = this.vService.modularSets;

    //Invoked in playersComponent when selecting players quantity
    this.vService.invokePlayersInput.subscribe((players: any) => {
      this.players = players;
      if (this.villain != undefined) {
        this.selectPhase(this.villainPhase);
        this.setMainSchemeUI(0);

        this.plansInPlay.forEach((plan: any) => {
          plan['current'] = plan['end'] = plan.init + (plan.initPerPlayer * this.players) + (plan.addedPerPlayer * this.players);
          plan.planUI = this.setSideSchemeUI(plan);
        });
      }
    });
  }

  startGame() {
    this.settingsReady = true;
  }

  selectVillain(e: any) {
    this.villain = this.villains.find((x: any) => x.id == e)
    this.villainPhase = this.villain.villain_phases[0];
    this.villainPhase['currentHP'] = this.villainPhase.health;
    this.currentScheme = this.villain.main_scheme[0].init;
    this.villainPhase.currentHP = this.villainPhase.maxHP = (this.villainPhase.health * this.players);

    this.setLifepointsUI();
    this.setMainSchemeUI(0);

    this.modularSetsSelection = (this.villain.modularSetsQty == 1) ? 'single' : 'multiple';

    this.plansInPlay = [];
    this.planList = [];
    // this.villain.schemesSide.forEach((scheme: any) => {
    //   this.planList.push(scheme)
    // });
  }

  selectPhase(villainPhase: any) {
    console.log(villainPhase)
    this.villainPhase = villainPhase;
    this.villainPhase.currentHP = this.villainPhase.maxHP = (villainPhase.health * this.players);
    this.setLifepointsUI();
  }

  putPlanInPlay(planID: any) {

    let plan = this.planList.find((x: any) => x.id == planID);

    let index = this.planList.findIndex((x: any) => x.id == planID);
    this.planList.splice(index, 1);

    plan['current'] = plan['end'] = plan.init + (plan.initPerPlayer * this.players) + (plan.addedPerPlayer * this.players);
    this.plansInPlay.push(plan);

    this.plansInPlay.forEach((inPlay: any) => {
      inPlay.planUI = this.setSideSchemeUI(inPlay);
    });
  }

  removePlan(id: any) {
    let index = this.plansInPlay.findIndex((x: any) => x.id == id);
    let plan = this.plansInPlay.find((x: any) => x.id == id);
    this.plansInPlay.splice(index, 1);
    this.planList.push(plan);
  }

  updateHP(qty: any) {
    this.villainPhase.currentHP = this.villainPhase.currentHP - qty;
    if (this.villainPhase.currentHP < 0) this.villainPhase.currentHP = 0;
    if (this.villainPhase.currentHP >= this.villainPhase.maxHP) this.setLifepointsUI();

    this.lifePointsUI.forEach(row => {
      row.forEach(circles => {
        circles.state = true;
      })
    })

    this.lifePointsUI.forEach(row => {
      row.forEach(circle => {
        if (circle.index > this.villainPhase.currentHP) circle.state = false;
      })
    })
  }

  selectScheme(e: any) {
    e.removedItems.forEach((modularSet: any) => {
      modularSet.plans.forEach((plan: any) => {
        let index = this.planList.findIndex((x: any) => x.id == plan.id);
        this.planList.splice(index, 1);
      });
    });

    e.addedItems.forEach((modularSet: any) => {
      modularSet.plans.forEach((plan: any) => {
        this.planList.push(plan);
      });
    });

    // this.planList = planList;
    this.plansInPlay = [];
  }

  acceleratePlan() {
    this.accelToken++;
    this.updateMainScheme(0);
  }

  advancePhaseOne() {
    this.updateMainScheme(-(this.villain.main_scheme[this.schemePhase].toAdvance - this.currentScheme));
  }

  updateMainScheme(qty: any) {
    this.currentScheme = this.currentScheme - qty;
    if (this.currentScheme < 0) this.currentScheme = 0;

    this.villain.main_scheme[this.schemePhase].toAdvance = this.accelToken + this.currentScheme + (this.villain.main_scheme[this.schemePhase].escalation_threat * this.players);

    this.mainSchemeUI.forEach(row => {
      row.forEach(circles => {
        circles.state = true;
      })
    })

    this.mainSchemeUI.forEach(row => {
      row.forEach(circle => {
        if (circle.index > this.currentScheme) circle.state = false;
      })
    })
  }

  updateSideScheme(qty: any, plan: any) {
    plan.current = plan.current - qty;
    // if (plan.current > plan.end) plan.current = plan.end;
    if (plan.current < 0) plan.current = 0;
    if (plan.current >= plan.end) plan.planUI = this.setSideSchemeUI(plan);


    plan.planUI.forEach((row: any[]) => {
      row.forEach(circles => {
        circles.state = true;
      })
    })

    plan.planUI.forEach((row: any[]) => {
      row.forEach(circle => {
        if (circle.index > plan.current) circle.state = false;
      })
    })
  }

  setLifepointsUI() {
    let rows: any = [[]];
    let rowIndex = 0;
    let qty = 1;

    for (let i = 1; i <= this.villainPhase.currentHP; i++) {
      if (rows[rowIndex] == undefined) rows[rowIndex] = [];
      rows[rowIndex].push({ state: true, index: i });
      if (i % 10 == 0) {
        rowIndex++;
        qty = 1;
      }
      qty++;
    }

    this.lifePointsUI = rows;
  }

  setMainSchemeUI(index: number) {
    if (index >= this.villain.main_scheme.length) {
      this.resetSettings();
    }
    else {
      this.schemePhase = index;
      let rows: any = [[]];
      let rowIndex = 0;
      let qty = 1;


      this.currentScheme = this.villain.main_scheme[index].base_threat;

      this.villain.main_scheme[index].toAdvance = this.accelToken + this.currentScheme + (this.villain.main_scheme[index].escalation_threat * this.players);
      this.villain.main_scheme[index].maxEnd = this.villain.main_scheme[index].threat * this.players;
      for (let i = 1; i <= this.villain.main_scheme[index].maxEnd; i++) {
        if (rows[rowIndex] == undefined) rows[rowIndex] = [];
        rows[rowIndex].push({ state: false, index: i });
        if (i % 10 == 0) {
          rowIndex++;
          qty = 1;
        }
        qty++;
      }

      this.mainSchemeUI = rows;
    }
  }

  setSideSchemeUI(plan: any) {
    let rows: any = [[]];
    let rowIndex = 0;
    let qty = 1;

    for (let i = 1; i <= plan.current; i++) {
      if (rows[rowIndex] == undefined) rows[rowIndex] = [];
      rows[rowIndex].push({ state: true, index: i });
      if (i % 10 == 0) {
        rowIndex++;
        qty = 1;
      }
      qty++;
    }
    return rows;
  }

  resetSettings() {
    this.settingsReady = false;
    this.currentScheme = 0;
    this.schemePhase = 0;
    this.accelToken = 0;

    this.villain = undefined;
    this.villainPhase = undefined;

    this.plansInPlay = [];
    this.planList = [];
  }

}