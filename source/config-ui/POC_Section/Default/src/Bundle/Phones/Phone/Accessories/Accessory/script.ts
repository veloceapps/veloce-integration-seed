import { ElementDefinition } from '@veloceapps/sdk/cms';

@ElementDefinition({
  name: 'Accessory',
  type: 'CUSTOM',
  children: ['color', 'power'],
  model: {
    lineItem: '/Bundle/ports/Phones/Phone/ports/Accessories/Accessory',
  },
})
export class Script {}
