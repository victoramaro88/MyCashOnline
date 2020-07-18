import { Component, OnInit } from '@angular/core';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html',
  styleUrls: ['./menu-superior.component.css']
})
export class MenuSuperiorComponent implements OnInit {

  constructor(
    private httpRequisicao: RequisicoesHttpService,
    ) { }

    ngOnInit(): void {
    }

    Logout() {
      sessionStorage.clear();
    }
  }
