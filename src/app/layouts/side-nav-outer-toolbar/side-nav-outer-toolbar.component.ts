import { Component, OnInit, NgModule, Input, ViewChild } from '@angular/core';
import { SideNavigationMenuModule, HeaderModule } from '../../shared/components';
import { ScreenService } from '../../shared/services';
import { DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxDrawerModule, DxDrawerTypes } from 'devextreme-angular/ui/drawer';
import { DxScrollViewModule, DxScrollViewComponent } from 'devextreme-angular/ui/scroll-view';
import { CommonModule } from '@angular/common';

import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-side-nav-outer-toolbar',
  templateUrl: './side-nav-outer-toolbar.component.html',
  styleUrls: ['./side-nav-outer-toolbar.component.scss']
})
export class SideNavOuterToolbarComponent implements OnInit {
  @ViewChild(DxScrollViewComponent, { static: true }) scrollView!: DxScrollViewComponent;
  selectedRoute = '';

  menuOpened!: boolean;
  temporaryMenuOpened = false;

  @Input()
  title!: string;

  menuMode: DxDrawerTypes.OpenedStateMode = 'shrink';
  menuRevealMode: DxDrawerTypes.RevealMode = 'expand';
  minMenuSize = 0;
  shaderEnabled = false;

  constructor(private screen: ScreenService, private router: Router) { }

  ngOnInit() {
  }
}

@NgModule({
  imports: [ SideNavigationMenuModule, DxDrawerModule, HeaderModule, DxScrollViewModule, CommonModule ],
  exports: [ SideNavOuterToolbarComponent ],
  declarations: [ SideNavOuterToolbarComponent ]
})
export class SideNavOuterToolbarModule { }
