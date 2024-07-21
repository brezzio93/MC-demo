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

  villains: any;
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
    this.villains = this.vService.villains;
    this.modularSets = this.vService.modularSets;
    this.vService.invokePlayersInput.subscribe((players: any) => {
      this.players = players;
      if (this.villain != undefined) {
        // this.selectVillain(this.villain.id)
        this.selectPhase([this.villainPhase]);
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
    this.villainPhase = this.villain.phases[0];
    this.villainPhase['currentHP'] = this.villainPhase.hp;
    this.currentScheme = this.villain.schemesMain[0].init;
    this.villainPhase.currentHP = this.villainPhase.maxHP = (this.villainPhase.hp * this.players);

    this.setLifepointsUI();
    this.setMainSchemeUI(0);

    this.modularSetsSelection = (this.villain.modularSetsQty == 1) ? 'single' : 'multiple';

    this.plansInPlay = [];
    this.planList = [];
    this.villain.schemesSide.forEach((scheme: any) => {
      this.planList.push(scheme)
    });
  }

  selectPhase(e: any) {
    this.villainPhase = e[0];
    this.villainPhase.currentHP = this.villainPhase.maxHP = (this.villainPhase.hp * this.players);
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
    this.updateMainScheme(-(this.villain.schemesMain[this.schemePhase].toAdvance - this.currentScheme));
  }

  updateMainScheme(qty: any) {
    this.currentScheme = this.currentScheme - qty;
    if (this.currentScheme < 0) this.currentScheme = 0;

    this.villain.schemesMain[this.schemePhase].toAdvance = this.accelToken + this.currentScheme + (this.villain.schemesMain[this.schemePhase].step * this.players);

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
    if (index >= this.villain.schemesMain.length) {
      this.resetSettings();
    }
    else {
      this.schemePhase = index;
      let rows: any = [[]];
      let rowIndex = 0;
      let qty = 1;


      this.currentScheme = this.villain.schemesMain[index].init;

      this.villain.schemesMain[index].toAdvance = this.accelToken + this.currentScheme + (this.villain.schemesMain[index].step * this.players);
      this.villain.schemesMain[index].maxEnd = this.villain.schemesMain[index].end * this.players;
      for (let i = 1; i <= this.villain.schemesMain[index].maxEnd; i++) {
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