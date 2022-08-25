import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthFormModule } from './auth-form/auth-form.module';
import { MainModule } from './main/main.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MoveMailModalComponent } from './modals/move-mail-modal/move-mail-modal.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SelectorComponent } from './components/selector/selector.component';

@NgModule({
  declarations: [
    AppComponent,
    MoveMailModalComponent,
    SelectorComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    AuthFormModule,
    MainModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    MoveMailModalComponent
  ]
})
export class AppModule { }
