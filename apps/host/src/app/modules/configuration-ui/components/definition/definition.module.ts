import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetDirectiveModule, LoaderModule } from '@veloceapps/components';
import { LauncherModule, PreviewModule } from '@veloceapps/sdk/cms';
import { DefinitionComponent } from './definition.component';

@NgModule({
  declarations: [DefinitionComponent],
  imports: [CommonModule, LoaderModule, LauncherModule, PreviewModule, LetDirectiveModule],
})
export class DefinitionModule {}
