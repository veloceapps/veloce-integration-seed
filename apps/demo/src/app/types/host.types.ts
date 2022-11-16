import { QuoteApiService } from '@veloce/api';
import { ConfigurationService } from '@veloce/sdk/core';

export interface HostContext {
  configurationService: ConfigurationService;
  quoteApiService: QuoteApiService;
}
