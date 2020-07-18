import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinnerload',
  templateUrl: './spinnerload.component.html',
  styleUrls: ['./spinnerload.component.css']
})
export class SpinnerloadComponent implements OnInit {

  constructor() {
    SpinnerloadComponent.blocked = true;
   }

  get staticBlocked() {
    return SpinnerloadComponent.blocked;
  }

  static blocked = false;

  ngOnInit(): void {
  }

}
