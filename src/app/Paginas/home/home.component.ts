import { Component, OnInit } from '@angular/core';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  nomeUsuario = '';
  constructor() { }

  ngOnInit(): void {
    this.PrimeiroNomeUsuario();
  }

  PrimeiroNomeUsuario() {
    let indice = sessionStorage.getItem('nomeUsuario').indexOf(" ");
    this.nomeUsuario = sessionStorage.getItem('nomeUsuario').substring(0, indice);
  }

}
