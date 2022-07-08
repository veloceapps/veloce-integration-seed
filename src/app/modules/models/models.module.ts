import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardModule, LoaderModule } from '@veloce/components';
import { ModelsApiService } from '../../services/models.service';
import { DefinitionComponent } from './components/definition/definition.component';
import { DefinitionModule } from './components/definition/definition.module';
import { ModelComponent } from './components/model/model.component';
import { ModelModule } from './components/model/model.module';
import { ModelsComponent } from './models.component';

const routes: Routes = [
  {
    path: '',
    component: ModelsComponent
  },
  {
    path: ':name',
    component: ModelComponent
  },
  {
    path: ':name/:definition',
    component: DefinitionComponent
  }
];

@NgModule({
  declarations: [ModelsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), LoaderModule, ModelModule, DefinitionModule, CardModule],
  providers: [ModelsApiService],
  exports: [ModelsComponent]
})
export class ModelsModule {}
