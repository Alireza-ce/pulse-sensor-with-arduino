import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './modules/components/login/login.component';
import { PanelComponent } from './modules/components/panel/panel.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarService } from './modules/services/snack-bar.service';
import { ErrorHandlerService } from './modules/services/interceptor/error-handler.service';
import { HttpInterceptorService } from './modules/services/interceptor/http-interceptor.service';
import { AnalysisComponent } from './modules/components/analysis/analysis.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DatePipe } from '@angular/common';
import { DetailComponent } from './modules/components/detail/detail.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { SignUpComponent } from './modules/components/sign-up/sign-up.component'; 

import { MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from "./modules/services/material.persian-date.adapter";
import { MomentJalaaliPipe } from './modules/CustomPipe/moment-jalaali.pipe';

export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [AppComponent, LoginComponent, PanelComponent, AnalysisComponent, DetailComponent, SignUpComponent, MomentJalaaliPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatBottomSheetModule,
    MatDialogModule,
    HttpClientModule,
    MatTabsModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MDBBootstrapModule.forRoot(),
    LottieModule.forRoot({ player: playerFactory }),
    MatSlideToggleModule
  ],
  providers: [MatDatepickerModule,
    SnackBarService,
    { provide: DateAdapter, useClass: MaterialPersianDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
