import { AfterViewInit, OnInit } from '@angular/core';
import { LineItem } from '@veloceapps/core';
import { ElementDefinition, PortElement, ScriptHost } from '@veloceapps/sdk/cms';
import { BehaviorSubject, map, Observable } from 'rxjs';

interface ScriptContent extends PortElement {
  model$: BehaviorSubject<LineItem | undefined>;
  activeTab: Observable<any | undefined>;

  lineItem$: BehaviorSubject<LineItem | undefined>;
  portsNames$: BehaviorSubject<string[]>;
  hidden$: Observable<boolean>;
}

@ElementDefinition({
  name: 'Deliveries',
  type: 'REFERENCE',
  children: [],
  reference: 'PortsViewer',
  model: {
    lineItem: '/Bundle/ports/Deliveries',
  },
  inputs: {
    activeTab: '/Bundle',
  },
})
export class Script implements OnInit, AfterViewInit {
  constructor(public host: ScriptHost<ScriptContent>) {
    this.host.portsNames$ = new BehaviorSubject<string[]>([]);
    this.host.lineItem$ = this.host.model$;
  }

  ngOnInit(): void {
    this.host.hidden$ = this.host.activeTab.pipe(map(activeTab => !activeTab?.items?.includes(this.host.boundName)));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.host.portsNames$.next([this.host.boundName]));
  }
}
