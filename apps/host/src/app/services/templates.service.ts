import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Template, TemplateComponentMeta, TemplateComponentStory } from '../types/templates.types';

@Injectable({ providedIn: 'root' })
export class TemplatesApiService {
  private readonly SERVICE_URL = `${environment.apiServerUrl}/templates`;

  constructor(private http: HttpClient) {}

  public fetchTemplates() {
    return this.http.get<Template[]>(this.SERVICE_URL);
  }

  public fetchTemplateComponents(templateName: string) {
    return this.http.get<TemplateComponentMeta[]>(`${this.SERVICE_URL}/${templateName}`);
  }

  public fetchStory(templateName: string, componentName: string, storyName: string) {
    return this.http.get<TemplateComponentStory>(`${this.SERVICE_URL}/${templateName}/${componentName}/${storyName}`);
  }
}
