import { Component, Inject } from '@angular/core';

import { Md5 } from 'ts-md5/dist/md5';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { HttpClient, HttpHeaders } from '@angular/common/http';

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
        private http: HttpClient
    ) {

        this.data = data;
    }

    ngOnInit() {
        this.notis = '';
        this.showMes = false;
        if (this.data.statusForm == 'edit') {
            this.user = this.data.data;
            this.user.sdt = this.user.sdt.trim();
            this.user.email = this.user.email.trim();
        } else if (this.data.statusForm == 'add') {
            this.user = new Object();

            this.user.ho_ten = "";
            this.user.gioi_tinh = 1;
            this.user.is_admin = true;
            this.user.is_active = true;
            this.user.ngay_sinh = "";
            this.user.email = "";
        }

        this.gioiTinhList = [{ value: 1, viewValue: "Nam" },
        { value: 2, viewValue: "Nữ" },
        { value: 3, viewValue: "Khác" }]

    }

    checkValid() {

        if (!this.user.username) {
            this.notis = "Tên đăng nhập không được để trống"
            this.showMes = true;
            return false;
        } else {
            if (this.data.statusForm == 'add') {

                var isValid = this.regexPatternUsername.test(this.user.username);
                if (!isValid) {
                    this.notis = "Tên đăng nhập tối đa 50 ký tự, chỉ viết liền, không dấu"
                    this.showMes = true;
                    return false;
                }
            } else if (this.data.statusForm == 'edit') {
                var isValid = this.regexPatternUsername.test(this.user.username.trim());
                if (!isValid) {
                    this.notis = "Tên đăng nhập tối đa 50 ký tự, chỉ viết liền, không dấu"
                    this.showMes = true;
                    return false;
                }
            }
        }
        if (!this.user.ho_ten) {
            this.notis = "Họ tên không được để trống"
            this.showMes = true;
            return false;
        }
        if (!this.user.ngay_sinh) {
            this.notis = "Ngày sinh không được để trống"
            this.showMes = true;
            return false;
        } else {
            var d1 = new Date(this.user.ngay_sinh);
            var y1 = d1.getFullYear();
            var y2 = (new Date()).getFullYear();
            if ((y2 - y1) < 17) {
                this.notis = "Ngày sinh phải lớn hơn hoặc bằng 18 tuổi"
                this.showMes = true;
                return false;
            }
        }
        if (!this.user.sdt) {
            this.notis = "Số điện thoại không được để trống"
            this.showMes = true;
            return false;
        } else {
            var isValid = this.regexPatternSdt.test(this.user.sdt);
            if (!isValid) {
                this.notis = "Số điện thoại tối đa 10 ký tự, chỉ nhập số"
                this.showMes = true;
                return false;
            }
        }
        if (this.user.email) {
            var isValid = this.regexPatternEmail.test(this.user.email);
            if (!isValid) {
                this.notis = "Email phải đúng định dạng, chỉ viết liền, không dấu"
                this.showMes = true;
                return false;
            }
        }

        if (this.data.statusForm == 'add') {
            if (!this.user.password) {
                this.notis = "Mật khẩu không được để trống"
                this.showMes = true;
                return false;
            } else {
                var isValid = this.regexPatternPass.test(this.user.password);
                if (!isValid) {
                    this.notis = "Mật khẩu tối thiểu 6 ký tự, tối đa 100 ký tự, chỉ viết liền, không dấu"
                    this.showMes = true;
                    return false;
                }
            }
        } else if (this.data.statusForm == 'edit') {
            if (this.user.password) {
                var isValid = this.regexPatternPass.test(this.user.password);
                if (!isValid) {
                    this.notis = "Mật khẩu tối thiểu 6 ký tự, tối đa 100 ký tự, chỉ viết liền, không dấu"
                    this.showMes = true;
                    return false;
                }
            } else {
                this.user.password = '';
                this.user.rePassword = '';
            }
        }
        if (this.user.password != this.user.rePassword) {
            this.notis = "Nhập lại mật khẩu không đúng"
            this.showMes = true;
            return false;
        }
        return true;
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
                            this.dialogRef.close("ok");
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

                        if (response) {
                            this.dialogRef.close("ok");
                        }

                    });

            }
        }
    }

    close() {
        this.dialogRef.close();
    }

}