import { Component } from '@angular/core';
import 'hammerjs';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogConfig, MatTableDataSource } from "@angular/material";
import { TranslateService } from '@ngx-translate/core';
import { EditUserComponent } from '../edit/edit-user.component';

import { ModalComfirmComponent } from '../../common/modal-comfirm/modal-comfirm.component';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatColumnDef } from '@angular/material';
import { ViewChildren, QueryList } from '@angular/core';
import { CustomPaginatorIntl } from '../../CustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material';

@Component({
    selector: 'app-list-user',
    templateUrl: './list-user.component.html',
    styleUrls: ['./list-user.component.css']
})
export class ListUserComponent {
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;

    displayedColumns: string[] = ['selected', 'id', 'ho_ten', 'username', 'ngay_sinh_text', 'gioi_tinh_text', 'sdt', 'email', 'edit', 'delete'];
    dataSource: any;
    pageSizeOptions: any;
    isRoleShow = false;
    isRoleAdmin = false;
    isRoleAdd = false;
    isRoleEdit = false;
    isRoleDelete = false;
    isExpanded = false;
    birthdayFrom = "";
    birthdayTo = "";
    pageNumber = 1;
    textSearch = "";
    pageSize: number;
    totalNumberPage = 0;
    totalCountListAll = 0;
    arrayPage: any;
    gioiTinhSearch: number;
    gioiTinhList: any;
    listPaging: any;
    users = [
    ];
    users1 = this.users;

    ngAfterViewInit() {
        this.columnDefs.forEach((columnDef) => {
            columnDef.sticky = false;
        });
    }
    onPaginateChange($event) {
        this.pageNumber = $event.pageIndex;
        this.pageSize = $event.pageSize;
        this.getListUser();


        console.log($event);

    }
    deleteUser($event, a) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.height = 'auto',
            dialogConfig.width = '800px',
            dialogConfig.position = {
                'top': 'calc(50vh - 350px)',
                left: 'calc(50vh - 250px)'
            };
        dialogConfig.data = {
            id: 1,
            title: 'Xác nhận xóa',
            content: 'Bạn có đồng ý xóa không?'
        };
        var modal = this.dialog.open(ModalComfirmComponent, dialogConfig);
        modal.afterClosed().subscribe(result => {
            console.log(result);
            if (result == "ok") {
                var t: any = new Object();
                t.array = [];
                t.array.push(a)

                this.callDeleteUser(t);
            }
        })

    }

    callDeleteUser(users: any) {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

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
            t, httpOptions)
            .subscribe(response => {
                if (response.result == 0) {
                    this.getListUser();
                }
            });

    }

    deleteList() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.height = 'auto',
            dialogConfig.width = '800px',
            dialogConfig.position = {
                'top': 'calc(50vh - 350px)',
                left: 'calc(50vh - 250px)'
            };
        dialogConfig.data = {
            id: 1,
            title: 'Xác nhận xóa',
            content: 'Bạn có đồng ý xóa không?'
        };
        var modal = this.dialog.open(ModalComfirmComponent, dialogConfig);
        modal.afterClosed().subscribe(result => {
            console.log(result);
            if (result == "ok") {
                this.callDeleteList();
            }
        })
    }

    callDeleteList() {



        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };
        var t: any;
        t = new Object();
        t.listDelete = this.users.filter(m => m.selected == true);
        t.user_id = "2";
        this.http.post<any>('http://10.1.11.110:5017/' + 'user/deleteUser',
            t, httpOptions)
            .subscribe(response => {
                if (response.result == 0) {
                    this.getListUser();
                }
            });
    }

    search() {
        this.getListUser();

    }

    getListUser() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        var t: any;
        t = {
            "user_id": "1",
            "page_number": this.pageNumber + 1,
            "gioi_tinh_search": this.gioiTinhSearch,
            "birthday_to": this.birthdayTo,
            "birthday_from": this.birthdayFrom,
            "text_search": this.textSearch,
            "page_size": this.pageSize

        }

        this.http.post<any>('http://10.1.11.110:5017/' + 'user/getListUserFilter',
            t, httpOptions)
            .subscribe(response => {

                this.users = response.list;
                this.dataSource.data = this.users;
                this.totalCountListAll = response.count[0].count;
                // this.paginator.length = response.count[0].count;
            });

    }

    callCheckLoginAndGetRole(token: any): Observable<any> {
        var ui: any = new Object();
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        };

        var t: any;
        t = {
            "token": token,
            "menu_id": 1
        }

        return this.http.post<any>('http://10.1.11.110:5017/' + 'user/checklogingetrole',
            t, httpOptions)

    }

    logout() {
        localStorage.clear();
        this.deleteAllCookies();
        this.router.navigate([''], { relativeTo: this.route });
    }

    checkLoginAndRole() {
        var token = this.getCookie("token");
        if (token) {
            this.callCheckLoginAndGetRole(token).subscribe(result => {
                if (result.is_login) {

                    this.isRoleAdmin = result.is_admin[0].is_admin
                    if (this.isRoleAdmin) {
                        this.isRoleShow = true;
                        this.isRoleAdd = true;
                        this.isRoleEdit = true;
                        this.isRoleDelete = true;
                    } else {

                        if (result.role) {
                            var roleShow = result.role.filter(m => m.action == "show");
                            var roleAdd = result.role.filter(m => m.action == "add");
                            var roleEdit = result.role.filter(m => m.action == "edit");
                            var roleDelete = result.role.filter(m => m.action == "delete");
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

    getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    deleteAllCookies() {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    add() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.height = 'auto',
            dialogConfig.width = '800px',
            dialogConfig.position = {
                'top': 'calc(50vh - 350px)',
                left: 'calc(50vh - 250px)'
            };
        dialogConfig.data = {
            id: 1,
            title: 'Thêm người dùng',
            statusForm: 'add'
        };
        var modal = this.dialog.open(EditUserComponent, dialogConfig);
        modal.afterClosed().subscribe(result => {
            console.log(result);
            if (result == "ok") {
                this.getListUser();
            }
        })

    }

    changePageSize() {

        if ((this.totalCountListAll % this.pageSize) == 0) {
            this.totalNumberPage = Math.floor(this.totalCountListAll / this.pageSize)
        } else {
            this.totalNumberPage = Math.floor(this.totalCountListAll / this.pageSize) + 1;
        }

        this.arrayPage = Array(this.totalNumberPage).fill(1).map((x, i) => i + 1);
    }

    editUser(event: any, user: any) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.height = 'auto',
            dialogConfig.width = '800px',
            dialogConfig.position = {
                'top': 'calc(50vh - 350px)',
                left: 'calc(50vh - 250px)'
            };
        dialogConfig.data = {
            data: user,
            title: 'Sửa người dùng',
            statusForm: 'edit'

        };
        var modal = this.dialog.open(EditUserComponent, dialogConfig);
        modal.afterClosed().subscribe(result => {
            console.log(result);
            if (result == "ok") {
                this.getListUser();
            }
        })

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

    constructor(private translateService: TranslateService,
        private http: HttpClient,
        private dialog: MatDialog, private route: ActivatedRoute,
        private router: Router
    ) {
        this.translateService.setDefaultLang('vi');

        this.translateService.use('vi');

    }
}
