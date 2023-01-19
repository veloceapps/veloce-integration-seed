import { QuoteApiService } from '@veloceapps/api';
import { ConfigurationService } from '@veloceapps/sdk/core';

export interface HostContext {
  configurationService: ConfigurationService;
  quoteApiService: QuoteApiService;
}
