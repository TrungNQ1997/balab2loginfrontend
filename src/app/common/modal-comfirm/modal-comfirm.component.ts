import { Component, Inject } from '@angular/core';
 

 
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { HttpClient, HttpHeaders } from '@angular/common/http';
 import{ListUserComponent} from '../../user/list/list-user.component';


@Component({
    selector: 'app-modal-comfirm',
    templateUrl: './modal-comfirm.component.html',
    styleUrls: ['./modal-comfirm.component.css']
     
     
})
export class ModalComfirmComponent {
    /*form: FormGroup;*/
    description: string;
    notis:string;
    content:string;
    user: any ;
    data:any;
    showMes:boolean;
    gioiTinhList: any;
    constructor(
        /*private fb: FormBuilder,*/
        private dialogRef: MatDialogRef<ListUserComponent>,
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
        this.dialogRef.close("ok");
}

    close() {
        this.dialogRef.close();
    }  

}