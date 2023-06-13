import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { EditUserComponent } from './user/edit/edit-user.component';
import { ListUserComponent } from './user/list/list-user.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalComfirmComponent } from './common/modal-comfirm/modal-comfirm.component';
//angular material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from "@angular/material";
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { CustomPaginatorIntl } from './CustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material';


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
        ModalComfirmComponent
        
     
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
      HttpClientModule,
      MatSliderModule,
      FormsModule,
      MatCheckboxModule,
      BrowserAnimationsModule,
      MatDialogModule,
      MatTableModule,
      MatPaginatorModule,
      MatSelectModule,
      MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
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
       
        { path: 'list-user', component: ListUserComponent }
        
    ])
  ],
  entryComponents: [
    ModalComfirmComponent,
    EditUserComponent
  ],
  providers: [
     
      { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
     

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
// required for AOT compilation

