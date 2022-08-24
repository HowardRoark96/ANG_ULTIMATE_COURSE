import { NgModule } from '@angular/core';
import { AuthFormComponent } from './auth-form.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AuthFormRoutingModule } from './auth-form-routing.module';


@NgModule({
  declarations: [
    AuthFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthFormRoutingModule
  ],
  providers: [
    AuthService
  ],
  exports: [
    AuthFormRoutingModule
  ]
})
export class AuthFormModule {
}
