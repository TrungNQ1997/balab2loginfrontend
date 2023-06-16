import { Component, Inject } from '@angular/core';

import { Md5 } from 'ts-md5/dist/md5';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-forget-pass-user',
    templateUrl: './forget-pass-user.component.html',
    styleUrls: ['./forget-pass-user.component.css']

})
export class ForgetPassUserComponent {
    /*form: FormGroup;*/
     regexPatternPass = /^[a-zA-Z0-9]{6,100}$/;
     
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
    data: any;
    showMes: boolean;
    gioiTinhList: any;
    constructor(
        /*private fb: FormBuilder,*/
        private dialogRef: MatDialogRef<ForgetPassUserComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private http: HttpClient,
        private toastr: ToastrService
    ) {

        this.data = data;
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
        var isValid = this.regexPatternPass.test(this.user.password_old);
        let txtInput = document.getElementsByName("txt-pass-old");
        if (isValid) {
            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtPassOld = false;
            return true;
        } else {
            txtInput[0].className += " is-invalid";
            this.showErrorTxtPassOld = true;

            this.errorTxtPassOld = "Mật khẩu tối thiểu 6 ký tự, tối đa 100 ký tự, chỉ viết liền, không dấu";
            return false;

        }
    }


    checkChangePass() {
        var isValid = this.regexPatternPass.test(this.user.password);
        let txtInput = document.getElementsByName("txt-pass");
        if (isValid) {
            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtPass = false;
            return true;
        } else {
            txtInput[0].className += " is-invalid";
            this.showErrorTxtPass = true;

            this.errorTxtPass = "Mật khẩu tối thiểu 6 ký tự, tối đa 100 ký tự, chỉ viết liền, không dấu";
            return false;

        }
    }

    

    
    checkChangeRePass() {

        let txtInput = document.getElementsByName("txt-repass");
        if (this.user.password == this.user.rePassword) {
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
 
                const httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    })
                };

                this.user.user_id = localStorage.getItem("user_id");
                this.user.username = localStorage.getItem("username");

                this.http.post<any>('http://10.1.11.110:5017/' + 'user/changepass',
                    this.user, httpOptions)
                    .subscribe(response => {

                        if (response.result == 0) {
                            this.toastr.success('Đổi mật khẩu thành công', 'Thông báo');
                            
                            this.dialogRef.close("ok");
                        } else {
                            
                                this.toastr.error('Đổi mật khẩu thất bại ', 'Thông báo');
                             
                        }

                    });

            }  
        }
   

    

    showPass1() {
        let password = document.querySelector('#exampleInputPassword11');
        if (password) {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
        }
    }

    showPass2() {
        let password = document.querySelector('#exampleInputPassword12');
        if (password) {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
        }
    }

    showPass3() {
        let password = document.querySelector('#exampleInputPassword13');
        if (password) {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
        }
    }

    close() {
        
            this.dialogRef.close();
         
        
    }

}