import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
@Injectable()
export class SharedService {
  private navbarVisibilitySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false);
//   public navbarVisibility$ = this.navbarVisibilitySubject.asObservable();

//   setNavbarVisibility(isVisible: boolean): void {
//     this.navbarVisibilitySubject.next(isVisible);
//   }

private isNavbarVisibleSubject: Subject<boolean> = new Subject<boolean>();
  public isNavbarVisible$ = this.isNavbarVisibleSubject.asObservable();
  
  private localStorageKey = 'isNavbarVisible'; // Key trong LocalStorage
  
  constructor() {
    // Khởi tạo giá trị ban đầu từ LocalStorage
    const storedValue = localStorage.getItem(this.localStorageKey);
    this.isNavbarVisibleSubject.next(storedValue ? JSON.parse(storedValue) : true);
  }
  
  public setIsNavbarVisible(isVisible: boolean): void {
    this.isNavbarVisibleSubject.next(isVisible);
    localStorage.setItem(this.localStorageKey, JSON.stringify(isVisible)); // Lưu vào LocalStorage
  }

}