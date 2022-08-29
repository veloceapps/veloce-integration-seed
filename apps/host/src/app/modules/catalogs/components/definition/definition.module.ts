import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderModule } from '@veloce/components';
import { LauncherModule, PreviewModule } from '@veloce/sdk/cms';
import { DefinitionComponent } from './definition.component';

@NgModule({
  declarations: [DefinitionComponent],
  imports: [CommonModule, LoaderModule, LauncherModule, PreviewModule]
})
export class DefinitionModule {}
