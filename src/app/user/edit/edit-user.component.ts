import { Component, Inject } from '@angular/core';

import { Md5 } from 'ts-md5/dist/md5';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']

})
export class EditUserComponent {
    /*form: FormGroup;*/
    regexPatternUsername = /^[a-zA-Z0-9]{1,50}$/;
    regexPatternPass = /^[a-zA-Z0-9]{6,100}$/;
    regexPatternSdt = /^[0-9]{1,10}$/;
    regexPatternEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,200}$/;
    errorTxtUsername: string;
    is_load_list: boolean = false;
    showErrorTxtNgaySinh: boolean = false;
    errorTxtNgaySinh: string;
    showErrorTxtSdt: boolean = false;
    errorTxtSdt: string;
    showErrorTxtTen: boolean = false;
    errorTxtTen: string;
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
        private dialogRef: MatDialogRef<EditUserComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private http: HttpClient,
        private toastr: ToastrService
    ) {

        this.data = data;
    }

    ngOnInit() {
        this.notis = '';
        this.showErrorTxtUsername = false;
        this.errorTxtUsername = '';
        this.showMes = false;
        if (this.data.statusForm == 'edit') {
            this.user = this.data.data;
            this.user.sdt = this.user.sdt.trim();
            this.user.ngay_sinh = new Date(this.user.ngay_sinh);
            this.user.username = this.user.username.trim();
            this.user.email = this.user.email.trim();
        } else if (this.data.statusForm == 'add') {
           this.refreshUser();
        }

        this.gioiTinhList = [{ value: 1, viewValue: "Nam" },
        { value: 2, viewValue: "Nữ" },
        { value: 3, viewValue: "Khác" }]

    }

    checkChangeUsername() {
        var isValid = this.regexPatternUsername.test(this.user.username);
        let txtUsername = document.getElementsByName("txt-username");
        if (isValid) {
            txtUsername[0].className = txtUsername[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtUsername = false;
            return true;
        } else {
            txtUsername[0].className += " is-invalid";
            this.showErrorTxtUsername = true;
            if (this.user.username) {
                this.errorTxtUsername = "Tên đăng nhập tối đa 50 ký tự, chỉ viết liền, không dấu"
            } else {
                this.errorTxtUsername = "Tên đăng nhập không được để trống"
            }
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

    checkChangeNgaySinh() {

        let txtInput = document.getElementsByName("txt-ngay-sinh");
        if (this.user.ngay_sinh) {
            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtNgaySinh = false;
            return true;
        } else {
            txtInput[0].className += " is-invalid";
            this.showErrorTxtNgaySinh = true;

            this.errorTxtNgaySinh = "Ngày sinh không được để trống";
            return false;
        }
    }

    checkChangeSdt() {
        var isValid = this.regexPatternSdt.test(this.user.sdt);
        let txtInput = document.getElementsByName("txt-sdt");
        if (isValid) {
            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtSdt = false;
            return true;
        } else {
            txtInput[0].className += " is-invalid";
            this.showErrorTxtSdt = true;

            this.errorTxtSdt = "Số điện thoại tối đa 10 ký tự, chỉ nhập số";
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
    checkChangeMail() {
        var isValid = this.regexPatternEmail.test(this.user.email);
        let txtInput = document.getElementsByName("txt-mail");

        if (this.user.email) {
            if (isValid) {
                txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
                this.showErrorTxtMail = false;
            } else {
                txtInput[0].className += " is-invalid";
                this.showErrorTxtMail = true;
                this.errorTxtMail = "Email phải đúng định dạng, chỉ viết liền, không dấu"
                return false;
            }
        } else {
            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtMail = false;
        }
        return true;
    }

    checkChangeTen() {

        let txtInput = document.getElementsByName("txt-ten");

        if (this.user.ho_ten) {

            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtTen = false;
return true;
        } else {
            txtInput[0].className += " is-invalid";
            this.showErrorTxtTen = true;
            this.errorTxtTen = "Họ tên không được để trống"
            return false;
        }

    }

    checkValid() {
    
        var validNgaySinh = this.checkChangeNgaySinh()
        var validUsername = this.checkChangeUsername()
        var validMail = this.checkChangeMail()
        var validPass = true;
        var validRePass = true;
        if(this.data.statusForm == 'add'){
            validPass = this.checkChangePass();
            validRePass = this.checkChangeRePass()
        }  
        var validSdt = this.checkChangeSdt()
        var validTen = this.checkChangeTen()
         
        if( validNgaySinh && validUsername 
        && validMail && validPass && 
        validRePass && validSdt && validTen )
        {
            return true;
        }else {
            return false;
        }
        
        
    }

    refreshUser(){
        this.user = new Object();

        this.user.ho_ten = "";
        this.user.gioi_tinh = 1;
        this.user.is_admin = true;
        this.user.is_active = true;
        this.user.ngay_sinh = "";
        this.user.email = "";
        this.user.username = "";
    }

    save() {
        var valid = this.checkValid();
        if (valid) {

            if (this.data.statusForm == 'add') {

                const httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    })
                };

                this.user.user_id = '2';

                this.http.post<any>('http://10.1.11.110:5017/' + 'user/adduser',
                    this.user, httpOptions)
                    .subscribe(response => {

                        if (response.result == 0) {
                            this.toastr.success('Thêm người dùng thành công', 'Thông báo');
                            
                            this.dialogRef.close("ok");
                        } else {
                            if(response.exception.includes("UNIQUE KEY"))
                            {
                                this.toastr.error('Username bị trùng', 'Thêm người dùng thất bại');
                            } else 
                            {
                                this.toastr.error('Thêm người dùng thất bại ', 'Thông báo');
                            }
                            
                        }

                    });

            } else if (this.data.statusForm == 'edit') {
                const httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    })
                };

                this.user.user_id = '2';

                this.http.post<any>('http://10.1.11.110:5017/' + 'user/edituser',
                    this.user, httpOptions)
                    .subscribe(response => {

                        if (response.result == 0) {
                            this.toastr.success('Sửa người dùng thành công', 'Thông báo');
                            this.dialogRef.close("ok");
                        } else {
                            this.toastr.error('Sửa người dùng thất bại ', 'Thông báo');
                        }

                    });

            }
        }
    }

    saveAdd() {
        var valid = this.checkValid();
        if (valid) {

            if (this.data.statusForm == 'add') {

                const httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    })
                };

                this.user.user_id = '2';

                this.http.post<any>('http://10.1.11.110:5017/' + 'user/adduser',
                    this.user, httpOptions)
                    .subscribe(response => {

                        if (response.result == 0) {
                            this.toastr.success('Thêm người dùng thành công', 'Thông báo');
                            this.is_load_list = true;
                            this.refreshUser();
                        } else {
                            if(response.exception.includes("UNIQUE KEY"))
                            {
                                this.toastr.error('Username bị trùng', 'Thêm người dùng thất bại');
                            } else 
                            {
                                this.toastr.error('Thêm người dùng thất bại ', 'Thông báo');
                            }
                            
                        }

                    });

            }
           
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

    close() {
        if(this.is_load_list){
            this.dialogRef.close("ok");
        } else {
            this.dialogRef.close();
        }
        
    }

}