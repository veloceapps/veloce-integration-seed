import { LineItem } from '@veloceapps/core';
import { AttributeElement, ElementDefinition, ScriptHost } from '@veloceapps/sdk/cms';
import { map, Observable } from 'rxjs';

interface ScriptContent extends AttributeElement {
  options$: Observable<string[]>;
  model$: Observable<LineItem | undefined>;
}

@ElementDefinition({
  name: 'color',
  type: 'CUSTOM',
  children: [],
  model: {
    lineItem: '/Bundle/ports/Phones/Phone/attributes/color',
  },
})
export class Script {
  constructor(public host: ScriptHost<ScriptContent>) {
    this.host.options$ = this.host.model$.pipe(map(model => model?.attributeDomains[this.host.boundName] ?? []));
  }
}
