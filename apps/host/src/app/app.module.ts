import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { ApiModule } from '@veloceapps/api';
import { ToastModule } from '@veloceapps/components';
import { LauncherModule } from '@veloceapps/sdk/cms';
import { FLOW_CUSTOMIZATION } from '@veloceapps/sdk/core';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationModule } from './components/navigation';
import { CustomizationService } from './services/flow-customization.service';
import { RouterService } from './services/router.service';
import { ConfigurationUiState } from './state/configuration-ui/configuration-ui.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NavigationModule,
    ToastModule,
    ApiModule,
    LauncherModule,
    NgxsModule.forRoot([ConfigurationUiState], {
      developmentMode: !environment.production,
    }),
  ],
  providers: [
    RouterService,
    {
      provide: FLOW_CUSTOMIZATION,
      useClass: CustomizationService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
