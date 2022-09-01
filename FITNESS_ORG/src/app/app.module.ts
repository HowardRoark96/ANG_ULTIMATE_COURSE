import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
//
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCwXlaB6d97Lvf92zl0BlgNyqaTCqD_ddw",
//   authDomain: "fitness-org.firebaseapp.com",
//   databaseURL: "https://fitness-org-default-rtdb.firebaseio.com",
//   projectId: "fitness-org",
//   storageBucket: "fitness-org.appspot.com",
//   messagingSenderId: "559502421735",
//   appId: "1:559502421735:web:9231b5f32f94d559f6bc42"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
