import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorMessagesModule, InfoTooltipModule } from '@veloceapps/components';
import { FlowService } from '@veloceapps/sdk';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DebugSettingsComponent } from './debug-settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    InputTextModule,
    ButtonModule,
    InputSwitchModule,
    DividerModule,
    InfoTooltipModule,
    FormErrorMessagesModule,
    DropdownModule,
  ],
  declarations: [DebugSettingsComponent],
  providers: [FlowService],
  exports: [DebugSettingsComponent],
})
export class DebugSettingsModule {}
