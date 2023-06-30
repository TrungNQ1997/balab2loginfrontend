import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { EditUserComponent } from './user/edit/edit-user.component';
import { ListUserComponent } from './user/list/list-user.component';

import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComfirmComponent } from './common/modal-comfirm/modal-comfirm.component';
import { ForgetPassUserComponent } from './user/forget-pass/forget-pass-user.component'

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from './service/shared.service';
import { BsDatepickerConfig, BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';
import { PhoneFormatPipe } from './pipe/phone-format.pipe/phone-format.pipe';

import { SimpleComponent } from './simple/simple.component';
defineLocale('vi', viLocale);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    EditUserComponent,
    ListUserComponent,
    ModalComfirmComponent,
    ForgetPassUserComponent,
    PhoneFormatPipe,

    SimpleComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    }),
    //FontAwesomeModule,
    TranslateModule.forRoot({
      defaultLanguage: 'vi',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },

      { path: 'list-user', component: ListUserComponent },
      { path: 'simple', component: SimpleComponent }

    ])
  ],
  entryComponents: [
    ModalComfirmComponent,
    EditUserComponent,
    ForgetPassUserComponent
  ],
  providers: [
    SharedService,
    //{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
    , { provide: BsDatepickerConfig, useFactory: getDatepickerConfig }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private bsLocaleService: BsLocaleService) {
    this.bsLocaleService.use('vi');
  }

}
// required for AOT compilation

export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'DD/MM/YYYY'
  });
}