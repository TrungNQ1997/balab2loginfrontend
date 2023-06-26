import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css']
})
export class SimpleComponent implements OnInit {

  numberDiv:number = 49;
arrayDiv:number[] = [];
  constructor() { }



  ngOnInit() {
    for(var i = 1;i <= this.numberDiv;i++){
this.arrayDiv.push(i);
    }
  }

}
