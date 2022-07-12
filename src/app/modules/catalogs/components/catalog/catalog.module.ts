import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule, LoaderModule } from '@veloce/components';
import { LauncherModule, PreviewModule } from '@veloce/sdk/cms';
import { CatalogComponent } from './catalog.component';

@NgModule({
  declarations: [CatalogComponent],
  imports: [CommonModule, RouterModule, LoaderModule, LauncherModule, PreviewModule, CardModule]
})
export class CatalogModule {}
