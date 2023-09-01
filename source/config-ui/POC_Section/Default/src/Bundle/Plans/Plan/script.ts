import { ElementDefinition } from '@veloceapps/sdk/cms';

@ElementDefinition({
  name: 'Plan',
  type: 'CUSTOM',
  children: ['planType'],
  model: {
    lineItem: '/Bundle/ports/Plans/Plan',
  },
})
export class Script {}
