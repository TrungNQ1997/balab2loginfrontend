import { Component, Inject, Input } from '@angular/core';
 

 
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { HttpClient, HttpHeaders } from '@angular/common/http';
 import{ListUserComponent} from '../../user/list/list-user.component';
 import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-comfirm',
    templateUrl: './modal-comfirm.component.html',
    styleUrls: ['./modal-comfirm.component.css']
     
     
})
export class ModalComfirmComponent {
    @Input() data: any;
     
    description: string;
    notis:string;
    content:string;
    user: any ;
     
    showMes:boolean;
    gioiTinhList: any;

    constructor(
        
        private http: HttpClient,
        public modal: NgbActiveModal
        ) {
           
    }

    ngOnInit() {
          
    }
  
    save() {
        this.modal.close("ok");
}

    close() {
        this.modal.close();
    }  

}