import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardModule, LoaderModule } from '@veloceapps/components';
import { CatalogsApiService } from '../../services/catalogs.service';
import { CatalogsComponent } from './catalogs.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CatalogModule } from './components/catalog/catalog.module';
import { DefinitionComponent } from './components/definition/definition.component';
import { DefinitionModule } from './components/definition/definition.module';

const routes: Routes = [
  {
    path: '',
    component: CatalogsComponent,
  },
  {
    path: ':name',
    component: CatalogComponent,
  },
  {
    path: ':name/:definition',
    component: DefinitionComponent,
  },
];

@NgModule({
  declarations: [CatalogsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LoaderModule, CatalogModule, DefinitionModule, CardModule],
  providers: [CatalogsApiService],
  exports: [CatalogsComponent],
})
export class CatalogsModule {}
