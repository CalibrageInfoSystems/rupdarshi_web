import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { AuthGuard } from './shared';
import { OrdersComponent } from './orders/orders.component';
import { StoresComponent } from './stores/stores.component';
import { AssignedOrdersComponent } from './assigned-orders/assigned-orders.component';

import { ProductsComponent } from './products/products.component';
import { CountriesComponent } from './countries/countries.component';
import { CitiesComponent } from './cities/cities.component';
import { LocationsComponent } from './locations/locations.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CategoryComponent } from './category/category.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        loadChildren: './login/login.module#LoginModule',
      },
      {
        path: 'login',
        loadChildren: './login/login.module#LoginModule',
        data: {
          customLayout: true
        }
      },
      // {
      //   path: 'login',
      //   component:LoginComponent,
      //   data: { title: 'Login' }
      // },
      // { path: 'reports', loadChildren: './reports/reports.module#ReportsModule'},
     
      // {path:'projects', component:ProjectsComponent,  canActivate: [AuthGuard] },
      // {path:'videos', component:VideosComponent, canActivate: [AuthGuard] },
      // {path:'videos/:projectId', component:VideosComponent, canActivate: [AuthGuard] },
      {path:'users', component:UsersComponent,canActivate: [AuthGuard]},
      {path:'roles', component:RolesComponent,canActivate: [AuthGuard] },
      {path:'orders', component:OrdersComponent,canActivate: [AuthGuard]},
      {path:'products', component:ProductsComponent,canActivate: [AuthGuard]},
      {path:'stores', component:StoresComponent,canActivate: [AuthGuard] },
      {path:'assigned-orders', component:AssignedOrdersComponent,canActivate: [AuthGuard] },
      {path:'countries', component:CountriesComponent,canActivate: [AuthGuard] },
      {path:'cities', component:CitiesComponent,canActivate: [AuthGuard] },
      {path:'locations', component:LocationsComponent,canActivate: [AuthGuard] },
      {path:'category', component: CategoryComponent,canActivate: [AuthGuard] },
      {path:'change-password', component:ChangePasswordComponent,canActivate: [AuthGuard] },
      
      {
        path: 'layout',
        data: { title: 'Layout', },
        children: [
          {
            path: 'configuration',
            loadChildren: './+layout/configuration/configuration.module#ConfigurationModule',
            data: { title: 'Configuration' }
          },
          {
            path: 'custom',
            loadChildren: './+layout/custom/custom.module#CustomModule',
            data: {
              title: 'Disable Layout'
              // disableLayout: true
            }
          },
          {
            path: 'content',
            loadChildren: './+layout/content/content.module#ContentModule',
            data: { title: 'Content' }
          },
          {
            path: 'header',
            loadChildren: './+layout/header/header.module#HeaderModule',
            data: {
              title: 'Header'
            }
          }, {
            path: 'sidebar-left',
            loadChildren: './+layout/sidebar-left/sidebar-left.module#SidebarLeftModule',
            data: {
              title: 'Sidebar Left'
            }
          }, {
            path: 'sidebar-right',
            loadChildren: './+layout/sidebar-right/sidebar-right.module#SidebarRightModule',
            data: {
              title: 'Sidebar Right'
            }
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
