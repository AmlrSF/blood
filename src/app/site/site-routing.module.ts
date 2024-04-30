import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteLayoutComponent } from './site-layout/site-layout.component';
import { HomePageComponent } from '../site-pages/home-page/home-page.component';
import { ProfileComponent } from '../site-pages/profile/profile.component';
import { SettingsComponent } from '../site-pages/settings/settings.component';
import { NewRequestComponent } from '../site-pages/new-request/new-request.component';
import { RequestListsComponent } from '../site-pages/request-lists/request-lists.component';
import { BloodStockComponent } from '../site-pages/blood-stock/blood-stock.component';
import { BloodBankRequestsComponent } from '../site-pages/blood-bank-requests/blood-bank-requests.component';

const routes: Routes = [
  { path: "", component:SiteLayoutComponent , children: [
    { path : "" , component : HomePageComponent },
    { path : "profile", component : ProfileComponent },
    { path : "settings", component : SettingsComponent },
    { path: "blood-request", component:NewRequestComponent },
    { path: "requests-list", component:RequestListsComponent },
    { path: "blood-stock", component:BloodStockComponent },
    { path: "BankAddmission-requests", component:BloodBankRequestsComponent },
  
  
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
