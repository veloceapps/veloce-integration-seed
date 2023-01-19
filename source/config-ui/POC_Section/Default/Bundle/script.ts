import { ElementDefinition } from '@veloceapps/sdk/cms';

@ElementDefinition({
  name: 'Bundle',
  type: 'CUSTOM',
  children: ['Phones', 'Plans', 'Deliveries'],
  model: {
    lineItem: '/Bundle',
  },
})
export class Script {}
