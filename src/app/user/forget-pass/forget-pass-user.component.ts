import { Component, Inject, Input } from '@angular/core';

import { Md5 } from 'ts-md5/dist/md5';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-forget-pass-user',
    templateUrl: './forget-pass-user.component.html',
    styleUrls: ['./forget-pass-user.component.css']

})
export class ForgetPassUserComponent {
    /*form: FormGroup;*/
     regexPatternPass = /^[a-zA-Z0-9]{6,100}$/;
     @Input() data: any;
    is_load_list: boolean = false;
    showErrorTxtPassOld: boolean = false;
    errorTxtPassOld: string;
    showErrorTxtRePass: boolean = false;
    errorTxtRePass: string;
    showErrorTxtPass: boolean = false;
    errorTxtPass: string;
    showErrorTxtUsername: boolean;
    showErrorTxtMail: boolean = false;
    errorTxtMail: string;
    description: string;
    notis: string;
    user: any;
    // data: any;
    showMes: boolean;
    gioiTinhList: any;
    constructor(
        
        private http: HttpClient,
        private toastr: ToastrService,
        private sharedService: SharedService,
        public modal: NgbActiveModal
    ) {

        // this.data = data;
    }

    ngOnInit() {
        this.notis = '';
        this.showErrorTxtUsername = false;
        
        this.showMes = false;
         
           this.refreshUser();
         
        this.gioiTinhList = [{ value: 1, viewValue: "Nam" },
        { value: 2, viewValue: "Nữ" },
        { value: 3, viewValue: "Khác" }]

    }
 
    checkChangePassOld() {
        var t = this.sharedService.checkChangeProperty(this.regexPatternPass,this.user,"password_old","txt-pass-old",this,"showErrorTxtPassOld");
         
        if(!t){
            this.errorTxtPassOld = "Mật khẩu tối thiểu 6 ký tự, tối đa 100 ký tự, chỉ viết liền, không dấu";
        }
        return t;
 
    }
 
    checkChangePass() {
        var t = this.sharedService.checkChangeProperty(this.regexPatternPass,this.user,"password","txt-pass",this,"showErrorTxtPass");
         
        if(!t){
            this.errorTxtPass = "Mật khẩu tối thiểu 6 ký tự, tối đa 100 ký tự, chỉ viết liền, không dấu";
        }
        return t;
 
    }
 
    checkChangeRePass() {

        let txtInput = document.getElementsByName("txt-repass");
        if (this.user.password == this.user.rePassword && this.user.rePassword != "") {
            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtRePass = false;
            return true;
        } else {
            txtInput[0].className += " is-invalid";
            this.showErrorTxtRePass = true;

            this.errorTxtRePass = "Nhập lại mật khẩu không đúng";
            return false;
        }
    }
    
    checkValid() {
     
        var validPass = true;
        var validRePass = true;
        
            validPass = this.checkChangePass();
            validRePass = this.checkChangeRePass()
        
        var validPassOld = this.checkChangePassOld()
         
        if(   validPass && 
        validRePass && validPassOld )
        {
            return true;
        }else {
            return false;
        }
         
    }

    refreshUser(){
        this.user = new Object();

        this.user.password = "";
        this.user.password_old = "";
        this.user.rePassword = "";
        
    }

    save() {
        var valid = this.checkValid();
        if (valid) {
  
                this.user.user_id = localStorage.getItem("user_id");
                this.user.username = localStorage.getItem("username");

                this.http.post<any>('http://10.1.11.110:5017/' + 'user/changepass',
                    this.user, this.sharedService.httpOptions)
                    .subscribe(response => {

                        if (response.result == 0) {
                            this.toastr.success('Đổi mật khẩu thành công', 'Thông báo');
                            
                            this.modal.close("ok");
                        } else {
                            
                                this.toastr.error('Đổi mật khẩu thất bại ', 'Thông báo');
                             
                        }

                    });

            }  
        }
    
    showPass1() {
        this.sharedService.showPass('#exampleInputPassword11');
        
    }

    showPass2() {
        this.sharedService.showPass('#exampleInputPassword12');
       
    }

    showPass3() {
        this.sharedService.showPass('#exampleInputPassword13');
        
    }

    close() {
        
            this.modal.close();
          
    }

}