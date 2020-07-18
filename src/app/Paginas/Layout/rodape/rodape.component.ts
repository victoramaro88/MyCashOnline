import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.css']
})
export class RodapeComponent implements OnInit {
  versSistema = '';

  constructor() { }

  ngOnInit(): void {
    this.versSistema = environment.versaoSistema;
  }

}
