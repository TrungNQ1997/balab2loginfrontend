import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { DateAdapter } from '@angular/material/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  
  private curLang: string = 'vi';

  getCurLang(): string {
    return this.curLang;
  }

  setCurLang(value: string) {
    this.curLang = value;
  }
  ngOnInit() {
    this.translate
      .get('title_page')
      .subscribe((successMessage: string) => {

        this.titleService.setTitle(successMessage);
      });

    
  }
  constructor(private translate: TranslateService, 
        private dateAdapter: DateAdapter<Date>,
    private titleService: Title) {
    translate.setDefaultLang('vi');
    this.dateAdapter.setLocale('en-GB');
    translate.use('vi');

  }
}
