import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VillainsService {


  villains = [
    //CORE SET
    {
      id: 'core_01',
      text: 'Rhino',
      phases: [
        { id: 'rhino_phase_01', text: 'Rhino I', hp: 14, atk: 2, sch: 1 },
        { id: 'rhino_phase_02', text: 'Rhino II', hp: 15, atk: 3, sch: 1 },
        { id: 'rhino_phase_03', text: 'Rhino III', hp: 16, atk: 4, sch: 1 },
      ],
      schemesMain: [
        { init: 0, step: 1, end: 7, text: "The Break-In!" },
      ],
      modularSetsQty: 1,
      schemesSide: [
        { id: 'rhino_side_01', text: "Breakin' & Takin'", init: 2, initPerPlayer: 0, addedPerPlayer: 1 },
        { id: 'rhino_side_02', text: "Crowd Control", init: 0, initPerPlayer: 2, addedPerPlayer: 0 },
      ],
      minions: [
        { id: 'rhino_minion_01', text: 'Hydra Mercenary', hp: 3, atk: 1, sch: 0 },
        { id: 'rhino_minion_02', text: 'Hydra Mercenary', hp: 3, atk: 1, sch: 0 },
        { id: 'rhino_minion_03', text: 'Sandman', hp: 4, atk: 3, sch: 2 },
        { id: 'rhino_minion_03', text: 'Shocker', hp: 3, atk: 2, sch: 1 },
      ],
    },
    {
      id: 'core_02',
      text: 'Klaw',
      hp: [12, 18, 22],
      phases: [
        { id: 'klaw_phase_01', text: 'Klaw I', hp: 12, atk: 0, sch: 2 },
        { id: 'klaw_phase_02', text: 'Klaw II', hp: 18, atk: 1, sch: 2 },
        { id: 'klaw_phase_03', text: 'Klaw III', hp: 22, atk: 2, sch: 3 },
      ],
      schemesMain: [
        { init: 0, step: 1, end: 6, text: "Underground Distribution" },
        { init: 0, step: 1, end: 8, text: "Secret Rendezvous" },
      ],
      modularSetsQty: 1,
      schemesSide: [
        { id: 'klaw_side_scheme_01', text: "Defense Network", init: 2, initPerPlayer: 0, addedPerPlayer: 1 },
        { id: 'klaw_side_scheme_02', text: "Illegal Arms Factory", init: 3, initPerPlayer: 0, addedPerPlayer: 1 },
        { id: 'klaw_side_scheme_03', text: 'The "Immortal" Klaw', init: 0, initPerPlayer: 3, addedPerPlayer: 0 },
      ],
      minions: [
        { id: 'klaw_minion_01', text: 'Armored Guard', hp: 3, atk: 1, sch: 0 },
        { id: 'klaw_minion_02', text: 'Armored Guard', hp: 3, atk: 1, sch: 0 },
        { id: 'klaw_minion_03', text: 'Weapons Runner', hp: 2, atk: 1, sch: 1 },
        { id: 'klaw_minion_04', text: 'Weapons Runner', hp: 2, atk: 1, sch: 1 },
      ],
    },
    {
      id: 'core_03',
      text: 'Ultron',
      phases: [
        { id: 'ultron_phase_1', text: 'Ultron I', hp: 17, atk: 2, sch: 1 },
        { id: 'ultron_phase_2', text: 'Ultron II', hp: 22, atk: 2, sch: 2 },
        { id: 'ultron_phase_3', text: 'Ultron III', hp: 27, atk: 4, sch: 2 },
      ],
      schemesMain: [
        { init: 0, step: 1, end: 3, text: "The Crimsom Cowl" },
        { init: 0, step: 1, end: 10, text: "Assault on NORAD" },
        { init: 0, step: 1, end: 5, text: "Countdown to Oblivion" },
      ],
      modularSetsQty: 1,
      schemesSide: [
        { id: 'ultron_side_scheme_01', text: "Drone Factory", init: 4, initPerPlayer: 0, addedPerPlayer: 0 },
        { id: 'ultron_side_scheme_02', text: "Invasive AI", init: 0, initPerPlayer: 3, addedPerPlayer: 0 },
        { id: 'ultron_side_scheme_03', text: "Ultron's Imperative", init: 0, initPerPlayer: 2, addedPerPlayer: 0 },
      ],
      minions: [
        { id: 'ultron_minion_01', text: 'Advanced Ultron Drone', hp: 4, atk: 1, sch: 1 },
        { id: 'ultron_minion_02', text: 'Advanced Ultron Drone', hp: 4, atk: 1, sch: 1 },
        { id: 'ultron_minion_03', text: 'Advanced Ultron Drone', hp: 4, atk: 1, sch: 1 },
      ],
    },

    //WREKING CREW

    //GREEN GOBLIN

    //RISE OF RED SKULL
    {
      id: 'rise_of_red_skull_01',
      text: 'Crossbones',
      phases: [
        { id: 'crossbones_phase_1', text: 'Crossbones I', hp: 12, atk: 1, sch: 1 },
        { id: 'crossbones_phase_2', text: 'Crossbones II', hp: 14, atk: 2, sch: 2 },
        { id: 'crossbones_phase_3', text: 'Crossbones III', hp: 16, atk: 3, sch: 2 },
      ],
      schemesMain: [
        { init: 0, step: 1, end: 3, text: "Attack on Mount Athena" },
        { init: 1, step: 1, end: 6, text: "The Infinity Stone" },
      ],
      modularSetsQty: 3,
      schemesSide: [
        { id: 'crossbones_side_scheme_01', text: "Crossbones' Assaul", init: 0, addedPerPlayer: 2 },
        { id: 'crossbones_side_scheme_02', text: "Cornered Staff", init: 3, addedPerPlayer: 0 },
      ],
      minions: [
        { id: 'crossbones_minion_01', text: 'Hydra Bomber', hp: 2, atk: 1, sch: 1 },
        { id: 'crossbones_minion_02', text: 'Hydra Bomber', hp: 2, atk: 1, sch: 1 },
      ],
    },

  ]

  modularSets: any = [
    {
      id: 'core_01',
      text: "Bomb Scare",
      plans: [
        { id: 1, text: "Bomb Scare", init: 2, addedPerPlayer: 1 },
      ],
      minions: [
        { id: 'bomb_scare_01', text: 'Hydra Bomber', hp: 2, atk: 1, sch: 1 },
        { id: 'bomb_scare_01', text: 'Hydra Bomber', hp: 2, atk: 1, sch: 1 },
      ]
    },
    {
      id: 'core_02',
      text: "Masters of Evil",
      plans: [
        { id: 1, text: "The Masters of Evil", init: 3, addedPerPlayer: 0 },
      ],
      minions: [
        { id: 'masters_of_evil_01', text: 'Radioactive Man', hp: 7, atk: 1, sch: 1 },
        { id: 'masters_of_evil_02', text: 'Whirlwind', hp: 6, atk: 2, sch: 1 },
        { id: 'masters_of_evil_03', text: 'Tiger Shark', hp: 6, atk: 3, sch: 1 },
        { id: 'masters_of_evil_04', text: 'Melter', hp: 5, atk: 3, sch: 1 },
      ],
    },
    {
      id: 'core_03',
      text: "Under Attack",
      plans: [
        { id: 1, text: "Under Attack", init: 3, addedPerPlayer: 0 },
      ],
      minions: [] //No minions
    },
    {
      id: 'core_04',
      text: "Legions of Hydra",
      plans: [
        { id: 1, text: "Legions of Hydra", init: 3, addedPerPlayer: 0 },
        { id: 2, text: "Legions of Hydra", init: 3, addedPerPlayer: 0 },
      ],
      minions: [
        { id: 'legions_of_hydra_01', text: 'Madame Hydra', hp: 6, atk: 2, sch: 2 },
        { id: 'legions_of_hydra_02', text: 'Hydra Soldier', hp: 4, atk: 2, sch: 1 },
        { id: 'legions_of_hydra_03', text: 'Hydra Soldier', hp: 4, atk: 2, sch: 1 },
        { id: 'legions_of_hydra_04', text: 'Hydra Soldier', hp: 4, atk: 2, sch: 1 },
      ]
    },
    {
      id: 'core_05',
      text: "The Doomsday Chair",
      plans: [
        { id: 1, text: "The Doomsday Chair", init: 8, addedPerPlayer: 0 },
        { id: 2, text: "The Doomsday Chair", init: 8, addedPerPlayer: 0 },
      ],
      minions: [
        { id: 'the_doomsday_chair', text: 'MODOK', hp: 8, atk: 2, sch: 2 },
      ]
    },
    {
      id: 'rise_of_red_skull_01',
      text: "Experimental Weapons",
      plans: [], //NO plans
      minions: [], //NO minions
    },
  ]

  constructor(private http: HttpClient) { }

  getCardsData(): Observable<any> {
    return this.http.get('http://marvelcdb.com/api/public/cards');
  }

  invokePlayersInput = new EventEmitter();

  updatePlayers(playersInput: number) {
    this.invokePlayersInput.emit(playersInput);
  }
}
