import { QuoteApiService } from '@veloceapps/api';
import { ElementDefinition, ScriptHost, TypeElement } from '@veloceapps/sdk/cms';
import { ConfigurationService } from '@veloceapps/sdk/core';

interface HostContent extends TypeElement {
  data: {
    configurationService: ConfigurationService;
    quoteApiService: QuoteApiService;
  };
}

@ElementDefinition({
  name: 'Bundle',
  type: 'CUSTOM',
  model: {
    lineItem: '/Bundle',
  },
})
export class Script {
  constructor(public host: ScriptHost<HostContent>) {
    this.host.data = {
      configurationService: this.host.injector.get(ConfigurationService),
      quoteApiService: this.host.injector.get(QuoteApiService),
    };
  }
}
