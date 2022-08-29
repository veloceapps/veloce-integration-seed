import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LineItem } from '@veloce/core';
import { LineItemWorker } from '@veloce/sdk/cms';
import { ConfigurationService } from '../services/configuration.service';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneComponent implements OnChanges {
  @Input() phone!: LineItem;

  public colorOptions: string[] = [];
  public color: string = '';

  constructor(private configurationService: ConfigurationService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.phone) {
      this.colorOptions = this.phone.attributeDomains['color'];
      this.color = this.phone.attributes.find(attr => attr.name === 'color')?.value ?? this.colorOptions[0];
    }
  }

  public patchAttribute(name: string, value: any) {
    const patched = new LineItemWorker(this.phone).patchAttribute([{ name, value }]).li;
    this.configurationService.patch$(patched).subscribe();
  }

  public deletePhone() {
    const rootLineItem = this.configurationService.getLineItemSnapshot();
    if (!rootLineItem) {
      return;
    }

    const patched = new LineItemWorker(rootLineItem).remove(this.phone.id).li;
    this.configurationService.patch$(patched).subscribe();
  }
}
