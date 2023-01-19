import { UIDefinition as LegacyUIDefinition } from '@veloceapps/core';
import { UIDefinition } from '@veloceapps/sdk/core';
import { UIDef } from '../types/ui.types';

export const isLegacyDefinition = (uiDefinition: UIDef): uiDefinition is LegacyUIDefinition => {
  return !(uiDefinition as UIDefinition).version;
};
