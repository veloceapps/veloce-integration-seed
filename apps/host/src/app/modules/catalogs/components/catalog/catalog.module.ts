import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule, LoaderModule } from '@veloceapps/components';
import { LauncherModule, PreviewModule } from '@veloceapps/sdk/cms';
import { CatalogComponent } from './catalog.component';

@NgModule({
  declarations: [CatalogComponent],
  imports: [CommonModule, RouterModule, LoaderModule, LauncherModule, PreviewModule, CardModule],
})
export class CatalogModule {}
