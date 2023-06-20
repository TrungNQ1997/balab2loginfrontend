import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';
import {    OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../service/shared.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ModalComfirmComponent } from '../common/modal-comfirm/modal-comfirm.component';
import { ForgetPassUserComponent } from '../user/forget-pass/forget-pass-user.component';
import { MatDialog, MatDialogConfig, MatTableDataSource } from "@angular/material";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isNavbarVisible: boolean = false;
  private subscription: Subscription;
  isExpanded = false;
  dropDownData = [
    { val: "vi", text: "Tiếng Việt", img: "/assets/img/icon-co-vn.png" },
    { val: "en", text: "English", img: "/assets/img/eng.jpg" }
  ];
  langModel = this.dropDownData[0];
  collapse() {
    this.isExpanded = false;

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onOptionsSelected(value: string) {
    this.translateService.use(value);
  }
  ngOnChanges(){
    
  }

  onChangePass(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'auto',
        dialogConfig.width = '500px',
        
    dialogConfig.data = {
        data: "",
        title: 'Đổi mật khẩu',
        statusForm: 'edit'

    };
    var modal = this.dialog.open(ForgetPassUserComponent, dialogConfig);
    modal.afterClosed().subscribe(result => {
         
        if (result == "ok") {
           
             
        }
    })
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
  deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
logout(){
  const dialogConfig = new MatDialogConfig();
        var notis = "Bạn có đồng ý thoát không?"
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.height = 'auto',
            dialogConfig.width = '500px',
            
        dialogConfig.data = {
            id: 1,
            title: 'Xác nhận thoát',
            content: notis
        };
        var modal = this.dialog.open(ModalComfirmComponent, dialogConfig);
        modal.afterClosed().subscribe(result => {
            // console.log(result);
            if (result == "ok") {
                
                this.callLogout();
            }
        })

}
  callLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.deleteAllCookies();
    this.sharedService.setIsNavbarVisible(false);  

    this.router.navigate([''], { relativeTo: this.route });
}
 
  ngOnInit() {
    this.langModel = this.dropDownData[0];
    this.translateService.use(this.dropDownData[0].val);
    
    var visi = this.sharedService.getCookie("token");
    var login = sessionStorage.getItem("login");
    if(login){
      this.isNavbarVisible = true;
    } else {
      if(visi){
        this.isNavbarVisible = true;
      }
    }
    
    this.subscription = this.sharedService.isNavbarVisible$.subscribe(
      (isVisible: boolean) => {
        this.isNavbarVisible = isVisible;
      }
    );
  }
   

  constructor(private translateService: TranslateService, 
    private appComponent: AppComponent
    ,private sharedService: SharedService,private router: Router, 
    private route: ActivatedRoute, private dialog: MatDialog) {

    this.translateService.setDefaultLang('vi');

    // Nạp các bản dịch
    this.translateService.use('vi');
     
  }
}
