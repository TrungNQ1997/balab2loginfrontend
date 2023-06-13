import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  isExpanded = false;
  dropDownData = [
    { val: "vi", text: "Tiếng Việt", img: "/assets/img/icon-co-vn.png" },
    { val: "en", text: "English", img: "/assets/img/eng.jpg" }
  ];
  langModel = this.dropDownData[0];
  collapse() {
    this.isExpanded = false;

  }

  onOptionsSelected(value: string) {
    this.translateService.use(value);
  }

  toggleMenu() {
    let divs = document.getElementsByClassName("div-mobile-menu");
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      divs[0].className = divs[0].className.replace(" dp-none", "");
      divs[0].className += " dp-block";
    } else {
      divs[0].className = divs[0].className.replace(" dp-block", "");
      divs[0].className += " dp-none";
    }

  }

  toggle() {
    this.isExpanded = !this.isExpanded;

  }

  setLanguage(lang: any, index: any) {
    this.translateService.use(lang);
    this.appComponent.setCurLang(lang);
    this.langModel = this.dropDownData[index];
  }

  ngOnInit() {
    this.langModel = this.dropDownData[0];
    this.translateService.use(this.dropDownData[0].val);
  }

  constructor(private translateService: TranslateService, private appComponent: AppComponent) {

    this.translateService.setDefaultLang('vi');

    // Nạp các bản dịch
    this.translateService.use('vi');

  }
}
