import { LineItem } from '@veloceapps/core';
import { ElementDefinition, PortElement, ScriptHost } from '@veloceapps/sdk/cms';
import { map, Observable, of } from 'rxjs';

interface ScriptContent extends PortElement {
  domainsNames$: Observable<string[]>;
  model$: Observable<LineItem | undefined>;
}

@ElementDefinition({
  name: 'Accessories',
  type: 'CUSTOM',
  children: ['Accessory'],
  model: {
    lineItem: '/Bundle/ports/Phones/Phone/ports/Accessories',
  },
})
export class Script {
  constructor(public host: ScriptHost<ScriptContent>) {
    this.host.domainsNames$ =
      this.host.model$?.pipe(
        map(lineItem => lineItem?.portDomains[this.host.boundName]),
        map(portDomain => portDomain?.domainTypes?.map(({ name }) => name) ?? []),
      ) ?? of([]);
  }
}
