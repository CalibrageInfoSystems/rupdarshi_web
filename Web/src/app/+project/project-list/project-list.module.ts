import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule, InputTextModule as mkInputTextModule, BoxModule } from 'angular-admin-lte';
import { ProjectListRoutingModule } from './project-list-routing.module';
import { ProjectListComponent } from './project-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectListRoutingModule,
    BoxModule,
    mkInputTextModule,
    InputGroupModule
  ],
  declarations: [ProjectListComponent]
})
export class ProjectListModule { }
