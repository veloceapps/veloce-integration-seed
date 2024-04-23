import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhoneComponent } from './phone.component';

@NgModule({
  declarations: [PhoneComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [PhoneComponent],
})
export class PhoneModule {}
