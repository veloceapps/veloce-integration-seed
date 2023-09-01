import { ElementDefinition } from '@veloceapps/sdk/cms';

@ElementDefinition({
  name: 'Shared',
  type: 'CONTAINER',
  children: ['MessagesPanel', 'PortsSidebar', 'PortsViewer', 'AttributesSidebar', 'Docgen'],
})
export class Script {
  constructor() {}
}
