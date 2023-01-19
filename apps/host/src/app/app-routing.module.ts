import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowModule } from '@veloceapps/sdk';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'configuration-ui' },
  {
    path: 'configuration-ui',
    loadChildren: () => import('./modules/configuration-ui/configuration-ui.module').then(m => m.ConfigurationUiModule),
  },
  {
    path: 'templates',
    loadChildren: () => import('./modules/templates/templates.module').then(m => m.TemplatesModule),
  },
  {
    path: 'catalogs',
    loadChildren: () => import('./modules/catalogs/catalogs.module').then(m => m.CatalogsModule),
  },
  { path: 'flow', loadChildren: () => FlowModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
