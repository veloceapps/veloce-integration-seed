import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderModule } from '@veloce/components';
import { LauncherModule, PreviewModule } from '@veloce/sdk/cms';
import { RuntimeModule } from '@veloce/sdk/runtime';
import { DefinitionComponent } from './definition.component';

@NgModule({
  declarations: [DefinitionComponent],
  imports: [CommonModule, LoaderModule, LauncherModule, PreviewModule, RuntimeModule]
})
export class DefinitionModule {}
