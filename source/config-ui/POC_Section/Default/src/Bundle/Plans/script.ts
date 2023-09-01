import { ElementDefinition } from '@veloceapps/sdk/cms';

@ElementDefinition({
  name: 'Plans',
  type: 'CUSTOM',
  children: ['Plan'],
  model: {
    lineItem: '/Bundle/ports/Plans',
  },
})
export class Script {}
