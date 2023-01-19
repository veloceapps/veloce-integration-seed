import { ElementDefinition } from '@veloceapps/sdk/cms';

@ElementDefinition({
  name: 'Phone',
  type: 'CUSTOM',
  children: ['color', 'Accessories'],
  model: {
    lineItem: '/Bundle/ports/Phones/Phone',
  },
})
export class Script {}
