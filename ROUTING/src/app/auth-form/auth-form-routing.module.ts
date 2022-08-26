import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthFormComponent } from './auth-form.component';


const ROUTES: Routes = [
  {
    path: 'authorization',
    component: AuthFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AuthFormRoutingModule { }
