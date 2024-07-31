import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxFormModule, DxSelectBoxModule, DxProgressBarModule, DxTabsModule, DxListModule, DxButtonModule, DxTagBoxModule, } from 'devextreme-angular';

import { HomeComponent } from './pages/home/home.component';
import { VillainSelectorComponent } from './pages/villain-selector/villain-selector.component';

import { AuthGuardService } from './shared/services';
import { PlayersComponent } from './pages/players/players.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    CommonModule,
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxProgressBarModule,
    DxTabsModule,
    DxListModule,
    DxButtonModule,
    DxTagBoxModule,
  ],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    PlayersComponent,
    VillainSelectorComponent,
  ]
})
export class AppRoutingModule { }
