import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplatesComponent } from './templates.component';
import { TreeModule } from 'primeng/tree';
import { RuntimeModule } from '@veloceapps/sdk/runtime';
import { TemplateStoryComponent } from './components/template-story.component';
import { TemplatesApiService } from '../../services/templates.service';
import { LoaderModule } from '@veloceapps/components';

const routes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    children: [{ path: ':templateName/:componentName/:storyName', component: TemplateStoryComponent }],
  },
];

@NgModule({
  declarations: [TemplatesComponent, TemplateStoryComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TreeModule, RuntimeModule, LoaderModule],
  providers: [TemplatesApiService],
  exports: [TemplatesComponent],
})
export class TemplatesModule {}
