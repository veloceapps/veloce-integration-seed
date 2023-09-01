import { ElementDefinition } from '@veloceapps/sdk/cms';

@ElementDefinition({
  name: 'Deliveries',
  type: 'CUSTOM',
  children: ['Delivery'],
  model: {
    lineItem: '/Bundle/ports/Deliveries',
  },
})
export class Script {}
