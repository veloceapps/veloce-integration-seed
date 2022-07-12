import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabMenuModule } from 'primeng/tabmenu';
import { NavigationComponent } from './navigation.component';

@NgModule({
  imports: [CommonModule, TabMenuModule, ButtonModule, OverlayPanelModule],
  declarations: [NavigationComponent],
  exports: [NavigationComponent]
})
export class NavigationModule {}
