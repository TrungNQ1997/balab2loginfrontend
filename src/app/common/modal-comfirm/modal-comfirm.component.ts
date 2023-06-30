import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-comfirm',
    templateUrl: './modal-comfirm.component.html',
    styleUrls: ['./modal-comfirm.component.css']


})
export class ModalComfirmComponent {
    @Input() data: any;

    description: string;
    notis: string;
    content: string;
    user: any;

    showMes: boolean;
    gioiTinhList: any;

    constructor(

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