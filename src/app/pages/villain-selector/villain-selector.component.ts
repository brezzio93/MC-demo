import { Component, Input, OnInit } from '@angular/core';
import { SingleMultipleAllOrNone } from 'devextreme/common';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-villain-selector',
  templateUrl: './villain-selector.component.html',
  styleUrls: ['./villain-selector.component.scss']
})

export class VillainSelectorComponent implements OnInit {

  settingsReady = false;

  villain: any;
  villainPhase: any;

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
    public shared: DataService,
  ) { }

  ngOnInit(): void {
    //Invoked in playersComponent when selecting players quantity
    this.shared.invokePlayersInput.subscribe((players: any) => {
      this.players = players;
      if (this.villain != undefined) {
        this.selectPhase(this.villainPhase);
        this.setMainSchemeUI(0);

        this.plansInPlay.forEach((plan: any) => {
          //Set initial scheme
          let playersMultiplier = (!plan.base_threat_fixed) ? this.players : 1;
          plan['current'] = plan['end'] = (plan.base_threat * playersMultiplier);
          plan.planUI = this.setSideSchemeUI(plan);
        });
      }
    });
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

  selectVillain(e: any) {
    this.villain = this.shared.villains.find((x: any) => x.card_set_code == e)
    this.villainPhase = this.villain.villain_phases[0];
    this.villainPhase['currentHP'] = this.villainPhase.health;
    this.currentScheme = this.villain.main_scheme[0].init;
    this.villainPhase.currentHP = this.villainPhase.maxHP = (this.villainPhase.health * this.players);

    this.setLifepointsUI();
    this.setMainSchemeUI(0);

    //buscamos este texto para saber cuantos conjuntos modulares se ocupan
    // this.villain.main_scheme[0].back_text.find((X) "modular encounter set")

    this.modularSetsSelection = (this.villain.modularSetsQty == 1) ? 'single' : 'multiple';

    this.plansInPlay = [];
    this.planList = [];
    this.villain.side_scheme.forEach((scheme: any) => {
      this.planList.push(scheme)
    });

    console.log(this.planList)
  }

  selectPhase(villainPhase: any) {
    console.log(villainPhase)
    this.villainPhase = villainPhase;
    this.villainPhase.currentHP = this.villainPhase.maxHP = (villainPhase.health * this.players);
    this.setLifepointsUI();
  }

  putSideSchemeInPlay(planIDs: any) {
    console.log(planIDs)

    planIDs.value.forEach((planID: any) => {
      let plan = this.planList.find((x: any) => x.code == planID);

      //Set initial scheme
      let playersMultiplier = (!plan.base_threat_fixed) ? this.players : 1;
      plan['current'] = plan['end'] = (plan.base_threat * playersMultiplier);

      let indexInPlay = this.plansInPlay.findIndex((x: any) => x.code == planID);
      //set UI only if scheme is not already in game
      if (indexInPlay == -1) {
        this.plansInPlay.push(plan);
        this.plansInPlay[this.plansInPlay.length - 1].planUI = this.setSideSchemeUI(this.plansInPlay[this.plansInPlay.length - 1]);
      }

      let indexPlanList = this.planList.findIndex((x: any) => x.code == planID);
      this.planList.splice(indexPlanList, 1);
    })

    console.log(this.planList)
  }

  removeSideScheme(code: any) {
    let index = this.plansInPlay.findIndex((x: any) => x.code == code);
    let plan = this.plansInPlay.find((x: any) => x.code == code);
    this.plansInPlay.splice(index, 1);
    this.planList.push(plan);
    console.log(this.planList);
  }

  selectScheme(e: any) {
    let planList: any[] = [];

    this.villain.side_scheme.forEach((scheme: any) => {
      planList.push(scheme)
    });

    e.value.forEach((card_set_code: any) => {
      let modularSet = this.shared.modularSets.find((x: any) => x.card_set_code == card_set_code);
      modularSet.side_scheme.forEach((plan: any) => {
        for (let i = 1; i <= plan.quantity; i++) {
          planList.push({ ...plan })//Esto nos deja clonar el pobjeto 'plan' sin guardar la referencia, ayudando a diferenciar planes duplicados
        }
      });
    });

    planList.forEach((plan: any, index) => {
      plan.code = plan.code + '_' + index;
    });

    this.planList = planList;
    console.log(planList)
    this.plansInPlay = [];
  }

  acceleratePlan() {
    this.accelToken++;
    this.updateMainScheme(0);
  }

  advancePhaseOne() {
    this.updateMainScheme(-(this.villain.main_scheme[this.schemePhase].toAdvance - this.currentScheme));
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

    let max = (plan.current < plan.end) ? plan.end : plan.current;

    for (let i = 1; i <= max; i++) {
      if (rows[rowIndex] == undefined) rows[rowIndex] = [];
      rows[rowIndex].push({ state: plan.current >= i, index: i });
      if (i % 10 == 0) {
        rowIndex++;
        qty = 1;
      }
      qty++;
    }
    return rows;
  }

}