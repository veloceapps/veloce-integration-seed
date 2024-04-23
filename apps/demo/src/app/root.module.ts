import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PhoneModule } from './components/phone.module';

import { RootComponent } from './root.component';
import { ConfigurationService } from './services/configuration.service';

@NgModule({
  declarations: [RootComponent],
  imports: [CommonModule, FormsModule, PhoneModule],
  providers: [ConfigurationService],
  bootstrap: [RootComponent],
  exports: [RootComponent],
})
export class RootModule {
  static rootComponent = RootComponent;
}
