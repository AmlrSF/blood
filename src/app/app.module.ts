import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewModule } from './pages/overview/overview.module';
import { ClientsModule } from './pages/clients/clients.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SiteLayoutComponent } from './site/site-layout/site-layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HomePageComponent } from './site-pages/home-page/home-page.component';
import { SiteNavbarComponent } from './shared/site-navbar/site-navbar.component';
import { SiteFooterComponent } from './shared/site-footer/site-footer.component';
import { ProfileComponent } from './site-pages/profile/profile.component';
import { SettingsComponent } from './site-pages/settings/settings.component';
import { RequestListsComponent } from './site-pages/request-lists/request-lists.component';
import { NewRequestComponent } from './site-pages/new-request/new-request.component';
import { BloodStockComponent } from './site-pages/blood-stock/blood-stock.component';
import { BloodBankRequestsComponent } from './site-pages/blood-bank-requests/blood-bank-requests.component';
import { RequestBloodBankDetailsComponent } from './site-pages/request-blood-bank-details/request-blood-bank-details.component';
import { BloodTransfusionDetailsComponent } from './site-pages/blood-transfusion-details/blood-transfusion-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SiteLayoutComponent,
    HomePageComponent,
    SiteNavbarComponent,
    SiteFooterComponent,
    ProfileComponent,
    SettingsComponent,
    RequestListsComponent,
    NewRequestComponent,
    BloodStockComponent,
    BloodBankRequestsComponent,
    
    RequestBloodBankDetailsComponent,
         BloodTransfusionDetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OverviewModule,
    FormsModule,
    ClientsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
