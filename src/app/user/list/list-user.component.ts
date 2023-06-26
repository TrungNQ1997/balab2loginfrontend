import { Component } from '@angular/core';
import 'hammerjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from "@angular/material";
import { TranslateService } from '@ngx-translate/core';
import { EditUserComponent } from '../edit/edit-user.component';

import { ModalComfirmComponent } from '../../common/modal-comfirm/modal-comfirm.component';
import { ViewChild } from '@angular/core';
import { MatColumnDef } from '@angular/material';
import { ViewChildren, QueryList } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service';
import * as XLSX from 'xlsx';
import {   ElementRef } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
 


@Component({
    selector: 'app-list-user',
    templateUrl: './list-user.component.html',
    styleUrls: ['./list-user.component.css']
})
export class ListUserComponent {
    @ViewChild('table', { static: false }) table: ElementRef;
  @ViewChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;

    displayedColumns: string[] = ['selected', 'id', 'ho_ten', 'username', 'ngay_sinh_text', 'gioi_tinh_text', 'sdt', 'email', 'edit', 'delete'];
    dataSource: any;
    isUserIconVisible: boolean = false;
    pageSizeOptions: any;
    formatDate = 'dd/MM/yyyy';
    isShowDelete = false;
    isRoleShow = false;
    isRoleAdmin = false;
    isRoleAdd = false;
    isRoleEdit = false;
    isRoleDelete = false;
    isExpanded = false;
    birthdayFrom="" ;
    birthdayTo = "";
    pageNumber = 1;
    textSearch = "";
    pageSize: number;
    rowStart:number = 0;
    rowEnd:number = 0;
    totalNumberPage = 0;
    totalCountListAll = 0;
    arrayPage: any = [];
    modalOptions: NgbModalOptions = {
        // size:'700px',
        windowClass : "myCustomModalClass",

        centered: true // Căn giữa modal
      };
    gioiTinhSearch: number;
    gioiTinhList: any;
    listPaging: any;
    users = [
    ];
    users1 = this.users;

    
    constructor(private translateService: TranslateService,
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router, private toastr: ToastrService,
        private sharedService: SharedService, private modalService: NgbModal
    ) {
        this.translateService.setDefaultLang('vi');

        this.translateService.use('vi');

    }
 
    ngOnInit() {
        this.checkLoginAndRole();
        
        this.birthdayFrom = "";
        this.birthdayTo = "";
        this.pageNumber = 0;
        this.textSearch = "";
        this.pageSize = 10;
        this.totalNumberPage = 0;
        this.totalCountListAll = 0;

        this.pageSizeOptions = [5, 10, 20];
        this.dataSource = new MatTableDataSource<any>();
        this.gioiTinhSearch = 0;
        this.getListUser();
        this.listPaging = [
            {
                value: 5
            },
            {
                value: 10
            },
            {
                value: 20
            }
        ];
        this.gioiTinhList = [
            { value: 0, viewValue: "Tất cả" },
            { value: 1, viewValue: "Nam" },
            { value: 2, viewValue: "Nữ" },
            { value: 3, viewValue: "Khác" }];

    }
 
    ngAfterViewInit() {
        this.columnDefs.forEach((columnDef) => {
            columnDef.sticky = false;
        });
    }
    onPaginateChange($event) {
        this.pageNumber = $event.pageIndex;
        this.pageSize = $event.pageSize;
        this.getListUser();

    }
    exportTableToPDF() {
        const doc = new jsPDF();
        const table = this.table.nativeElement;
      
        html2canvas(table).then((canvas) => {
          const imageData = canvas.toDataURL('image/png');
          const imgWidth = 210; // Width of A4 in mm (approximate)
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
          doc.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
          
          doc.save('table_data.pdf');
        });
      }

      printTable() {
        const doc = new jsPDF();
        const table = this.table.nativeElement;
      
        html2canvas(table).then((canvas) => {
          const imageData = canvas.toDataURL('image/png');
          const imgWidth = 210; // Width of A4 in mm (approximate)
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
          doc.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
          
          doc.autoPrint();
          const printWindow = window.open('', '_blank');
          printWindow.document.open();
          printWindow.document.write('<html><head><title>In</title></head><body>' + doc.output('datauristring') + '</body></html>');
          printWindow.document.close();
        });
      }
       
    exportToExcel(): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'data');
      }
    
      private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url: string = window.URL.createObjectURL(data);
        const link: HTMLAnchorElement = document.createElement('a');
        link.href = url;
        link.download = fileName + '.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
      }
       
    deleteUser($event, a) {

        var notis = "Bạn có đồng ý xóa người dùng này không?"
       
        var modalRef = this.modalService.open(ModalComfirmComponent,this.modalOptions);

        modalRef.componentInstance.data = {
                    id: 1,
                    title: 'Xác nhận xóa',
                    content: notis,
                    contentBold: a.username
                };
 
        modalRef.result.then((result) => {

            if (result == "ok") {
                        var t: any = new Object();
                        t.array = [];
                        t.array.push(a)
        
                        this.callDeleteUser(t);
                    }
 
        }).catch((error) => {
        
        });
 
    }

    selectAll() {
        this.users.forEach(function (item) {
            item.selected = !item.selected;
        })
        this.changCheckBox();
    }

    callDeleteUser(users: any) {

        var t: any;
        t = new Object();
        t.listDelete = [];
        t.user_id = "2";
        users.array.forEach(element => {
            t.listDelete.push({
                id: element.id,
                username: element.username

            });
        });

        this.http.post<any>('http://10.1.11.110:5017/' + 'user/deleteUser',
            t, this.sharedService.httpOptions)
            .subscribe(response => {
                if (response.data.result == 0) {
                    this.toastr.success("Xóa thành công", "Thông báo")
                    this.getListUser();
                } else {
                    this.toastr.error("Xóa thất bại", "Thông báo")
                }
            });

    }

    deleteList() {
        var listDelete = this.users.filter(m => m.selected == true);
        if (listDelete.length == 0) {
            this.toastr.error("Chọn người dùng cần xóa!")
        } else {

            var notis = "Bạn có đồng ý xóa những người dùng này không? ";
            var listUser = "";
            listDelete.forEach(function (elem, idx, listDelete) {
                if (idx == (listDelete.length - 1)) {
                    listUser = listUser + " " + elem.username + " ";
                } else {
                    listUser = listUser + " " + elem.username + ",";
                }

            })
 
            var modalRef = this.modalService.open(ModalComfirmComponent,this.modalOptions);
    
            modalRef.componentInstance.data = {
                        id: 1,
                        title: 'Xác nhận xóa',
                        content: notis,
                        contentBold: listUser 
                    };
     
            modalRef.result.then((result) => {
    
                if (result == "ok") {
                    this.callDeleteList();
                        }
     
            }).catch((error) => {
            console.log(error)
            });
     
        }
    }

    callDeleteList() {

        var t: any;
        t = new Object();
        t.listDelete = this.users.filter(m => m.selected == true);
        t.user_id = "2";
        this.http.post<any>('http://10.1.11.110:5017/' + 'user/deleteUser',
            t, this.sharedService.httpOptions)
            .subscribe(response => {
                if (response.data.result == 0) {
                    this.toastr.success("Xóa thành công", "Thông báo");
                    this.getListUser();
                } else {
                    this.toastr.error("Xóa thất bại", "Thông báo");
                }
            });
    }

    search() {
        // console.log(this.sharedService);
        this.pageNumber = 0;
        this.getListUser();

    }

    getListUser() {

        var t: any;

        var dayTo = "";
if(this.birthdayTo){
    dayTo = new Date(this.birthdayTo).toLocaleDateString();
}
var dayFrom = "";
if(this.birthdayFrom){
    dayFrom = new Date(this.birthdayFrom).toLocaleDateString();
}
 
        t = {
            "user_id": "1",
            "page_number": this.pageNumber + 1,
            "gioi_tinh_search": this.gioiTinhSearch,
            "birthday_to": dayTo,
            "birthday_from": dayFrom,
            "text_search": this.textSearch,
            "page_size": this.pageSize

        }

        this.http.post<any>('http://10.1.11.110:5017/' + 'user/getListUserFilter',
            t, this.sharedService.httpOptions)
            .subscribe(response => {

                this.users = response.data.list;
                this.dataSource.data = this.users;
                this.totalCountListAll = response.data.count[0].count;
                this.changCheckBox();
                this.changePageSize();
                // this.paginator.length = response.count[0].count;
            });

    }

changePageSize(){
    
    this.totalNumberPage = Math.ceil(this.totalCountListAll/this.pageSize);
    this.arrayPage = [];
    for (var i = 0; i < this.totalNumberPage; i++) {
        this.arrayPage.push({
            value:i,
            text:(i+1)
        });
      }

      if(this.totalCountListAll == 0){
        this.rowStart = 0;
        this.rowEnd = 0;
      } else {
        this.rowStart = (this.pageSize * this.pageNumber) + 1;
        this.rowEnd = this.rowStart + this.users.length -1;
      }
    
}

    changCheckBox() {
        if (this.users.filter(i => i.selected == true).length > 0) {
            this.isShowDelete = true;
        } else {
            this.isShowDelete = false;
        }
    }
 
    selectPage(i){
        this.pageNumber = i;
        this.getListUser();
    }

    nextPage(){
        if(this.pageNumber < (this.totalNumberPage - 1))
        this.pageNumber = this.pageNumber + 1;
        this.getListUser();
    }
    prePage(){
        if(this.pageNumber > 0)
        this.pageNumber = this.pageNumber - 1;
        this.getListUser();
    }
    maxPage(){
        
        this.pageNumber = this.totalNumberPage - 1;
        this.getListUser();
    }
    minPage(){
        
        this.pageNumber = 0;
        this.getListUser();
    }
    ChangeCbbPageSize() {
        this.pageNumber=0;
        this.getListUser();
    }
    checkLoginAndRole() {

        var session = sessionStorage.getItem("login");
        if (session == "true") {
            this.sharedService.callGetRole(token).subscribe(result => {
                this.isRoleAdmin = result.data.is_admin[0].is_admin
                if (this.isRoleAdmin) {
                    this.isRoleShow = true;
                    this.isRoleAdd = true;
                    this.isRoleEdit = true;
                    this.isRoleDelete = true;
                } else {

                    if (result.data.role) {
                        var roleShow = result.data.role.filter(m => m.action == "show");
                        var roleAdd = result.data.role.filter(m => m.action == "add");
                        var roleEdit = result.data.role.filter(m => m.action == "edit");
                        var roleDelete = result.data.role.filter(m => m.action == "delete");
                        if (roleShow.length > 0) {
                            this.isRoleShow = true;
                        }
                        if (roleAdd.length > 0) {
                            this.isRoleAdd = true;
                        }
                        if (roleEdit.length > 0) {
                            this.isRoleEdit = true;
                        }
                        if (roleDelete.length > 0) {
                            this.isRoleDelete = true;
                        }

                        if (!this.isRoleShow) {
                            this.router.navigate([''], { relativeTo: this.route });
                        }

                    }

                    else {
                        this.router.navigate([''], { relativeTo: this.route });
                    }

                }

            })
        } else {

            var token = this.sharedService.getCookie("token");
            if (token) {
                this.sharedService.callCheckLoginAndGetRole(token).subscribe(result => {
                    if (result.data.is_login) {

                        this.isRoleAdmin = result.data.is_admin[0].is_admin
                        if (this.isRoleAdmin) {
                            this.isRoleShow = true;
                            this.isRoleAdd = true;
                            this.isRoleEdit = true;
                            this.isRoleDelete = true;
                        } else {

                            if (result.data.role) {
                                var roleShow = result.data.role.filter(m => m.action == "show");
                                var roleAdd = result.data.role.filter(m => m.action == "add");
                                var roleEdit = result.data.role.filter(m => m.action == "edit");
                                var roleDelete = result.data.role.filter(m => m.action == "delete");
                                if (roleShow.length > 0) {
                                    this.isRoleShow = true;
                                }
                                if (roleAdd.length > 0) {
                                    this.isRoleAdd = true;
                                }
                                if (roleEdit.length > 0) {
                                    this.isRoleEdit = true;
                                }
                                if (roleDelete.length > 0) {
                                    this.isRoleDelete = true;
                                }

                                if (!this.isRoleShow) {
                                    this.router.navigate([''], { relativeTo: this.route });
                                }

                            }

                            else {
                                this.router.navigate([''], { relativeTo: this.route });
                            }

                        }

                    } else {
                        this.router.navigate([''], { relativeTo: this.route });
                    }
                });

            } else {
                this.router.navigate([''], { relativeTo: this.route });
            }

        }

    }

    add() {
 
        var modalRef = this.modalService.open(EditUserComponent,this.modalOptions);
    
        modalRef.componentInstance.data = {
            id: 1,
            title: 'Thêm người dùng',
            statusForm: 'add'
                };
 
        modalRef.result.then((result) => {

            if (result == "ok") {
                this.getListUser();
                    }
 
        }).catch((error) => {
        console.log(error)
        });

    }

    editUser(event: any, user: any) {
 
        var modalRef = this.modalService.open(EditUserComponent,this.modalOptions);
    
        modalRef.componentInstance.data = {
            data: Object.assign({}, user) ,
                    title: 'Sửa người dùng',
                    statusForm: 'edit'
                };
 
        modalRef.result.then((result) => {

            if (result == "ok") {
                this.getListUser();
                    }
 
        }).catch((error) => {
        console.log(error)
        });

 
    }


}
