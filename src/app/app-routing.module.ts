import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowModule } from '@veloce/sdk';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'models' },
  { path: 'flow', loadChildren: () => FlowModule },
  {
    path: 'templates',
    loadChildren: () => import('./modules/templates/templates.module').then(m => m.TemplatesModule)
  },
  {
    path: 'catalogs',
    loadChildren: () => import('./modules/catalogs/catalogs.module').then(m => m.CatalogsModule)
  },
  {
    path: 'models',
    loadChildren: () => import('./modules/models/models.module').then(m => m.ModelsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
