import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [

  { path: "Login", component:LoginComponent },

  { path: "register", component:RegisterComponent },

  {
    path: "admin",
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule)
  },{
    path: "",
    loadChildren: ()=>import("./site/site.module").then(m=>m.SiteModule)
  }
  
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
