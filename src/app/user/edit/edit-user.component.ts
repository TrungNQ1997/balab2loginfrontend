import { Component, Inject } from '@angular/core';
 
import {Md5} from 'ts-md5/dist/md5';
 
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { HttpClient, HttpHeaders } from '@angular/common/http';
 


@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
     
     
})
export class EditUserComponent {
    /*form: FormGroup;*/
    description: string;
    notis:string;
    user: any ;
    data:any;
    showMes:boolean;
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
        if(this.data.statusForm == 'edit'){
this.user=this.data.data;
        } else if(this.data.statusForm == 'add') {
            this.user = new Object();
            
            this.user.ho_ten = "";
            this.user.gioi_tinh = 1;
            this.user.is_admin = false;
            this.user.is_active = true;
            this.user.ngay_sinh = new Date();
        }
        
        this.gioiTinhList = [{ value: 1, viewValue: "Nam" },
            { value: 2, viewValue: "Nữ" },
            { value: 3, viewValue: "Khác" }]
        //this.form = this.fb.group({
        //    description: [this.description, []],
            
        //});
    }


    checkValid(){

        
        if(!this.user.username ){
            this.notis="Tên đăng nhập không được để trống"
            this.showMes = true;
            return false;
        }
        if(this.user.password != this.user.rePassword){
            this.notis="Nhập lại mật khẩu không đúng"
            this.showMes = true;
            return false;
        }
        return true;
    }

    save() {
        var valid = this.checkValid();
if(valid){

if(this.data.statusForm == 'add'){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        
this.user.user_id = '2';
//this.user.password = Md5.hashStr(this.user.password)
        this.http.post<any>('http://localhost:5017/' + 'user/adduser',
            this.user, httpOptions)
            .subscribe(response => {

                if(response.result == 0){
                    this.dialogRef.close("ok");
                }
                  
            });

        
    } else if(this.data.statusForm == 'edit') {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        
this.user.user_id = '2';
//this.user.password = Md5.hashStr(this.user.password)
        this.http.post<any>('http://localhost:5017/' + 'user/edituser',
            this.user, httpOptions)
            .subscribe(response => {

                if(response){
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