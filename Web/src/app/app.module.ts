import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { adminLteConf } from './admin-lte.conf';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { LayoutModule } from 'angular-admin-lte';

import { AppComponent } from './app.component';

import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ngx-ckeditor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
// import { LoginComponent } from './login/login.component';
import { TableModule } from 'primeng/table';
import { DataService } from './shared/services/data.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigService } from './shared/services/config.service';
import { AuthInterceptor } from './shared/services/auth.interceptor';
import { AuthService } from './shared/services/auth.service';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxSpinnerModule } from "ngx-spinner";
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

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    LayoutModule.forRoot(adminLteConf),
    LoadingPageModule, MaterialBarModule,
    LanguageTranslationModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    CKEditorModule,
    TableModule,
    AngularMultiSelectModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton:true
    }),
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    RolesComponent,
    UsersComponent,
    OrdersComponent,
    StoresComponent,
    AssignedOrdersComponent,
    ProductsComponent,
    CountriesComponent,
    CitiesComponent,
    LocationsComponent,
    ChangePasswordComponent,
    CategoryComponent
  ],providers: [
    ConfigService,
    AuthService,
    AuthGuard,
    DataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
