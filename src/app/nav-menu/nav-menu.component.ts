import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';
import { Subscription } from 'rxjs';
import { SharedService } from '../service/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalComfirmComponent } from '../common/modal-comfirm/modal-comfirm.component';
import { ForgetPassUserComponent } from '../user/forget-pass/forget-pass-user.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isNavbarVisible: boolean = false;
  private subscription: Subscription;
  isExpanded = false;
  modalOptions: NgbModalOptions = {
    // size:'700px',
    windowClass : "myCustomModalClass",

    centered: true // Căn giữa modal
  };
  dropDownData = [
    { val: "vi", text: "Tiếng Việt", img: "/assets/img/icon-co-vn.png" },
    { val: "en", text: "English", img: "/assets/img/eng.jpg" }
  ];
  langModel = this.dropDownData[0];

  
  constructor(private translateService: TranslateService, 
    private appComponent: AppComponent
    ,private sharedService: SharedService,private router: Router, 
    private route: ActivatedRoute 
    , private modalService: NgbModal
    ) {

    this.translateService.setDefaultLang('vi');

    // Nạp các bản dịch
    this.translateService.use('vi');
     
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


    var modalRef = this.modalService.open(ForgetPassUserComponent,this.modalOptions);
    
    modalRef.componentInstance.data = {
      data: "",
      title: 'Đổi mật khẩu',
      statusForm: 'edit'
            };

    modalRef.result.then((result) => {

        if (result == "ok") {
             
                }

    }).catch((error) => {
    console.log(error)
    });

 
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
  var notis = "Bạn có đồng ý thoát không?"
  var modalRef = this.modalService.open(ModalComfirmComponent,this.modalOptions);
    
  modalRef.componentInstance.data = {
    id: 1,
            title: 'Xác nhận thoát',
            content: notis
          };

  modalRef.result.then((result) => {

      if (result == "ok") {
        this.callLogout();
              }

  }).catch((error) => {
  console.log(error)
  });
 
 
}
  callLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.deleteAllCookies();
    this.sharedService.setIsNavbarVisible(false);  

    this.router.navigate([''], { relativeTo: this.route });
}
  
}
