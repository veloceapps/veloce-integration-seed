import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorMessagesModule, InfoTooltipModule } from '@veloce/components';
import { FlowService } from '@veloce/sdk';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
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
  ],
  declarations: [DebugSettingsComponent],
  providers: [FlowService],
  exports: [DebugSettingsComponent],
})
export class DebugSettingsModule {}
