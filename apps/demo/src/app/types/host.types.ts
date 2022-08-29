import { QuoteApiService } from '@veloce/api';
import { ConfigurationService } from '@veloce/sdk/cms';

export interface HostContext {
  configurationService: ConfigurationService;
  quoteApiService: QuoteApiService;
}
