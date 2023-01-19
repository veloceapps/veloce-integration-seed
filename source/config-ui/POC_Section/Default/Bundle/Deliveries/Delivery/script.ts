import { ElementDefinition } from '@veloceapps/sdk/cms';

@ElementDefinition({
  name: 'Delivery',
  type: 'CUSTOM',
  children: ['deliveryType'],
  model: {
    lineItem: '/Bundle/ports/Deliveries/Delivery',
  },
})
export class Script {}
