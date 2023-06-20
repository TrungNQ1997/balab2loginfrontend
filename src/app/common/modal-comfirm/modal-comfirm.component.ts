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
         
         
    }
  
    save() {
        this.dialogRef.close("ok");
}

    close() {
        this.dialogRef.close();
    }  

}