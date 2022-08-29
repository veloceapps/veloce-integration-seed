import { UIDefinition as LegacyUIDefinition } from '@veloce/core';
import { UIDefinition } from '@veloce/sdk/cms';
import { UIDef } from '../types/ui.types';

export const isLegacyDefinition = (uiDefinition: UIDef): uiDefinition is LegacyUIDefinition => {
  return !(uiDefinition as UIDefinition).version;
};
