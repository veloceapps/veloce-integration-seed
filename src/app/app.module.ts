import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiModule } from '@veloce/api';
import { ToastModule } from '@veloce/components';
import { FLOW_CUSTOMIZATION } from '@veloce/sdk';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationModule } from './components/navigation';
import { CustomizationService } from './services/flow-customization.service';
import { RouterService } from './services/router.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NavigationModule,
    ToastModule,
    ApiModule
  ],
  providers: [
    RouterService,
    {
      provide: FLOW_CUSTOMIZATION,
      useClass: CustomizationService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
