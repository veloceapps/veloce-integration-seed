import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardModule, LoaderModule } from '@veloceapps/components';
import { FlowModule } from '@veloceapps/sdk';
import { DebugSettingsModule } from './components/debug-settings/debug-settings.module';
import { DefinitionComponent } from './components/definition/definition.component';
import { DefinitionModule } from './components/definition/definition.module';
import { ConfigurationUiComponent } from './configuration-ui.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationUiComponent,
  },
  { path: 'flow', loadChildren: () => FlowModule },
  {
    path: ':name/:definition',
    component: DefinitionComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LoaderModule,
    CardModule,
    DebugSettingsModule,
    DefinitionModule,
  ],
  declarations: [ConfigurationUiComponent],
  exports: [ConfigurationUiComponent],
})
export class ConfigurationUiModule {}
