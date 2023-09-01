import { OnDestroy, OnInit } from '@angular/core';
import { LineItem, RequiresApproval } from '@veloceapps/core';
import { ElementDefinition, ScriptHost } from '@veloceapps/sdk/cms';
import { ConfigurationService } from '@veloceapps/sdk/core';
import { flatMap } from 'lodash';
import { BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';

interface ScriptContent {
  // inputs
  rootLineItem: BehaviorSubject<LineItem | undefined>;
  approvalsEnabled: Observable<string>;

  // outputs
  approvalMessages: BehaviorSubject<ApprovalMessage[]>;

  // other
  uniqueMessages$: Observable<string[]>;
  selectedMessage$: BehaviorSubject<string | undefined>;
  selectedMessageIndex$: BehaviorSubject<number>;
}

interface ApprovalMessage {
  id: string;
  lineItemId: string;
  reason: string;
}

const TECHNICAL_MESSAGES_PREFIXES = ['PRICE_WARNING', 'PRICE_ERROR'];

@ElementDefinition({
  name: 'MessagesPanel',
  type: 'CUSTOM',
  module: 'Shared',
  inputs: {
    rootLineItem: '/Bundle',
    approvalsEnabled: '/Bundle',
  },
  outputs: {
    approvalMessages: null,
  },
})
export class Script implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  configurationService: ConfigurationService;

  constructor(public host: ScriptHost<ScriptContent>) {
    this.host.selectedMessage$ = new BehaviorSubject<string | undefined>(undefined);
    this.host.selectedMessageIndex$ = new BehaviorSubject<number>(0);

    this.host.uniqueMessages$ = this.host.approvalMessages.pipe(
      map(messages => [...new Set(messages.map(m => m.reason))]),
    );
    this.configurationService = this.host.injector.get(ConfigurationService);
  }

  ngOnInit(): void {
    this.host.rootLineItem
      .pipe(
        takeUntil(this.destroy$),
        map(rootLineItem => (rootLineItem ? this.flatten(rootLineItem) : [])),
        map(lineItems => this.getApprovalMessages(lineItems)),
      )
      .subscribe(approvalMessages => {
        this.host.approvalMessages.next(approvalMessages);
      });

    this.host.uniqueMessages$.pipe(takeUntil(this.destroy$)).subscribe(messages => {
      const activeIndex = messages.findIndex(message => message === this.host.selectedMessage$.value);
      this.host.selectedMessageIndex$.next(activeIndex >= 0 ? activeIndex : 0);
    });

    combineLatest([this.host.uniqueMessages$, this.host.selectedMessageIndex$])
      .pipe(
        takeUntil(this.destroy$),
        map(([messages, index]) => messages[index]),
      )
      .subscribe((selectedMessage?: string) => {
        this.host.selectedMessage$.next(selectedMessage);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getApprovalMessages = (lineItems: LineItem[]): ApprovalMessage[] => {
    const contextMessages = this.getMessagesFromApprovals(this.configurationService.contextSnapshot?.requiresApprovals);

    const collected = lineItems.reduce((acc, item) => {
      const lineItemMessages = this.getMessagesFromApprovals(item.requiresApprovals, item.id);
      const chargeItemMessages = item.chargeItems.reduce((acc: ApprovalMessage[], { requiresApprovals }) => {
        return [...acc, ...this.getMessagesFromApprovals(requiresApprovals, item.id)];
      }, []);

      return [
        ...acc,
        ...lineItemMessages,
        ...chargeItemMessages,
        ...item.messages.map(message => this.getMessage(message, item.id)),
      ];
    }, contextMessages as ApprovalMessage[]);

    // filter out technical messages
    const filtered = collected.filter(message => !TECHNICAL_MESSAGES_PREFIXES.includes(message.reason.split(':')[0]));

    return filtered;
  };

  private getMessagesFromApprovals(requiresApprovals: RequiresApproval[] = [], id = '') {
    return requiresApprovals.map(({ message }) => this.getMessage(message, id));
  }

  private getMessage(message: string, id = ''): ApprovalMessage {
    return { id: `${id}_${message}`, lineItemId: id, reason: message };
  }

  private flatten = (li: LineItem): LineItem[] => {
    return [{ ...li, lineItems: [] }, ...flatMap(li.lineItems.map(child => this.flatten(child)))];
  };
}
