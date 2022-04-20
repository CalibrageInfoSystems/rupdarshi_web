import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateProjectRoutingModule } from './create-project-routing.module';
import { CreateProjectComponent } from './create-project.component';

import { InputGroupModule, InputTextModule as mkInputTextModule, BoxModule } from 'angular-admin-lte';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BoxModule,
    CreateProjectRoutingModule,
    mkInputTextModule,
    InputGroupModule,
    CKEditorModule
  ],
  declarations: [CreateProjectComponent]
})
export class CreateProjectModule { }
